import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: jest.Mocked<PrismaService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
    };

    const mockJwtService = {
      sign: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    jwtService = module.get(JwtService);
  });

  describe('register', () => {
    it('should create a new user and return tokens', async () => {
      const registerDto = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      };

      prismaService.user.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prismaService.user.create.mockResolvedValue({
        id: 'user-id',
        email: registerDto.email,
        role: 'TRAVELER',
      } as any);
      jwtService.sign.mockReturnValue('access-token');
      prismaService.user.update.mockResolvedValue({} as any);

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken', 'access-token');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toHaveProperty('email', registerDto.email);
    });

    it('should throw ConflictException if user exists', async () => {
      prismaService.user.findUnique.mockResolvedValue({ id: 'existing-id' } as any);

      await expect(service.register({
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      })).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        isActive: true,
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('access-token');
      prismaService.user.update.mockResolvedValue({} as any);

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken', 'access-token');
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      prismaService.user.findUnique.mockResolvedValue({
        id: 'user-id',
        passwordHash: 'hashedPassword',
        isActive: true,
      } as any);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow(UnauthorizedException);
    });
  });
});
