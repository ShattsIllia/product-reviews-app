import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '@app/shared/dto/auth.dto';
import { AuthResponse, RegistrationResponse } from './auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * POST /auth/register
   * Create account and return success message
   * User must login separately to get access token
   */
  @Throttle({ short: { limit: 5, ttl: 60000 }, long: { limit: 20, ttl: 900000 } })
  @Post('register')
  async register(@Body(ValidationPipe) dto: RegisterDto): Promise<RegistrationResponse> {
    return this.authService.register(dto);
  }

  /**
   * POST /auth/login
   * Authenticate and return access token
   */
  @Throttle({ short: { limit: 5, ttl: 60000 }, long: { limit: 20, ttl: 900000 } })
  @Post('login')
  async login(@Body(ValidationPipe) dto: LoginDto): Promise<AuthResponse> {
    return this.authService.login(dto);
  }
}
