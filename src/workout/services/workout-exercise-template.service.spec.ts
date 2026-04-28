import { WorkoutExerciseTemplateService } from './workout-exercise-template.service';

describe('WorkoutExerciseTemplateService', () => {
    let service: WorkoutExerciseTemplateService;
    let workoutExerciseTemplateRepository: any;

    beforeEach(() => {
        workoutExerciseTemplateRepository = {
            find: jest.fn(),
        };
        service = new WorkoutExerciseTemplateService(workoutExerciseTemplateRepository);
    });

    describe('getAll', () => {
        it('returns empty array when repository returns empty', async () => {
            workoutExerciseTemplateRepository.find.mockResolvedValue([]);
            const r = await service.getAll();
            expect(r).toEqual([]);
        });

        it('maps each entity to DTO', async () => {
            workoutExerciseTemplateRepository.find.mockResolvedValue([
                { id: 1, name: 'Squat', imageUrl: 'http://x', description: 'desc' },
                { id: 2, name: 'Bench', imageUrl: 'http://y', description: 'desc' },
            ]);
            const r = await service.getAll();
            expect(r).toHaveLength(2);
        });
    });
});
