import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { UserRepository } from '../users/user.repository';
import { RegisterDto, LoginDto } from '@app/shared/dto/auth.dto';
import { UnauthorizedException } from '../../common/exceptions/app.exception';
import { JwtPayload, AuthResponse, RegistrationResponse, UserProfile } from './auth.types';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly REGISTRATION_SUCCESS_MESSAGE =
    'Account registered successfully. Please login with your credentials.';

  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService
  ) {}

  async register(dto: RegisterDto): Promise<RegistrationResponse> {
    const existingUser: User | null = await this.userRepository.findByEmail(dto.email);

    if (existingUser) {
      this.logger.warn(`Registration attempt with existing email - enumeration prevention`, {
        email: dto.email,
        timestamp: new Date().toISOString(),
      });
      return { message: this.REGISTRATION_SUCCESS_MESSAGE };
    }

    const passwordHash: string = await bcrypt.hash(dto.password, 10);
    const avatarImg = Math.floor(Math.random() * 70) + 1;

    const user: User = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      displayName: dto.displayName,
      avatarUrl: `https://i.pravatar.cc/150?img=${avatarImg}`,
    });

    this.logger.debug(`User registered successfully`, {
      userId: user.id,
      email: this.maskEmail(user.email),
    });

    return { message: this.REGISTRATION_SUCCESS_MESSAGE };
  }

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user: User | null = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid: boolean = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    this.logger.debug(`User logged in successfully`, {
      userId: user.id,
      email: this.maskEmail(user.email),
    });

    return this.formatAuthResponse(user);
  }

  async getProfile(userId: string): Promise<UserProfile> {
    const user: User | null = await this.userRepository.findById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }

  private generateAccessToken(userId: string, email: string, role: string): string {
    const payload: JwtPayload = {
      sub: userId,
      email,
      role,
    };

    return this.jwtService.sign<JwtPayload>(payload);
  }

  /**
   * Format auth response after successful authentication
   * Used by login endpoint
   */
  private formatAuthResponse(user: User): AuthResponse {
    const accessToken: string = this.generateAccessToken(user.id, user.email, user.role);
    return {
      accessToken,
    };
  }

  /**
   * Mask email for logging: show first 2 chars + domain
   * e.g., test@example.com → te***@example.com
   */
  private maskEmail(email: string): string {
    const [local, domain] = email.split('@');
    const masked = local.substring(0, 2) + '***';
    return `${masked}@${domain}`;
  }
}
