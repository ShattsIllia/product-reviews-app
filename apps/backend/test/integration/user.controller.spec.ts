import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';
import { UserController } from '../../src/features/users/user.controller';
import { UserService } from '../../src/features/users/user.service';
import { JwtAuthGuard } from '../../src/common/guards/jwt-auth.guard';

class AllowAuthGuard {
    canActivate(ctx: any) {
        const req = ctx.switchToHttp().getRequest();
        req.user = { id: 'u1', email: 'u1@example.com', role: 'USER' };
        return true;
    }
}

describe('UserController', () => {
    let app: INestApplication;

    const userServiceMock: Pick<UserService, 'getUserById' | 'updateUser'> = {
        getUserById: jest.fn(),
        updateUser: jest.fn(),
    };

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            controllers: [UserController],
            providers: [{ provide: UserService, useValue: userServiceMock }],
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

    it('GET /api/users/me calls getUserById with current user id', async () => {
        (userServiceMock.getUserById as jest.Mock).mockResolvedValue({ id: 'u1' });

        await request(app.getHttpServer()).get('/api/v1/users/me').expect(200).expect({ id: 'u1' });

        expect(userServiceMock.getUserById).toHaveBeenCalledWith('u1');
    });

    it('PATCH /api/users/me calls updateUser with current user id', async () => {
        (userServiceMock.updateUser as jest.Mock).mockResolvedValue({ id: 'u1', displayName: 'New' });

        await request(app.getHttpServer()).patch('/api/v1/users/me').send({ displayName: 'New' }).expect(200);

        expect(userServiceMock.updateUser).toHaveBeenCalledWith('u1', { displayName: 'New' });
    });
});

