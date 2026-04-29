import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { WorkoutRoutineController } from 'src/workout/controllers/workout-routine.controller';
import { WorkoutRoutineService } from 'src/workout/services/workout-routine.service';
import { buildTestApp } from './helpers/create-test-module';
import { WorkoutRoutineFactory } from './factories/workout.factory';

describe('WorkoutRoutineController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<WorkoutRoutineService, 'getById' | 'deleteById' | 'createRoutineWithoutExercises' | 'createRoutineWithExercises'>>;

    beforeAll(async () => {
        mockService = {
            getById: jest.fn(),
            deleteById: jest.fn(),
            createRoutineWithoutExercises: jest.fn(),
            createRoutineWithExercises: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [WorkoutRoutineController],
            providers: [{ provide: WorkoutRoutineService, useValue: mockService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /workout-routine/:id', () => {
        it('200 - returns routine when found', async () => {
            const routine = WorkoutRoutineFactory.create();
            mockService.getById.mockResolvedValue(routine as any);

            await request(app.getHttpServer())
                .get('/workout-routine/1')
                .expect(200)
                .expect((res) => {
                    expect(res.body.name).toBe('Test Routine');
                });
        });

        it('200 - returns null when routine not found', async () => {
            mockService.getById.mockResolvedValue(null);

            await request(app.getHttpServer())
                .get('/workout-routine/999')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({});
                });
        });
    });

    describe('DELETE /workout-routine/:id', () => {
        it('200 - deletes routine successfully', async () => {
            mockService.deleteById.mockResolvedValue(undefined);

            await request(app.getHttpServer())
                .delete('/workout-routine/1')
                .expect(200);
        });

        it('500 - returns error when service throws', async () => {
            mockService.deleteById.mockRejectedValue(new Error('DB error'));

            await request(app.getHttpServer())
                .delete('/workout-routine/999')
                .expect(500);
        });
    });

    describe('POST /workout-routine', () => {
        it('201 - creates routine without exercises', async () => {
            const routine = WorkoutRoutineFactory.create();
            mockService.createRoutineWithoutExercises.mockResolvedValue(routine as any);

            await request(app.getHttpServer())
                .post('/workout-routine')
                .send({ programId: 1, name: 'Test Routine' })
                .expect(201)
                .expect((res) => {
                    expect(res.body.name).toBe('Test Routine');
                });
        });

        it('500 - returns error when service throws', async () => {
            mockService.createRoutineWithoutExercises.mockRejectedValue(new Error('fail'));

            await request(app.getHttpServer())
                .post('/workout-routine')
                .send({ programId: 1, name: 'Bad' })
                .expect(500);
        });
    });

    describe('POST /workout-routine/create-with-exercises', () => {
        const body = {
            lineUserId: 'U_TRAINER_001',
            programId: 1,
            name: 'New Routine',
            exercises: [{ name: 'Push Up', orderInRoutine: 1, setDetails: [] }],
        };

        it('201 - creates routine with exercises', async () => {
            const routine = WorkoutRoutineFactory.create({ name: 'New Routine' });
            mockService.createRoutineWithExercises.mockResolvedValue(routine as any);

            await request(app.getHttpServer())
                .post('/workout-routine/create-with-exercises')
                .send(body)
                .expect(201)
                .expect((res) => {
                    expect(res.body.name).toBe('New Routine');
                });
        });

        it('500 - returns error when no exercises provided', async () => {
            mockService.createRoutineWithExercises.mockRejectedValue(new Error('No exercises provided'));

            await request(app.getHttpServer())
                .post('/workout-routine/create-with-exercises')
                .send({ ...body, exercises: [] })
                .expect(500);
        });
    });
});
