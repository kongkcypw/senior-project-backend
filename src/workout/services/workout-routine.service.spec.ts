import { WorkoutRoutineService } from './workout-routine.service';

describe('WorkoutRoutineService', () => {
    let service: WorkoutRoutineService;
    let workoutRoutineRepository: any;
    let exerciseRepository: any;
    let setRepository: any;

    beforeEach(() => {
        workoutRoutineRepository = {
            findByIdWithExercisesAndSets: jest.fn(),
            delete: jest.fn(),
            create: jest.fn((x) => x),
            save: jest.fn((x) => Promise.resolve({ id: 100, ...x })),
            find: jest.fn(),
            findOne: jest.fn(),
        };
        exerciseRepository = {
            create: jest.fn((x) => x),
            save: jest.fn((x) => Promise.resolve({ id: 200, ...x })),
        };
        setRepository = {
            create: jest.fn((x) => x),
            save: jest.fn(),
        };
        service = new WorkoutRoutineService(
            workoutRoutineRepository,
            exerciseRepository,
            setRepository,
        );
    });

    describe('getById', () => {
        it('returns null when routine not found', async () => {
            workoutRoutineRepository.findByIdWithExercisesAndSets.mockResolvedValue(null);
            const r = await service.getById(1);
            expect(r).toBeNull();
        });

        it('returns response DTO with mapped exercises and sets', async () => {
            workoutRoutineRepository.findByIdWithExercisesAndSets.mockResolvedValue({
                id: 1,
                name: 'Day 1',
                orderInProgram: 1,
                exercises: [{
                    id: 10,
                    name: 'Squat',
                    imageUrl: 'http://img',
                    orderInRoutine: 1,
                    description: 'Do squats',
                    setDetails: [{ id: 1, set: 1, rep: 10, weightKg: 50 }],
                }],
            });
            const r = await service.getById(1);
            expect(r?.id).toBe(1);
            expect(r?.exercises).toHaveLength(1);
            expect(r?.exercises[0].sets).toHaveLength(1);
            expect(r?.exercises[0].sets[0].rep).toBe(10);
        });

        it('handles missing exercises and setDetails gracefully', async () => {
            workoutRoutineRepository.findByIdWithExercisesAndSets.mockResolvedValue({
                id: 1, name: 'X', orderInProgram: 1,
            });
            const r = await service.getById(1);
            expect(r?.exercises).toEqual([]);
        });
    });

    describe('deleteById', () => {
        it('delegates to repository', async () => {
            await service.deleteById(5);
            expect(workoutRoutineRepository.delete).toHaveBeenCalledWith(5);
        });
    });

    describe('createRoutineWithoutExercises', () => {
        it('creates a routine without saving', async () => {
            const r = await service.createRoutineWithoutExercises(1, 'New Routine');
            expect(workoutRoutineRepository.create).toHaveBeenCalledWith({
                programId: 1,
                name: 'New Routine',
            });
            expect(r).toBeDefined();
        });
    });

    describe('createRoutineWithExercises', () => {
        it('throws when no exercises provided', async () => {
            await expect(
                service.createRoutineWithExercises('U1', 1, 'R', []),
            ).rejects.toThrow('No exercises provided');
        });

        it('creates routine with exercises and sets, returns final routine', async () => {
            workoutRoutineRepository.find.mockResolvedValue([]);
            workoutRoutineRepository.findOne.mockResolvedValue({
                id: 100, name: 'R', exercises: [],
            });

            const exercises: any[] = [{
                name: 'Squat',
                imageUrl: 'http://x',
                description: '',
                orderInRoutine: 1,
                setDetails: [{ set: 1, rep: 10, weightKg: 50 }],
            }];

            const r = await service.createRoutineWithExercises('U1', 1, 'R', exercises);
            expect(workoutRoutineRepository.save).toHaveBeenCalled();
            expect(exerciseRepository.save).toHaveBeenCalled();
            expect(setRepository.save).toHaveBeenCalled();
            expect(r).toBeDefined();
        });

        it('uses orderInProgram=1 when no existing routines', async () => {
            workoutRoutineRepository.find.mockResolvedValue([]);
            workoutRoutineRepository.findOne.mockResolvedValue({ id: 100, exercises: [] });
            await service.createRoutineWithExercises('U1', 1, 'R', [{
                name: 'X', imageUrl: '', description: '', orderInRoutine: 1, setDetails: [],
            } as any]);
            const createArg = workoutRoutineRepository.create.mock.calls[0][0];
            expect(createArg.orderInProgram).toBe(1);
        });

        it('uses next orderInProgram when existing routines exist', async () => {
            workoutRoutineRepository.find.mockResolvedValue([{ orderInProgram: 5 }]);
            workoutRoutineRepository.findOne.mockResolvedValue({ id: 100, exercises: [] });
            await service.createRoutineWithExercises('U1', 1, 'R', [{
                name: 'X', imageUrl: '', description: '', orderInRoutine: 1, setDetails: [],
            } as any]);
            const createArg = workoutRoutineRepository.create.mock.calls[0][0];
            expect(createArg.orderInProgram).toBe(6);
        });

        it('throws when final routine cannot be found', async () => {
            workoutRoutineRepository.find.mockResolvedValue([]);
            workoutRoutineRepository.findOne.mockResolvedValue(null);
            await expect(
                service.createRoutineWithExercises('U1', 1, 'R', [{
                    name: 'X', imageUrl: '', description: '', orderInRoutine: 1, setDetails: [],
                } as any]),
            ).rejects.toThrow('Cannot find created routine');
        });
    });
});
