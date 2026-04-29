import { UserRole } from 'src/users/enums/user-role.enum';

export const UserFactory = {
    trainer(override: Record<string, any> = {}) {
        return {
            id: 1,
            lineUserId: 'U_TRAINER_001',
            displayName: 'Test Trainer',
            pictureUrl: 'https://example.com/trainer.jpg',
            role: UserRole.TRAINER,
            ...override,
        };
    },

    trainee(override: Record<string, any> = {}) {
        return {
            id: 2,
            lineUserId: 'U_TRAINEE_001',
            displayName: 'Test Trainee',
            pictureUrl: 'https://example.com/trainee.jpg',
            role: UserRole.TRAINEE,
            ...override,
        };
    },

    physiqueHistory(override: Record<string, any> = {}) {
        return {
            id: 1,
            lineUserId: 'U_TRAINEE_001',
            age: 25,
            weight: 70,
            height: 175,
            bodyFatPercentage: 20,
            goal: 'lose weight',
            createdAt: new Date('2024-01-01'),
            updatedAt: new Date('2024-01-01'),
            ...override,
        };
    },
};
