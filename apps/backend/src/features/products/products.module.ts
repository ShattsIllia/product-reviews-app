import { Module } from '@nestjs/common';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductRepository } from './product.repository';
import { ProductRatingService } from './product-rating.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, ProductRepository, ProductRatingService],
  exports: [ProductService, ProductRepository, ProductRatingService],
})
export class ProductsModule {}
