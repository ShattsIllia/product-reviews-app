import { INestApplication, ValidationPipe } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';
import { ProductReviewsController } from '../../src/features/products/product-reviews.controller';
import { ReviewDetailController } from '../../src/features/reviews/review.controller';
import { ReviewService } from '../../src/features/reviews/review.service';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';

class AllowAuthGuard {
  canActivate(ctx: ExecutionContext) {
    const req = ctx.switchToHttp().getRequest<{
      user?: { id: string; email: string; role: 'USER' | 'ADMIN' };
    }>();
    req.user = { id: 'u1', email: 'u1@example.com', role: 'USER' };
    return true;
  }
}

describe('ReviewController', () => {
    let app: INestApplication;

    const reviewServiceMock: Pick<
        ReviewService,
        'getReviewsByProduct' | 'upsertReview' | 'deleteReview'
    > = {
        getReviewsByProduct: jest.fn(),
        upsertReview: jest.fn(),
        deleteReview: jest.fn(),
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ProductReviewsController, ReviewDetailController],
            providers: [{ provide: ReviewService, useValue: reviewServiceMock }],
        })
            .overrideGuard(JwtAuthGuard)
            .useClass(AllowAuthGuard)
            .compile();

        app = moduleRef.createNestApplication();
        app.setGlobalPrefix('api/v1');
        app.useGlobalFilters(new AllExceptionsFilter());
        app.useGlobalPipes(
            new ValidationPipe({
                whitelist: true,
                forbidNonWhitelisted: true,
                transform: true,
                transformOptions: { enableImplicitConversion: true },
            }),
        );
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('GET /api/products/:productId/reviews delegates to service with pagination', async () => {
        (reviewServiceMock.getReviewsByProduct as jest.Mock).mockResolvedValue({ data: [], total: 0, page: 2, limit: 5 });

        await request(app.getHttpServer())
            .get('/api/v1/products/p1/reviews?page=2&limit=5')
            .expect(200)
            .expect((res) => {
                expect(res.body.page).toBe(2);
            });

        expect(reviewServiceMock.getReviewsByProduct).toHaveBeenCalledWith('p1', 2, 5);
    });

    it('POST /api/products/:productId/reviews requires auth guard and calls service with current user', async () => {
        (reviewServiceMock.upsertReview as jest.Mock).mockResolvedValue({ id: 'r1' });

        await request(app.getHttpServer())
            .post('/api/v1/products/p1/reviews')
            .send({ rating: 5, comment: 'ok' })
            .expect(201)
            .expect((res) => expect(res.body.id).toBe('r1'));

        expect(reviewServiceMock.upsertReview).toHaveBeenCalledWith('u1', 'p1', { rating: 5, comment: 'ok' });
    });

    it('DELETE /api/reviews/:id returns 204 payload and calls deleteReview', async () => {
        (reviewServiceMock.deleteReview as jest.Mock).mockResolvedValue(undefined);

        await request(app.getHttpServer()).delete('/api/v1/reviews/r1').expect(200).expect({ statusCode: 204 });

        expect(reviewServiceMock.deleteReview).toHaveBeenCalledWith('r1', 'u1');
    });
});

