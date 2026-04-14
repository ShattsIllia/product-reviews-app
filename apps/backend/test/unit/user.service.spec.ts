import { UserService } from '../../src/features/users/user.service';
import { UserRepository } from '../../src/features/users/user.repository';
import { BadRequestException, NotFoundException } from '../../src/common/exceptions/app.exception';
import type { User } from '@prisma/client';
import { UpdateUserDto } from '@app/shared/dto/user.dto';

describe('UserService (unit)', () => {
    let service: UserService;
    let userRepository: jest.Mocked<Pick<UserRepository, 'findById' | 'update'>>;

    beforeEach(() => {
        userRepository = {
            findById: jest.fn(),
            update: jest.fn(),
        };
        service = new UserService(userRepository as unknown as UserRepository);
        jest.clearAllMocks();
    });

    it('getUserById: throws NotFoundException when missing', async () => {
        userRepository.findById.mockResolvedValue(null);

        await expect(service.getUserById('missing')).rejects.toBeInstanceOf(NotFoundException);
    });

    it('updateUser: throws BadRequestException when no fields to update', async () => {
        userRepository.findById.mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            displayName: 'Same',
            avatarUrl: null,
            role: 'USER',
            passwordHash: 'h',
            emailVerified: false,
            emailVerificationToken: null,
            emailVerificationExpiresAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies User);

        await expect(service.updateUser('u1', {} satisfies UpdateUserDto)).rejects.toBeInstanceOf(
          BadRequestException
        );
    });

    it('updateUser: updates displayName/avatarUrl and returns profile payload', async () => {
        userRepository.update.mockResolvedValue({
            id: 'u1',
            email: 'a@b.com',
            displayName: 'New',
            avatarUrl: 'x',
            role: 'USER',
            passwordHash: 'h',
            emailVerified: false,
            emailVerificationToken: null,
            emailVerificationExpiresAt: null,
            createdAt: new Date(),
            updatedAt: new Date(),
        } satisfies User);

        const res = await service.updateUser(
          'u1',
          { displayName: 'New', avatarUrl: 'x' } satisfies UpdateUserDto
        );

        expect(userRepository.update).toHaveBeenCalledWith('u1', {
            displayName: 'New',
            avatarUrl: 'x',
        });
        expect(res).toEqual({
            id: 'u1',
            email: 'a@b.com',
            displayName: 'New',
            avatarUrl: 'x',
            role: 'USER',
        });
    });
});
