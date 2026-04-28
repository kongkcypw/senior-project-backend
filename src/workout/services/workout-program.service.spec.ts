import { InternalServerErrorException } from '@nestjs/common';
import { WorkoutProgramService } from './workout-program.service';

describe('WorkoutProgramService', () => {
    let service: WorkoutProgramService;
    let workoutProgramPlanRepository: any;

    beforeEach(() => {
        workoutProgramPlanRepository = {
            findFullProgramByProgramPlanId: jest.fn(),
            findFullProgramByLineUserIdTrainee: jest.fn(),
            findFullProgramByLineUserIdTrainer: jest.fn(),
            create: jest.fn((x) => x),
            save: jest.fn((x) => Promise.resolve(x)),
        };
        service = new WorkoutProgramService(workoutProgramPlanRepository);
    });

    describe('getProgramPlanByPlanId', () => {
        it('returns null when not found', async () => {
            workoutProgramPlanRepository.findFullProgramByProgramPlanId.mockResolvedValue(null);
            const r = await service.getProgramPlanByPlanId(1);
            expect(r).toBeNull();
        });

        it('returns DTO when plan exists', async () => {
            workoutProgramPlanRepository.findFullProgramByProgramPlanId.mockResolvedValue({
                id: 1, name: 'Plan', lineUserIdTrainee: 'U1', lineUserIdTrainer: 'U2', orderInProgram: 0, routines: [],
            });
            const r = await service.getProgramPlanByPlanId(1);
            expect(r).toBeDefined();
        });

        it('throws InternalServerErrorException on repository error', async () => {
            const err = new Error('boom');
            workoutProgramPlanRepository.findFullProgramByProgramPlanId.mockRejectedValue(err);
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            await expect(service.getProgramPlanByPlanId(1)).rejects.toBeInstanceOf(InternalServerErrorException);
            consoleSpy.mockRestore();
        });
    });

    describe('getProgramPlanByLineUserIdTrainee', () => {
        it('maps each plan to DTO', async () => {
            workoutProgramPlanRepository.findFullProgramByLineUserIdTrainee.mockResolvedValue([
                { id: 1, name: 'P1', lineUserIdTrainee: 'U1', lineUserIdTrainer: 'U2', orderInProgram: 0, routines: [] },
            ]);
            const r = await service.getProgramPlanByLineUserIdTrainee('U1');
            expect(r).toHaveLength(1);
        });
    });

    describe('getProgramPlanByLineUserIdTrainer', () => {
        it('maps each plan to DTO', async () => {
            workoutProgramPlanRepository.findFullProgramByLineUserIdTrainer.mockResolvedValue([]);
            const r = await service.getProgramPlanByLineUserIdTrainer('U1');
            expect(r).toEqual([]);
        });
    });

    describe('createProgramPlan', () => {
        it('creates new plan with empty routines and saves', async () => {
            workoutProgramPlanRepository.save.mockResolvedValue({
                id: 1, name: 'New', lineUserIdTrainee: 'U1', lineUserIdTrainer: 'U2', orderInProgram: 0, routines: [],
            });
            const r = await service.createProgramPlan('New', 'U1', 'U2');
            expect(workoutProgramPlanRepository.create).toHaveBeenCalledWith({
                name: 'New',
                lineUserIdTrainee: 'U1',
                lineUserIdTrainer: 'U2',
                routines: [],
            });
            expect(workoutProgramPlanRepository.save).toHaveBeenCalled();
            expect(r).toBeDefined();
        });
    });
});
