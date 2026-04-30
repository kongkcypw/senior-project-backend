import { NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRole } from '../enums/user-role.enum';

describe('UserService', () => {
    let service: UserService;
    let usersRepository: any;
    let userRelationshipsRepository: any;

    const mockUser = {
        id: 1,
        lineUserId: 'U123',
        displayName: 'Test',
        pictureUrl: 'http://x.com/p.png',
        role: UserRole.TRAINEE,
    };

    beforeEach(() => {
        usersRepository = {
            findByLineUserId: jest.fn(),
            findByLineUserIdAndRole: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
        };
        userRelationshipsRepository = {
            findActiveRelationshipsByTrainee: jest.fn(),
        };
        service = new UserService(usersRepository, userRelationshipsRepository);
    });

    describe('findByLineUserId', () => {
        it('returns user info when found', async () => {
            usersRepository.findByLineUserId.mockResolvedValue(mockUser);
            userRelationshipsRepository.findActiveRelationshipsByTrainee.mockResolvedValue(null);
            const result = await service.findByLineUserId('U123');
            expect(result).toEqual({
                id: mockUser.id,
                lineUserId: mockUser.lineUserId,
                displayName: mockUser.displayName,
                pictureUrl: mockUser.pictureUrl,
                role: mockUser.role,
                isPersonalUse: true,
            });
        });

        it('throws when id is null', async () => {
            await expect(service.findByLineUserId(null)).rejects.toThrow('Line User ID is required');
        });

        it('throws NotFoundException when user not found', async () => {
            usersRepository.findByLineUserId.mockResolvedValue(null);
            await expect(service.findByLineUserId('U123')).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('insertUserIfNotExist', () => {
        it('does nothing if user exists', async () => {
            usersRepository.findByLineUserId.mockResolvedValue(mockUser);
            await service.insertUserIfNotExist('U123', 'name', UserRole.TRAINEE, 'pic');
            expect(usersRepository.create).not.toHaveBeenCalled();
            expect(usersRepository.save).not.toHaveBeenCalled();
        });

        it('creates and saves new user when not found', async () => {
            usersRepository.findByLineUserId.mockResolvedValue(null);
            usersRepository.create.mockReturnValue({ ...mockUser });
            usersRepository.save.mockResolvedValue(mockUser);
            await service.insertUserIfNotExist('U123', 'name', UserRole.TRAINEE, 'pic');
            expect(usersRepository.create).toHaveBeenCalledWith({
                lineUserId: 'U123',
                displayName: 'name',
                role: UserRole.TRAINEE,
                pictureUrl: 'pic',
            });
            expect(usersRepository.save).toHaveBeenCalled();
        });
    });

    describe('findTrainerByLineUserId', () => {
        it('delegates to repository with TRAINER role', async () => {
            usersRepository.findByLineUserIdAndRole.mockResolvedValue(mockUser);
            const result = await service.findTrainerByLineUserId('U123');
            expect(usersRepository.findByLineUserIdAndRole).toHaveBeenCalledWith('U123', UserRole.TRAINER);
            expect(result).toBe(mockUser);
        });
    });

    describe('updateDisplayName', () => {
        it('updates displayName when user exists', async () => {
            const user = { ...mockUser };
            usersRepository.findByLineUserId.mockResolvedValue(user);
            await service.updateDisplayName('U123', 'NewName');
            expect(user.displayName).toBe('NewName');
            expect(usersRepository.save).toHaveBeenCalledWith(user);
        });

        it('throws NotFoundException when user not found', async () => {
            usersRepository.findByLineUserId.mockResolvedValue(null);
            await expect(service.updateDisplayName('U123', 'X')).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('updatePictureUrl', () => {
        it('updates pictureUrl when user exists', async () => {
            const user = { ...mockUser };
            usersRepository.findByLineUserId.mockResolvedValue(user);
            await service.updatePictureUrl('U123', 'newpic');
            expect(user.pictureUrl).toBe('newpic');
            expect(usersRepository.save).toHaveBeenCalledWith(user);
        });

        it('throws NotFoundException when user not found', async () => {
            usersRepository.findByLineUserId.mockResolvedValue(null);
            await expect(service.updatePictureUrl('U123', 'p')).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('findUserStatusForEligibleDashboardAccess', () => {
        it('returns null when user not found', async () => {
            usersRepository.findByLineUserId.mockResolvedValue(null);
            const result = await service.findUserStatusForEligibleDashboardAccess('U123');
            expect(result).toBeNull();
        });

        it('returns status with isTrainer=true and isActiveTrainee=false for trainer', async () => {
            const trainer = { ...mockUser, role: UserRole.TRAINER };
            usersRepository.findByLineUserId.mockResolvedValue(trainer);
            const result = await service.findUserStatusForEligibleDashboardAccess('U123');
            expect(result).toMatchObject({
                isTrainer: true,
                isActiveTrainee: false,
            });
            expect(userRelationshipsRepository.findActiveRelationshipsByTrainee).not.toHaveBeenCalled();
        });

        it('returns isActiveTrainee=true when trainee has active relationship', async () => {
            usersRepository.findByLineUserId.mockResolvedValue({ ...mockUser, role: UserRole.TRAINEE });
            userRelationshipsRepository.findActiveRelationshipsByTrainee.mockResolvedValue({ id: 1 });
            const result = await service.findUserStatusForEligibleDashboardAccess('U123');
            expect(result?.isTrainer).toBe(false);
            expect(result?.isActiveTrainee).toBe(true);
        });

        it('returns isActiveTrainee=false when trainee has no active relationship', async () => {
            usersRepository.findByLineUserId.mockResolvedValue({ ...mockUser, role: UserRole.TRAINEE });
            userRelationshipsRepository.findActiveRelationshipsByTrainee.mockResolvedValue(null);
            const result = await service.findUserStatusForEligibleDashboardAccess('U123');
            expect(result?.isActiveTrainee).toBe(false);
        });
    });
});
