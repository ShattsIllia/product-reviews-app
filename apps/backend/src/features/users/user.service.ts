import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { UpdateUserDto } from '@app/shared/dto/user.dto';
import { BadRequestException, NotFoundException } from '../../common/exceptions/app.exception';
import { UserProfile } from '../auth/auth.types';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<UserProfile> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      avatarUrl: user.avatarUrl,
      role: user.role,
    };
  }

  async updateUser(id: string, dto: UpdateUserDto): Promise<UserProfile> {
    if (dto.displayName == null && dto.avatarUrl == null) {
      throw new BadRequestException('No fields to update');
    }

    const updatedUser = await this.userRepository.update(id, {
      displayName: dto.displayName,
      avatarUrl: dto.avatarUrl,
    });

    return {
      id: updatedUser.id,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      avatarUrl: updatedUser.avatarUrl,
      role: updatedUser.role,
    };
  }
}
