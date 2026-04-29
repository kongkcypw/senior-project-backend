import { INestApplication, InternalServerErrorException } from '@nestjs/common';
import request from 'supertest';
import { WorkoutProgramController } from 'src/workout/controllers/workout-program.controller';
import { WorkoutProgramService } from 'src/workout/services/workout-program.service';
import { buildTestApp } from './helpers/create-test-module';
import { WorkoutProgramFactory } from './factories/workout.factory';

describe('WorkoutProgramController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<WorkoutProgramService, 'getProgramPlanByPlanId' | 'getProgramPlanByLineUserIdTrainee' | 'getProgramPlanByLineUserIdTrainer' | 'createProgramPlan'>>;

    beforeAll(async () => {
        mockService = {
            getProgramPlanByPlanId: jest.fn(),
            getProgramPlanByLineUserIdTrainee: jest.fn(),
            getProgramPlanByLineUserIdTrainer: jest.fn(),
            createProgramPlan: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [WorkoutProgramController],
            providers: [{ provide: WorkoutProgramService, useValue: mockService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /workout-program/:lineUserId (trainee)', () => {
        it('200 - returns programs for trainee', async () => {
            const program = WorkoutProgramFactory.create();
            mockService.getProgramPlanByLineUserIdTrainee.mockResolvedValue([program] as any);

            await request(app.getHttpServer())
                .get('/workout-program/U_TRAINEE_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveLength(1);
                    expect(res.body[0].name).toBe('Test Program');
                });
        });

        it('200 - returns empty array when trainee has no programs', async () => {
            mockService.getProgramPlanByLineUserIdTrainee.mockResolvedValue([]);

            await request(app.getHttpServer())
                .get('/workout-program/U_TRAINEE_EMPTY')
                .expect(200)
                .expect((res) => { expect(res.body).toEqual([]); });
        });
    });

    describe('GET /workout-program/by-trainer/:lineUserId', () => {
        it('200 - returns programs created by trainer', async () => {
            const program = WorkoutProgramFactory.create();
            mockService.getProgramPlanByLineUserIdTrainer.mockResolvedValue([program] as any);

            await request(app.getHttpServer())
                .get('/workout-program/by-trainer/U_TRAINER_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveLength(1);
                });
        });

        it('200 - returns empty array when trainer has no programs', async () => {
            mockService.getProgramPlanByLineUserIdTrainer.mockResolvedValue([]);

            await request(app.getHttpServer())
                .get('/workout-program/by-trainer/U_TRAINER_EMPTY')
                .expect(200)
                .expect((res) => { expect(res.body).toEqual([]); });
        });
    });

    describe('GET /workout-program/detail/:programId', () => {
        it('200 - returns program detail when found', async () => {
            const program = WorkoutProgramFactory.create();
            mockService.getProgramPlanByPlanId.mockResolvedValue(program as any);

            await request(app.getHttpServer())
                .get('/workout-program/detail/1')
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(1);
                });
        });

        it('500 - returns error when service throws', async () => {
            mockService.getProgramPlanByPlanId.mockRejectedValue(
                new InternalServerErrorException('Failed to fetch program'),
            );

            await request(app.getHttpServer())
                .get('/workout-program/detail/999')
                .expect(500);
        });
    });

    describe('POST /workout-program', () => {
        const programBody = {
            name: 'New Program',
            lineUserIdTrainee: 'U_TRAINEE_001',
            lineUserIdTrainer: 'U_TRAINER_001',
        };

        it('201 - creates new workout program', async () => {
            const created = WorkoutProgramFactory.create({ name: 'New Program' });
            mockService.createProgramPlan.mockResolvedValue(created as any);

            await request(app.getHttpServer())
                .post('/workout-program')
                .send(programBody)
                .expect(201)
                .expect((res) => {
                    expect(res.body.name).toBe('New Program');
                });
        });

        it('500 - returns error when service throws', async () => {
            mockService.createProgramPlan.mockRejectedValue(new Error('DB error'));

            await request(app.getHttpServer())
                .post('/workout-program')
                .send(programBody)
                .expect(500);
        });
    });
});
