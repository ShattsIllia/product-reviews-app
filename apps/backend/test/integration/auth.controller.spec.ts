import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AuthController } from '../../src/features/auth/auth.controller';
import { AuthService } from '../../src/features/auth/auth.service';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';

describe('AuthController', () => {
    let app: INestApplication;

    const authServiceMock: Pick<AuthService, 'register' | 'login' | 'getProfile'> = {
        register: jest.fn(),
        login: jest.fn(),
        getProfile: jest.fn(),
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: authServiceMock }],
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

    it('POST /api/v1/auth/register returns 201 + registration message', async () => {
        (authServiceMock.register as jest.Mock).mockResolvedValue({
            message: 'Account registered successfully. Please login with your credentials.',
        });

        await request(app.getHttpServer())
            .post('/api/v1/auth/register')
            .send({ email: 'a@b.com', password: 'password123', displayName: 'A' })
            .expect(201)
            .expect((res) => {
                expect(res.body.message).toContain('registered');
            });
    });
});

