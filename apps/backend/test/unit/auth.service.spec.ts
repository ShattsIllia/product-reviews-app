/// <reference types="jest" />

import { AuthService } from '../../src/features/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserRepository } from '../../src/features/users/user.repository';
import { UnauthorizedException } from '../../src/common/exceptions/app.exception';
import * as bcrypt from 'bcryptjs';
import { User } from '@prisma/client';

describe('AuthService (unit)', () => {
    let service: AuthService;
    let userRepository: jest.Mocked<Pick<UserRepository, 'findByEmail' | 'findById' | 'create'>>;

    const jwtService: Pick<JwtService, 'sign'> = {
        sign: jest.fn(() => 'jwt-token'),
    };

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
            findById: jest.fn(),
            create: jest.fn(),
        };
        service = new AuthService(userRepository as unknown as UserRepository, jwtService as JwtService);
        jest.clearAllMocks();
    });

    it('register: creates user and returns message', async () => {
        userRepository.findByEmail.mockResolvedValue(null);
        userRepository.create.mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            displayName: 'A',
            avatarUrl: null,
            role: 'USER',
            passwordHash: 'hash',
            emailVerified: false,
            emailVerificationToken: null,
            emailVerificationExpiresAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies User);

        const res = await service.register({ email: 'a@b.com', password: 'password123', displayName: 'A' });

        expect(res.message).toContain('registered');
        expect(res.message).toContain('login');
        expect(userRepository.create).toHaveBeenCalled();
    });

    it('register: returns same message if email already registered (enumeration prevention)', async () => {
        userRepository.findByEmail.mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            displayName: 'A',
            avatarUrl: null,
            role: 'USER',
            passwordHash: 'hash',
            emailVerified: false,
            emailVerificationToken: null,
            emailVerificationExpiresAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies User);

        const res = await service.register({ email: 'a@b.com', password: 'password123', displayName: 'A' });

        expect(res.message).toContain('registered');
        expect(userRepository.create).not.toHaveBeenCalled();
    });

    it('login: throws UnauthorizedException if user not found', async () => {
        userRepository.findByEmail.mockResolvedValue(null);

        await expect(service.login({ email: 'missing@b.com', password: 'password123' })).rejects.toBeInstanceOf(
            UnauthorizedException,
        );
    });

    it('login: returns access token for valid credentials', async () => {
        const passwordHash = await bcrypt.hash('password123', 10);
        userRepository.findByEmail.mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            displayName: 'A',
            avatarUrl: null,
            role: 'USER',
            passwordHash,
            emailVerified: false,
            emailVerificationToken: null,
            emailVerificationExpiresAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies User);

        const res = await service.login({ email: 'a@b.com', password: 'password123' });

        expect(res.accessToken).toBe('jwt-token');
        expect(jwtService.sign).toHaveBeenCalled();
    });

    it('getProfile: throws UnauthorizedException if user not found', async () => {
        userRepository.findById.mockResolvedValue(null);

        await expect(service.getProfile('u1')).rejects.toBeInstanceOf(UnauthorizedException);
    });

    it('getProfile: returns profile payload', async () => {
        userRepository.findById.mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            displayName: 'A',
            avatarUrl: null,
            role: 'USER',
            passwordHash: 'h',
            emailVerified: false,
            emailVerificationToken: null,
            emailVerificationExpiresAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies User);

        const res = await service.getProfile('u1');

        expect(res).toEqual({
            id: 'u1',
            email: 'a@b.com',
            displayName: 'A',
            avatarUrl: null,
            role: 'USER',
        });
    });
});
