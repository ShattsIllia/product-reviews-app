import { Injectable } from '@nestjs/common';
import { Prisma, type Review } from '@prisma/client';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import type { PrismaTransactionClient } from '../../infrastructure/database/prisma-tx.type';
import { ReviewRepository } from './review.repository';
import { ProductRepository } from '../products/product.repository';
import { ProductRatingService } from '../products/product-rating.service';
import { CreateReviewDto } from '@app/shared/dto/review.dto';
import { NotFoundException, ConflictException, ForbiddenException } from '../../common/exceptions/app.exception';

type ReviewWithAuthor = Prisma.ReviewGetPayload<{
  include: {
    user: {
      select: {
        displayName: true;
        avatarUrl: true;
      };
    };
  };
}>;

type PaginatedResult<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
};

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewRepository: ReviewRepository,
    private readonly productRepository: ProductRepository,
    private readonly productRatingService: ProductRatingService
  ) {}

  private readonly MAX_OPTIMISTIC_RETRIES = 3;

  async getReviewsByProduct(
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<ReviewWithAuthor>> {
    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const { reviews, total } = await this.reviewRepository.findByProductId(productId, page, limit);

    return {
      data: reviews,
      total,
      page,
      limit,
    };
  }

  private async withOptimisticRetries<T>(fn: () => Promise<T>): Promise<T> {
    // IMPORTANT: retry is OUTSIDE the transaction.
    // Each attempt starts a NEW transaction so it does not reuse a potentially stale snapshot.
    for (let attempt = 0; attempt < this.MAX_OPTIMISTIC_RETRIES; attempt++) {
      try {
        return await fn();
      } catch (e: unknown) {
        if (this.isOptimisticConflict(e)) continue;
        throw e;
      }
    }
    throw new ConflictException('Review was updated concurrently. Please retry.');
  }

  private async requireProductTx(tx: PrismaTransactionClient, productId: string): Promise<void> {
    const product = await this.productRepository.findByIdTx(tx, productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }

  private async createReviewAttempt(
    userId: string,
    productId: string,
    dto: CreateReviewDto
  ): Promise<ReviewWithAuthor> {
    return this.prisma.$transaction(async (tx) => {
      await this.requireProductTx(tx, productId);
      const created = await this.reviewRepository.createTx(tx, userId, productId, dto);
      await this.productRatingService.applyDelta(tx, productId, 1, dto.rating);
      return created;
    });
  }

  private async updateReviewByUserProductAttempt(
    userId: string,
    productId: string,
    dto: CreateReviewDto
  ): Promise<ReviewWithAuthor> {
    return this.prisma.$transaction(async (tx) => {
      await this.requireProductTx(tx, productId);

      const existing = await this.reviewRepository.findByUserAndProductKeyTx(tx, userId, productId);
      if (!existing) {
        // If it disappeared between attempts, restart and let create path handle it.
        throw new OptimisticConflictError();
      }

      const nextComment = dto.comment !== undefined ? dto.comment : existing.comment;
      const ratingDelta = dto.rating - existing.rating;

      const { updated } = await this.reviewRepository.updateByIdOptimisticTx(
        tx,
        existing.id,
        existing.updatedAt,
        dto.rating,
        nextComment
      );
      if (!updated) {
        throw new OptimisticConflictError();
      }

      if (ratingDelta !== 0) {
        await this.productRatingService.applyDelta(tx, productId, 0, ratingDelta);
      }

      const updatedReview = await this.reviewRepository.getByIdWithAuthorTx(tx, existing.id);
      if (!updatedReview) throw new NotFoundException('Review not found');
      return updatedReview;
    });
  }

  async upsertReview(
    userId: string,
    productId: string,
    dto: CreateReviewDto
  ): Promise<ReviewWithAuthor> {
    return this.withOptimisticRetries(async () => {
      try {
        return await this.createReviewAttempt(userId, productId, dto);
      } catch (e: unknown) {
        if (!this.isUniqueUserProductViolation(e)) throw e;
        // Another request created the review. Continue via optimistic update.
      }

      return await this.updateReviewByUserProductAttempt(userId, productId, dto);
    });
  }

  async deleteReview(reviewId: string, userId: string): Promise<void> {
    await this.withOptimisticRetries(async () => {
      await this.prisma.$transaction(async (tx) => {
        const review = await this.getReviewOrThrowTx(tx, reviewId);
        this.assertOwnership(review, userId, 'delete');

        const deleted = await this.reviewRepository.deleteByIdOptimisticTx(
          tx,
          reviewId,
          review.updatedAt
        );
        if (!deleted) {
          throw new OptimisticConflictError();
        }

        await this.productRatingService.applyDelta(tx, review.productId, -1, -review.rating);
      });
    });
  }

  private async getReviewOrThrowTx(tx: PrismaTransactionClient, reviewId: string): Promise<Review> {
    const review = await this.reviewRepository.findByIdTx(tx, reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  private assertOwnership(
    review: Pick<Review, 'userId'>,
    userId: string,
    action: 'update' | 'delete'
  ): void {
    if (review.userId !== userId) {
      throw new ForbiddenException(
        action === 'delete'
          ? 'You can only delete your own reviews'
          : 'You can only edit your own reviews'
      );
    }
  }

  private isUniqueUserProductViolation(e: unknown): boolean {
    return e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002';
  }

  private isOptimisticConflict(e: unknown): boolean {
    return e instanceof OptimisticConflictError;
  }
}

/** Internal-only control flow for bounded optimistic retries (not exposed to API). */
class OptimisticConflictError extends Error {
  constructor() {
    super('OPTIMISTIC_CONFLICT');
  }
}
