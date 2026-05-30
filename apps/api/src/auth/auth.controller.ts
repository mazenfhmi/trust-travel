import { Controller, Post, Body, UseGuards, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(AuthGuard('jwt-refresh'))
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refresh(@CurrentUser() user: User, @Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refresh(user.id, refreshTokenDto.refreshToken);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout(@CurrentUser() user: User) {
    return this.authService.logout(user.id);
  }

  @Get('me')
  getProfile(@CurrentUser() user: User) {
    const { passwordHash, refreshToken, ...userWithoutSecrets } = user;
    return userWithoutSecrets;
  }
}
