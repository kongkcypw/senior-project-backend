import { UserRelationshipsService } from './user-relationships.service';
import * as scoreUtil from 'src/common/utils/score.util';

describe('UserRelationshipsService', () => {
    let service: UserRelationshipsService;
    let userRelationshipsRepository: any;
    let lineGroupMemberService: any;
    let userRepository: any;
    let workoutHistoryRepository: any;
    let workoutProgramRepository: any;
    let mealHistoryRepository: any;
    let nutritionPlanRepository: any;

    beforeEach(() => {
        userRelationshipsRepository = {
            findActiveRelationshipsByTraineeAndTrainer: jest.fn(),
            findAllActiveRelationshipsByTrainer: jest.fn(),
            create: jest.fn((x) => x),
            save: jest.fn(),
        };
        lineGroupMemberService = {
            findTrainerInGroup: jest.fn(),
        };
        userRepository = {
            findByLineUserIds: jest.fn(),
            findOne: jest.fn(),
        };
        workoutHistoryRepository = {
            countDistinctSessionDays: jest.fn().mockResolvedValue(0),
            countDaysGroupedByBucket: jest.fn().mockResolvedValue(new Map()),
        };
        workoutProgramRepository = {
            countRoutinesByTrainee: jest.fn().mockResolvedValue(0),
        };
        mealHistoryRepository = {
            sumMacrosInWindow: jest.fn().mockResolvedValue({ calories: 0, protein: 0, carbohydrate: 0, fat: 0 }),
            countMealsInWindow: jest.fn().mockResolvedValue(0),
            sumMacrosGroupedByBucket: jest.fn().mockResolvedValue(new Map()),
        };
        nutritionPlanRepository = {
            findByLineUserId: jest.fn().mockResolvedValue(null),
        };
        service = new UserRelationshipsService(
            userRelationshipsRepository,
            lineGroupMemberService,
            userRepository,
            workoutHistoryRepository,
            workoutProgramRepository,
            mealHistoryRepository,
            nutritionPlanRepository,
        );
    });

    describe('isAssignedTrainerForTrainee', () => {
        it('returns true when relationship exists', async () => {
            userRelationshipsRepository.findActiveRelationshipsByTraineeAndTrainer.mockResolvedValue({ id: 1 });
            const r = await service.isAssignedTrainerForTrainee('T1', 'TR1');
            expect(r).toBe(true);
        });

        it('returns false when no relationship', async () => {
            userRelationshipsRepository.findActiveRelationshipsByTraineeAndTrainer.mockResolvedValue(null);
            const r = await service.isAssignedTrainerForTrainee('T1', 'TR1');
            expect(r).toBe(false);
        });
    });

    describe('insertTrainerRelationshipIfNotExist', () => {
        it('throws when no trainer found in group', async () => {
            lineGroupMemberService.findTrainerInGroup.mockResolvedValue(null);
            await expect(service.insertTrainerRelationshipIfNotExist('G1', 'U1')).rejects.toThrow();
        });

        it('does nothing when relationship already exists', async () => {
            lineGroupMemberService.findTrainerInGroup.mockResolvedValue({ lineUserId: 'TR' });
            userRelationshipsRepository.findActiveRelationshipsByTraineeAndTrainer.mockResolvedValue({ id: 1 });
            await service.insertTrainerRelationshipIfNotExist('G1', 'U1');
            expect(userRelationshipsRepository.save).not.toHaveBeenCalled();
        });

        it('creates and saves new relationship when none exists', async () => {
            lineGroupMemberService.findTrainerInGroup.mockResolvedValue({ lineUserId: 'TR' });
            userRelationshipsRepository.findActiveRelationshipsByTraineeAndTrainer.mockResolvedValue(null);
            await service.insertTrainerRelationshipIfNotExist('G1', 'U1');
            expect(userRelationshipsRepository.create).toHaveBeenCalledWith({
                trainerLineUserId: 'TR',
                traineeLineUserId: 'U1',
            });
            expect(userRelationshipsRepository.save).toHaveBeenCalled();
        });
    });

    describe('findAllTraineeByTrainerLineUserId', () => {
        it('returns empty array when no relationships', async () => {
            userRelationshipsRepository.findAllActiveRelationshipsByTrainer.mockResolvedValue([]);
            const r = await service.findAllTraineeByTrainerLineUserId('TR');
            expect(r).toEqual([]);
        });

        it('returns DTOs for trainees', async () => {
            const assigned = new Date('2024-01-01');
            userRelationshipsRepository.findAllActiveRelationshipsByTrainer.mockResolvedValue([
                { traineeLineUserId: 'U1', assignedAt: assigned },
            ]);
            userRepository.findByLineUserIds.mockResolvedValue([
                { id: 1, lineUserId: 'U1', displayName: 'A', pictureUrl: 'p', role: 'Trainee' },
            ]);
            const r = await service.findAllTraineeByTrainerLineUserId('TR');
            expect(r).toHaveLength(1);
            expect(r[0].lineUserId).toBe('U1');
            expect(r[0].joinDate).toBe('2024-01-01');
        });
    });

    describe('getHomeStatsForTrainer', () => {
        it('returns zero counts when no relationships', async () => {
            userRelationshipsRepository.findAllActiveRelationshipsByTrainer.mockResolvedValue([]);
            const r = await service.getHomeStatsForTrainer('TR');
            expect(r).toEqual({
                nutrition: { total: 0, completed: 0, onTrack: 0, late: 0 },
                workout: { total: 0, completed: 0, incomplete: 0 },
            });
        });

        it('counts trainee without nutrition plan as excluded from nutrition total but included in workout', async () => {
            userRelationshipsRepository.findAllActiveRelationshipsByTrainer.mockResolvedValue([
                { traineeLineUserId: 'U1' },
            ]);
            nutritionPlanRepository.findByLineUserId.mockResolvedValue(null);
            mealHistoryRepository.countMealsInWindow.mockResolvedValue(0);
            workoutHistoryRepository.countDistinctSessionDays.mockResolvedValue(0);
            workoutProgramRepository.countRoutinesByTrainee.mockResolvedValue(0);
            const r = await service.getHomeStatsForTrainer('TR');
            expect(r.nutrition.total).toBe(0);
            expect(r.workout.total).toBe(1);
            expect(r.workout.incomplete).toBe(1);
        });

        it('counts completed workout when sessions >= total routines', async () => {
            userRelationshipsRepository.findAllActiveRelationshipsByTrainer.mockResolvedValue([
                { traineeLineUserId: 'U1' },
            ]);
            nutritionPlanRepository.findByLineUserId.mockResolvedValue(null);
            workoutHistoryRepository.countDistinctSessionDays.mockResolvedValue(3);
            workoutProgramRepository.countRoutinesByTrainee.mockResolvedValue(3);
            const r = await service.getHomeStatsForTrainer('TR');
            expect(r.workout.completed).toBe(1);
        });
    });

    describe('getTraineeDetailByLineUserId', () => {
        it('throws when trainee not found', async () => {
            userRepository.findOne.mockResolvedValue(null);
            await expect(service.getTraineeDetailByLineUserId('U1')).rejects.toThrow();
        });

        it('returns full trainee detail', async () => {
            userRepository.findOne.mockResolvedValue({
                id: 1, lineUserId: 'U1', displayName: 'A', pictureUrl: 'p', role: 'Trainee',
                createdAt: new Date('2024-01-01'),
            });
            const r = await service.getTraineeDetailByLineUserId('U1');
            expect(r.id).toBe(1);
            expect(r.lineUserId).toBe('U1');
            expect(r.scores).toBeDefined();
            expect(r.scores.daily).toBeDefined();
            expect(r.scores.weekly).toBeDefined();
            expect(r.scores.monthly).toBeDefined();
        });
    });

    describe('findTraineesSummaryByTrainer', () => {
        it('returns empty when no relationships', async () => {
            userRelationshipsRepository.findAllActiveRelationshipsByTrainer.mockResolvedValue([]);
            const r = await service.findTraineesSummaryByTrainer('TR');
            expect(r).toEqual({ count: 0, trainees: [] });
        });

        it('returns trainee summary', async () => {
            userRelationshipsRepository.findAllActiveRelationshipsByTrainer.mockResolvedValue([
                { traineeLineUserId: 'U1' },
            ]);
            userRepository.findByLineUserIds.mockResolvedValue([
                { lineUserId: 'U1', displayName: 'A', pictureUrl: 'p' },
            ]);
            const r = await service.findTraineesSummaryByTrainer('TR');
            expect(r.count).toBe(1);
            expect(r.trainees[0].lineUserId).toBe('U1');
        });
    });

    describe('getScoreHistoryForTrainee', () => {
        it('returns history points', async () => {
            const r = await service.getScoreHistoryForTrainee('U1', 'weekly' as any);
            expect(r.period).toBe('weekly');
            expect(Array.isArray(r.points)).toBe(true);
        });
    });

    describe('getScoreHistoryForTrainer', () => {
        it('returns zero/null history when no trainees', async () => {
            userRelationshipsRepository.findAllActiveRelationshipsByTrainer.mockResolvedValue([]);
            const r = await service.getScoreHistoryForTrainer('TR', 'weekly' as any);
            expect(r.period).toBe('weekly');
            expect(Array.isArray(r.points)).toBe(true);
        });

        it('aggregates trainee scores across buckets', async () => {
            userRelationshipsRepository.findAllActiveRelationshipsByTrainer.mockResolvedValue([
                { traineeLineUserId: 'U1' },
            ]);
            const r = await service.getScoreHistoryForTrainer('TR', 'weekly' as any);
            expect(r.points).toBeDefined();
        });
    });
});
