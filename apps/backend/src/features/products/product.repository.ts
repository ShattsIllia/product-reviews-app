import { Injectable, Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import type { PrismaTransactionClient } from '../../infrastructure/database/prisma-tx.type';
import { NotFoundException } from '../../common/exceptions/app.exception';

@Injectable()
export class ProductRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async findByIdTx(tx: PrismaTransactionClient, id: string) {
    return tx.product.findUnique({ where: { id } });
  }

  async findMany(page: number = 1, limit: number = 10, search?: string, category?: string) {
    const skip = (page - 1) * limit;
    const where: Prisma.ProductWhereInput = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = category;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total };
  }

  async findCategories() {
    return this.prisma.product.findMany({
      distinct: ['category'],
      select: { category: true },
    });
  }

  /**
   * One atomic UPDATE: increments reviewCount and ratingSum, then sets averageRating from the new values.
   * Avoids read-then-write races and skips per-request aggregate scans over all reviews.
   */
  async applyRatingDelta(
    tx: PrismaTransactionClient,
    productId: string,
    countDelta: number,
    sumDelta: number
  ): Promise<void> {
    const updated = await tx.$executeRaw(
      Prisma.sql`
                UPDATE "products"
                SET
                    "reviewCount" = "reviewCount" + ${countDelta},
                    "ratingSum" = "ratingSum" + ${sumDelta},
                    "averageRating" = CASE
                        WHEN ("reviewCount" + ${countDelta}) > 0
                        THEN ("ratingSum" + ${sumDelta})::double precision / ("reviewCount" + ${countDelta})
                        ELSE NULL
                    END,
                    "updatedAt" = NOW()
                WHERE id = ${productId}
            `
    );

    if (updated === 0) {
      throw new NotFoundException('Product not found');
    }
  }
}
