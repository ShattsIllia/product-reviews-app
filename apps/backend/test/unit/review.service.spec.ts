import { ReviewService } from '../../src/features/reviews/review.service';
import { ReviewRepository } from '../../src/features/reviews/review.repository';
import { ProductRepository } from '../../src/features/products/product.repository';
import { ProductRatingService } from '../../src/features/products/product-rating.service';
import { PrismaService } from '../../src/infrastructure/database/prisma.service';
import { NotFoundException } from '../../src/common/exceptions/app.exception';
import { Prisma } from '@prisma/client';

describe('ReviewService (unit)', () => {
    let service: ReviewService;
    let prisma: { $transaction: jest.Mock };
    let reviewRepository: {
        findByProductId: jest.Mock;
        findByUserAndProductKeyTx: jest.Mock;
        createTx: jest.Mock;
        updateByIdTx: jest.Mock;
        updateByIdOptimisticTx?: jest.Mock;
        getByIdWithAuthorTx?: jest.Mock;
        findByIdTx: jest.Mock;
        deleteByIdTx: jest.Mock;
        deleteByIdOptimisticTx?: jest.Mock;
    };
    let productRepository: { findById: jest.Mock; findByIdTx: jest.Mock };
    let productRating: { applyDelta: jest.Mock };

    beforeEach(() => {
        reviewRepository = {
            findByProductId: jest.fn(),
            findByUserAndProductKeyTx: jest.fn(),
            createTx: jest.fn(),
            updateByIdTx: jest.fn(),
            updateByIdOptimisticTx: jest.fn(),
            getByIdWithAuthorTx: jest.fn(),
            findByIdTx: jest.fn(),
            deleteByIdTx: jest.fn(),
            deleteByIdOptimisticTx: jest.fn(),
        };
        productRepository = {
            findById: jest.fn(),
            findByIdTx: jest.fn(),
        };
        productRating = {
            applyDelta: jest.fn().mockResolvedValue(undefined),
        };
        prisma = {
            $transaction: jest.fn(async (fn: (tx: object) => Promise<unknown>) => fn({})),
        };
        service = new ReviewService(
            prisma as unknown as PrismaService,
            reviewRepository as unknown as ReviewRepository,
            productRepository as unknown as ProductRepository,
            productRating as unknown as ProductRatingService,
        );
        jest.clearAllMocks();
    });

    it('getReviewsByProduct: throws NotFoundException if product missing', async () => {
        productRepository.findById.mockResolvedValue(null);

        await expect(service.getReviewsByProduct('p1', 1, 10)).rejects.toBeInstanceOf(NotFoundException);
    });

    it('upsertReview: creates review and increments product aggregates', async () => {
        productRepository.findByIdTx.mockResolvedValue({ id: 'p1' });
        reviewRepository.createTx.mockResolvedValue({ id: 'r1', rating: 5, productId: 'p1', userId: 'u1' });

        const res = await service.upsertReview('u1', 'p1', { rating: 5, comment: 'ok' });

        expect(res.id).toBe('r1');
        expect(reviewRepository.createTx).toHaveBeenCalled();
        expect(productRating.applyDelta).toHaveBeenCalledWith({}, 'p1', 1, 5);
        expect(reviewRepository.updateByIdTx).not.toHaveBeenCalled();
    });

    it('upsertReview: updates existing review and applies rating delta only', async () => {
        productRepository.findByIdTx.mockResolvedValue({ id: 'p1' });
        // New behavior: service tries create-first; emulate unique violation (P2002),
        // then it reads existing and performs optimistic update + returns row with author.
        reviewRepository.createTx.mockRejectedValue(
            new Prisma.PrismaClientKnownRequestError('Unique constraint', { code: 'P2002', clientVersion: 'test' }),
        );
        reviewRepository.findByUserAndProductKeyTx.mockResolvedValue({
            id: 'r1',
            userId: 'u1',
            productId: 'p1',
            rating: 3,
            comment: 'old',
            updatedAt: new Date('2026-01-01T00:00:00.000Z'),
        });
        (reviewRepository.updateByIdOptimisticTx as jest.Mock).mockResolvedValue({ updated: true });
        (reviewRepository.getByIdWithAuthorTx as jest.Mock).mockResolvedValue({ id: 'r1', rating: 5 });

        const res = await service.upsertReview('u1', 'p1', { rating: 5, comment: 'new' });

        expect(res.rating).toBe(5);
        expect(productRating.applyDelta).toHaveBeenCalledWith({}, 'p1', 0, 2);
        expect(reviewRepository.createTx).toHaveBeenCalled();
    });
});
