import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import type { PrismaTransactionClient } from '../../infrastructure/database/prisma-tx.type';
import { CreateReviewDto } from '@app/shared/dto/review.dto';

const reviewWithAuthor = {
  user: {
    select: {
      displayName: true,
      avatarUrl: true,
    },
  },
} as const;

@Injectable()
export class ReviewRepository {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async findByProductId(productId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where: { productId },
        include: reviewWithAuthor,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),
      this.prisma.review.count({ where: { productId } }),
    ]);

    return { reviews, total };
  }

  // --- Transaction-scoped (no redundant re-fetch after service already validated) ---

  findByIdTx(tx: PrismaTransactionClient, id: string) {
    return tx.review.findUnique({ where: { id } });
  }

  /** Minimal row for upsert delta math (avoids loading author until after write). */
  findByUserAndProductKeyTx(tx: PrismaTransactionClient, userId: string, productId: string) {
    return tx.review.findUnique({
      where: { userId_productId: { userId, productId } },
      select: {
        id: true,
        userId: true,
        productId: true,
        rating: true,
        comment: true,
        updatedAt: true,
      },
    });
  }

  createTx(tx: PrismaTransactionClient, userId: string, productId: string, dto: CreateReviewDto) {
    return tx.review.create({
      data: {
        userId,
        productId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: reviewWithAuthor,
    });
  }

  /**
   * Optimistic update using the previously observed `updatedAt`.
   *
   * Why: prevents stale-read delta corruption by ensuring the update only applies if
   * the row hasn't changed since we computed the delta. When it fails (count=0),
   * the service re-reads and retries with the new persisted value.
   */
  async updateByIdOptimisticTx(
    tx: PrismaTransactionClient,
    id: string,
    prevUpdatedAt: Date,
    rating: number,
    comment: string | null | undefined
  ): Promise<{ updated: boolean }> {
    const res = await tx.review.updateMany({
      where: { id, updatedAt: prevUpdatedAt },
      data: {
        rating,
        comment: comment ?? null,
      },
    });

    return { updated: res.count === 1 };
  }

  getByIdWithAuthorTx(tx: PrismaTransactionClient, id: string) {
    return tx.review.findUnique({
      where: { id },
      include: reviewWithAuthor,
    });
  }

  updateByIdTx(
    tx: PrismaTransactionClient,
    id: string,
    rating: number,
    comment: string | null | undefined
  ) {
    return tx.review.update({
      where: { id },
      data: {
        rating,
        comment: comment ?? null,
      },
      include: reviewWithAuthor,
    });
  }

  deleteByIdTx(tx: PrismaTransactionClient, id: string) {
    return tx.review.delete({ where: { id } });
  }

  /**
   * Optimistic delete using the previously observed `updatedAt`.
   * Returns whether the row was deleted (count === 1).
   */
  async deleteByIdOptimisticTx(
    tx: PrismaTransactionClient,
    id: string,
    prevUpdatedAt: Date
  ): Promise<boolean> {
    const res = await tx.review.deleteMany({ where: { id, updatedAt: prevUpdatedAt } });
    return res.count === 1;
  }
}
