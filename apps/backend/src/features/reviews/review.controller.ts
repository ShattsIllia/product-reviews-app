import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewDetailController {
  constructor(private readonly reviewService: ReviewService) {}

  @Delete(':id')
  async deleteReview(@Param('id') id: string, @CurrentUser() user: UserPayload) {
    await this.reviewService.deleteReview(id, user.id);
    return { statusCode: 204 };
  }
}
