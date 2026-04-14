import { Controller, Get, Post, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../reviews/review.service';
import { CreateReviewDto } from '@app/shared/dto/review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { UserPayload } from '../../common/interfaces/jwt-payload.interface';

@ApiTags('product-reviews')
@Controller('products/:productId/reviews')
export class ProductReviewsController {
  constructor(private readonly reviewService: ReviewService) {}

  @Get()
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10
  ) {
    return this.reviewService.getReviewsByProduct(productId, Number(page), Number(limit));
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  async createProductReview(
    @Param('productId') productId: string,
    @CurrentUser() user: UserPayload,
    @Body() dto: CreateReviewDto
  ) {
    return this.reviewService.upsertReview(user.id, productId, dto);
  }
}
