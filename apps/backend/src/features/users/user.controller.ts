import { Controller, Get, Patch, UseGuards, Body } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UpdateUserDto } from '@app/shared/dto/user.dto';
import type { UserPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() user: UserPayload) {
    return this.userService.getUserById(user.id);
  }

  @Patch('me')
  async updateMyProfile(@CurrentUser() user: UserPayload, @Body() dto: UpdateUserDto) {
    return this.userService.updateUser(user.id, dto);
  }
}
