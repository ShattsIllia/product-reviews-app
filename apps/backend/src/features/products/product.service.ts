import { Injectable } from '@nestjs/common';
import type { Product } from '@prisma/client';
import { ProductRepository } from './product.repository';
import { NotFoundException } from '../../common/exceptions/app.exception';

type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

@Injectable()
export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async getProducts(
    page: number = 1,
    limit: number = 12,
    search?: string,
    category?: string
  ): Promise<PaginatedResult<Product>> {
    const { products, total } = await this.productRepository.findMany(
      page,
      limit,
      search,
      category
    );

    return {
      data: products,
      total,
      page,
      limit,
    };
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.productRepository.findCategories();
    return categories.map((c: { category: string }) => c.category);
  }
}
