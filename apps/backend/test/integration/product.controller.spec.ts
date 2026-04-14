import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';
import { ProductController } from '../../src/features/products/product.controller';
import { ProductService } from '../../src/features/products/product.service';

describe('ProductController', () => {
    let app: INestApplication;

    const productServiceMock: Pick<ProductService, 'getProducts' | 'getCategories' | 'getProductById'> = {
        getProducts: jest.fn(),
        getCategories: jest.fn(),
        getProductById: jest.fn(),
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [{ provide: ProductService, useValue: productServiceMock }],
        }).compile();

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

    it('GET /api/products parses query params and calls service', async () => {
        (productServiceMock.getProducts as jest.Mock).mockResolvedValue({ data: [], total: 0, page: 2, limit: 5 });

        await request(app.getHttpServer())
            .get('/api/v1/products?page=2&limit=5&search=iphone&category=Electronics')
            .expect(200);

        expect(productServiceMock.getProducts).toHaveBeenCalledWith(2, 5, 'iphone', 'Electronics');
    });

    it('GET /api/products/categories returns categories', async () => {
        (productServiceMock.getCategories as jest.Mock).mockResolvedValue(['Books']);

        await request(app.getHttpServer()).get('/api/v1/products/categories').expect(200).expect(['Books']);
    });

    it('GET /api/products/:id returns product details', async () => {
        (productServiceMock.getProductById as jest.Mock).mockResolvedValue({ id: 'p1' });

        await request(app.getHttpServer()).get('/api/v1/products/p1').expect(200).expect({ id: 'p1' });
    });
});

