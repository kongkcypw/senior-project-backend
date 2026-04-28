import { WorkoutHistoryService } from './workout-history.service';

describe('WorkoutHistoryService', () => {
    let service: WorkoutHistoryService;
    let workoutHistoryRepository: any;
    let workoutHistoryExerciseRepository: any;

    beforeEach(() => {
        workoutHistoryRepository = {
            findActiveSession: jest.fn(),
            deleteSession: jest.fn(),
            findLatestSession: jest.fn(),
            createSession: jest.fn(),
            finishSession: jest.fn(),
            findRoutinesDoneThisWeek: jest.fn(),
        };
        workoutHistoryExerciseRepository = {
            saveExerciseLogs: jest.fn(),
        };
        service = new WorkoutHistoryService(workoutHistoryRepository, workoutHistoryExerciseRepository);
    });

    describe('getActiveSession', () => {
        it('returns null when no active session', async () => {
            workoutHistoryRepository.findActiveSession.mockResolvedValue(null);
            const r = await service.getActiveSession('U1');
            expect(r).toBeNull();
        });

        it('returns formatted session info', async () => {
            const startedAt = new Date('2024-01-01T08:00:00Z');
            workoutHistoryRepository.findActiveSession.mockResolvedValue({
                id: 1, routineId: 2, workoutRoutine: { name: 'Day 1' }, startedAt,
            });
            const r = await service.getActiveSession('U1');
            expect(r).toEqual({
                sessionId: 1,
                routineId: 2,
                routineName: 'Day 1',
                startedAt: startedAt.toISOString(),
            });
        });

        it('returns null routineName when workoutRoutine missing', async () => {
            workoutHistoryRepository.findActiveSession.mockResolvedValue({
                id: 1, routineId: 2, workoutRoutine: null, startedAt: new Date(),
            });
            const r = await service.getActiveSession('U1');
            expect(r?.routineName).toBeNull();
        });
    });

    describe('discardSession', () => {
        it('deletes the session', async () => {
            await service.discardSession(5);
            expect(workoutHistoryRepository.deleteSession).toHaveBeenCalledWith(5);
        });
    });

    describe('getLatestSession', () => {
        it('delegates to repository', () => {
            workoutHistoryRepository.findLatestSession.mockReturnValue('result');
            const r = service.getLatestSession('U1', 2);
            expect(workoutHistoryRepository.findLatestSession).toHaveBeenCalledWith('U1', 2);
            expect(r).toBe('result');
        });
    });

    describe('startSession', () => {
        it('returns sessionId and ISO startedAt', async () => {
            const startedAt = new Date('2024-01-01T08:00:00Z');
            workoutHistoryRepository.createSession.mockResolvedValue({ id: 99, startedAt });
            const r = await service.startSession('U1', 2);
            expect(r).toEqual({ sessionId: 99, startedAt: startedAt.toISOString() });
        });
    });

    describe('logSession', () => {
        it('finishes session and saves exercise logs', async () => {
            const dto = {
                sessionId: 1,
                finishedAt: '2024-01-01T09:00:00Z',
                sets: [{ exerciseId: 1, set: 1, rep: 10, weightKg: 50, notes: null }] as any,
            };
            await service.logSession(dto as any);
            expect(workoutHistoryRepository.finishSession).toHaveBeenCalledWith(1, expect.any(Date));
            expect(workoutHistoryExerciseRepository.saveExerciseLogs).toHaveBeenCalledWith(1, dto.sets);
        });
    });

    describe('getRoutinesDoneThisWeek', () => {
        it('delegates to repository with weekly window', () => {
            workoutHistoryRepository.findRoutinesDoneThisWeek.mockResolvedValue([1, 2]);
            const r = service.getRoutinesDoneThisWeek('U1');
            expect(r).toBeInstanceOf(Promise);
            expect(workoutHistoryRepository.findRoutinesDoneThisWeek).toHaveBeenCalled();
        });
    });
});
