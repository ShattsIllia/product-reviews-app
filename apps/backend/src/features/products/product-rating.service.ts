import { Injectable } from '@nestjs/common';
import { ProductRepository } from './product.repository';
import type { PrismaTransactionClient } from '../../infrastructure/database/prisma-tx.type';

/**
 * Encapsulates incremental product rating updates so ReviewService does not call
 * ProductRepository mutation methods directly.
 */
@Injectable()
export class ProductRatingService {
  constructor(private readonly productRepository: ProductRepository) {}

  /**
   * Atomically adjusts denormalized aggregates on the product row (single SQL UPDATE).
   * Must be called inside the same Prisma transaction as the review write.
   */
  applyDelta(
    tx: PrismaTransactionClient,
    productId: string,
    countDelta: number,
    sumDelta: number
  ): Promise<void> {
    return this.productRepository.applyRatingDelta(tx, productId, countDelta, sumDelta);
  }
}
