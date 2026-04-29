import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { WorkoutHistoryController } from 'src/workout/controllers/workout-history.controller';
import { WorkoutHistoryService } from 'src/workout/services/workout-history.service';
import { buildTestApp } from './helpers/create-test-module';
import { WorkoutHistoryFactory } from './factories/workout.factory';

describe('WorkoutHistoryController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<WorkoutHistoryService, 'getRoutinesDoneThisWeek' | 'getActiveSession' | 'discardSession' | 'startSession' | 'logSession' | 'getLatestSession'>>;

    beforeAll(async () => {
        mockService = {
            getRoutinesDoneThisWeek: jest.fn(),
            getActiveSession: jest.fn(),
            discardSession: jest.fn(),
            startSession: jest.fn(),
            logSession: jest.fn(),
            getLatestSession: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [WorkoutHistoryController],
            providers: [{ provide: WorkoutHistoryService, useValue: mockService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /workout-history/done-this-week', () => {
        it('200 - returns routine IDs completed this week', async () => {
            mockService.getRoutinesDoneThisWeek.mockResolvedValue([1, 2, 3]);

            await request(app.getHttpServer())
                .get('/workout-history/done-this-week?lineUserId=U_TRAINEE_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual([1, 2, 3]);
                });
        });

        it('200 - returns empty array when nothing done this week', async () => {
            mockService.getRoutinesDoneThisWeek.mockResolvedValue([]);

            await request(app.getHttpServer())
                .get('/workout-history/done-this-week?lineUserId=U_TRAINEE_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual([]);
                });
        });
    });

    describe('GET /workout-history/active-session', () => {
        it('200 - returns active session when in progress', async () => {
            const session = { sessionId: 1, routineId: 1, routineName: 'Test Routine', startedAt: '2024-01-01T10:00:00' };
            mockService.getActiveSession.mockResolvedValue(session as any);

            await request(app.getHttpServer())
                .get('/workout-history/active-session?lineUserId=U_TRAINEE_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body.sessionId).toBe(1);
                });
        });

        it('200 - returns null when no active session', async () => {
            mockService.getActiveSession.mockResolvedValue(null);

            await request(app.getHttpServer())
                .get('/workout-history/active-session?lineUserId=U_TRAINEE_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({});
                });
        });
    });

    describe('DELETE /workout-history/session/:sessionId', () => {
        it('200 - discards session successfully', async () => {
            mockService.discardSession.mockResolvedValue(undefined);

            await request(app.getHttpServer())
                .delete('/workout-history/session/1')
                .expect(200);
        });

        it('400 - returns bad request for non-numeric session ID', async () => {
            await request(app.getHttpServer())
                .delete('/workout-history/session/abc')
                .expect(400);
        });
    });

    describe('POST /workout-history/start-session', () => {
        it('201 - starts a new workout session', async () => {
            const result = { sessionId: 1, startedAt: '2024-01-01T10:00:00.000Z' };
            mockService.startSession.mockResolvedValue(result as any);

            await request(app.getHttpServer())
                .post('/workout-history/start-session')
                .send({ lineUserId: 'U_TRAINEE_001', routineId: 1 })
                .expect(201)
                .expect((res) => {
                    expect(res.body.sessionId).toBe(1);
                });
        });

        it('500 - returns error when service throws', async () => {
            mockService.startSession.mockRejectedValue(new Error('fail'));

            await request(app.getHttpServer())
                .post('/workout-history/start-session')
                .send({ lineUserId: 'U_TRAINEE_001', routineId: 999 })
                .expect(500);
        });
    });

    describe('POST /workout-history/log-session', () => {
        const logSessionDto = {
            sessionId: 1,
            finishedAt: '2024-01-01T11:00:00.000Z',
            sets: [{ exerciseId: 1, setNumber: 1, rep: 10, weightKg: 60, notes: '' }],
        };

        it('201 - logs a completed workout session', async () => {
            mockService.logSession.mockResolvedValue(undefined);

            await request(app.getHttpServer())
                .post('/workout-history/log-session')
                .send(logSessionDto)
                .expect(201);
        });

        it('500 - returns error when service throws', async () => {
            mockService.logSession.mockRejectedValue(new Error('fail'));

            await request(app.getHttpServer())
                .post('/workout-history/log-session')
                .send(logSessionDto)
                .expect(500);
        });
    });

    describe('GET /workout-history/latest-session/:routineId', () => {
        it('200 - returns latest session for routine', async () => {
            const session = WorkoutHistoryFactory.createSession({ finishedAt: new Date('2024-01-01T11:00:00') });
            mockService.getLatestSession.mockResolvedValue(session as any);

            await request(app.getHttpServer())
                .get('/workout-history/latest-session/1?lineUserId=U_TRAINEE_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(1);
                });
        });

        it('400 - returns bad request for non-numeric routine ID', async () => {
            await request(app.getHttpServer())
                .get('/workout-history/latest-session/abc?lineUserId=U_TRAINEE_001')
                .expect(400);
        });
    });
});
