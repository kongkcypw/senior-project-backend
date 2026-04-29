import { BadRequestException, INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserRelationshipsController } from 'src/users/controllers/user-relationships.controller';
import { UserRelationshipsService } from 'src/users/services/user-relationships.service';
import { buildTestApp } from './helpers/create-test-module';
import { UserFactory } from './factories/user.factory';

describe('UserRelationshipsController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<
        UserRelationshipsService,
        | 'findAllTraineeByTrainerLineUserId'
        | 'getTraineeDetailByLineUserId'
        | 'getHomeStatsForTrainer'
        | 'findTraineesSummaryByTrainer'
        | 'getScoreHistoryForTrainer'
        | 'getScoreHistoryForTrainee'
    >>;

    beforeAll(async () => {
        mockService = {
            findAllTraineeByTrainerLineUserId: jest.fn(),
            getTraineeDetailByLineUserId: jest.fn(),
            getHomeStatsForTrainer: jest.fn(),
            findTraineesSummaryByTrainer: jest.fn(),
            getScoreHistoryForTrainer: jest.fn(),
            getScoreHistoryForTrainee: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [UserRelationshipsController],
            providers: [{ provide: UserRelationshipsService, useValue: mockService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /user-relationships/trainees-by-trainer/:lineUserId', () => {
        it('200 - returns list of trainees for trainer', async () => {
            const trainee = UserFactory.trainee();
            mockService.findAllTraineeByTrainerLineUserId.mockResolvedValue([trainee] as any);

            await request(app.getHttpServer())
                .get('/user-relationships/trainees-by-trainer/U_TRAINER_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveLength(1);
                });
        });

        it('200 - returns empty array when trainer has no trainees', async () => {
            mockService.findAllTraineeByTrainerLineUserId.mockResolvedValue([]);

            await request(app.getHttpServer())
                .get('/user-relationships/trainees-by-trainer/U_TRAINER_EMPTY')
                .expect(200)
                .expect((res) => { expect(res.body).toEqual([]); });
        });
    });

    describe('GET /user-relationships/trainee/:lineUserId', () => {
        it('200 - returns trainee detail', async () => {
            const detail = { lineUserId: 'U_TRAINEE_001', calories: { consumed: 500, goal: 2000 } };
            mockService.getTraineeDetailByLineUserId.mockResolvedValue(detail as any);

            await request(app.getHttpServer())
                .get('/user-relationships/trainee/U_TRAINEE_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body.lineUserId).toBe('U_TRAINEE_001');
                });
        });

        it('500 - returns error when service throws', async () => {
            mockService.getTraineeDetailByLineUserId.mockRejectedValue(new Error('DB error'));

            await request(app.getHttpServer())
                .get('/user-relationships/trainee/BAD_ID')
                .expect(500);
        });
    });

    describe('GET /user-relationships/home-stats/:lineUserId', () => {
        it('200 - returns home stats for trainer', async () => {
            const stats = { nutrition: { total: 4, completed: 3 }, workout: { total: 4, completed: 2 } };
            mockService.getHomeStatsForTrainer.mockResolvedValue(stats as any);

            await request(app.getHttpServer())
                .get('/user-relationships/home-stats/U_TRAINER_001')
                .expect(200);
        });

        it('500 - returns error when service throws', async () => {
            mockService.getHomeStatsForTrainer.mockRejectedValue(new Error('fail'));

            await request(app.getHttpServer())
                .get('/user-relationships/home-stats/BAD')
                .expect(500);
        });
    });

    describe('GET /user-relationships/trainees-summary/:lineUserId', () => {
        it('200 - returns trainees summary', async () => {
            mockService.findTraineesSummaryByTrainer.mockResolvedValue([] as any);

            await request(app.getHttpServer())
                .get('/user-relationships/trainees-summary/U_TRAINER_001')
                .expect(200);
        });

        it('500 - returns error when service throws', async () => {
            mockService.findTraineesSummaryByTrainer.mockRejectedValue(new Error('fail'));

            await request(app.getHttpServer())
                .get('/user-relationships/trainees-summary/BAD')
                .expect(500);
        });
    });

    describe('GET /user-relationships/score-history/:lineUserId', () => {
        it('200 - returns score history with valid period', async () => {
            const history = { period: 'weekly', points: [] };
            mockService.getScoreHistoryForTrainer.mockResolvedValue(history as any);

            await request(app.getHttpServer())
                .get('/user-relationships/score-history/U_TRAINER_001?period=weekly')
                .expect(200);
        });

        it('400 - returns bad request for invalid period', async () => {
            await request(app.getHttpServer())
                .get('/user-relationships/score-history/U_TRAINER_001?period=invalid')
                .expect(400);
        });
    });

    describe('GET /user-relationships/my-score-history/:lineUserId', () => {
        it('200 - returns personal score history with default period', async () => {
            const history = { period: 'weekly', points: [] };
            mockService.getScoreHistoryForTrainee.mockResolvedValue(history as any);

            await request(app.getHttpServer())
                .get('/user-relationships/my-score-history/U_TRAINEE_001')
                .expect(200);
        });

        it('400 - returns bad request for invalid period', async () => {
            await request(app.getHttpServer())
                .get('/user-relationships/my-score-history/U_TRAINEE_001?period=bad')
                .expect(400);
        });
    });
});
