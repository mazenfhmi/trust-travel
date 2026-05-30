import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

/** Typed helper for the mocked Prisma user delegate */
type MockPrismaUser = {
  findUnique: jest.Mock;
  create: jest.Mock;
  update: jest.Mock;
};

describe('AuthService', () => {
  let service: AuthService;
  let prismaUser: MockPrismaUser;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    prismaUser = {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    };

    const mockPrismaService = { user: prismaUser };

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

      prismaUser.findUnique.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      prismaUser.create.mockResolvedValue({
        id: 'user-id',
        email: registerDto.email,
        role: 'TRAVELER',
      });
      jwtService.sign.mockReturnValue('access-token');
      prismaUser.update.mockResolvedValue({});

      const result = await service.register(registerDto);

      expect(result).toHaveProperty('accessToken', 'access-token');
      expect(result).toHaveProperty('refreshToken');
      expect(result.user).toHaveProperty('email', registerDto.email);
    });

    it('should throw ConflictException if user exists', async () => {
      prismaUser.findUnique.mockResolvedValue({ id: 'existing-id' });

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
      prismaUser.findUnique.mockResolvedValue({
        id: 'user-id',
        email: 'test@example.com',
        passwordHash: 'hashedPassword',
        isActive: true,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwtService.sign.mockReturnValue('access-token');
      prismaUser.update.mockResolvedValue({});

      const result = await service.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken', 'access-token');
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      prismaUser.findUnique.mockResolvedValue({
        id: 'user-id',
        passwordHash: 'hashedPassword',
        isActive: true,
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login({
        email: 'test@example.com',
        password: 'wrongpassword',
      })).rejects.toThrow(UnauthorizedException);
    });
  });
});
