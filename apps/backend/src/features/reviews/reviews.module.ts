import { Module } from '@nestjs/common';
import { ProductsModule } from '../products/products.module';
import { ReviewDetailController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewRepository } from './review.repository';
import { ProductReviewsController } from '../products/product-reviews.controller';

@Module({
  imports: [ProductsModule],
  controllers: [ProductReviewsController, ReviewDetailController],
  providers: [ReviewService, ReviewRepository],
  exports: [ReviewService],
})
export class ReviewsModule {}
