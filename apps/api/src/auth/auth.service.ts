import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { randomBytes } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const passwordHash = await this.hashPassword(dto.password);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
      },
    });

    return this.generateTokens(user);
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.comparePassword(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async refresh(userId: string, refreshToken: string): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user || user.refreshToken !== refreshToken || !user.isActive) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return this.generateTokens(user);
  }

  async logout(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  private async generateTokens(user: any): Promise<AuthResponseDto> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = randomBytes(64).toString('hex');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 12;
    return bcrypt.hash(password, saltOrRounds);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }
}
