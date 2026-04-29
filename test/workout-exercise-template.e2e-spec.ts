import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { WorkoutExerciseTemplateController } from 'src/workout/controllers/workout-exercise-template.controller';
import { WorkoutExerciseTemplateService } from 'src/workout/services/workout-exercise-template.service';
import { buildTestApp } from './helpers/create-test-module';
import { WorkoutExerciseTemplateFactory } from './factories/workout.factory';

describe('WorkoutExerciseTemplateController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<WorkoutExerciseTemplateService, 'getAll'>>;

    beforeAll(async () => {
        mockService = {
            getAll: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [WorkoutExerciseTemplateController],
            providers: [{ provide: WorkoutExerciseTemplateService, useValue: mockService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /workout-exercise-template/:lineUserId', () => {
        it('200 - returns list of exercise templates', async () => {
            const template = WorkoutExerciseTemplateFactory.create();
            mockService.getAll.mockResolvedValue([template] as any);

            await request(app.getHttpServer())
                .get('/workout-exercise-template/U_TRAINER_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveLength(1);
                    expect(res.body[0].name).toBe('Push Up');
                    expect(res.body[0].isTemplate).toBe(true);
                });
        });

        it('200 - returns empty array when no templates exist', async () => {
            mockService.getAll.mockResolvedValue([]);

            await request(app.getHttpServer())
                .get('/workout-exercise-template/U_TRAINER_EMPTY')
                .expect(200)
                .expect((res) => { expect(res.body).toEqual([]); });
        });
    });
});
