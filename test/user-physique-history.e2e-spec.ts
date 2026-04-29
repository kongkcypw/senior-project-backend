import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { UserPhysiqueHistoryController } from 'src/users/controllers/user-physique-history.controller';
import { UserPhysiqueHistoryService } from 'src/users/services/user-physique-history.service';
import { buildTestApp } from './helpers/create-test-module';
import { UserFactory } from './factories/user.factory';

describe('UserPhysiqueHistoryController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<UserPhysiqueHistoryService, 'getPhysiqueHistoryByLineUserId' | 'insertPhysiqueHistoryForTrainee'>>;

    beforeAll(async () => {
        mockService = {
            getPhysiqueHistoryByLineUserId: jest.fn(),
            insertPhysiqueHistoryForTrainee: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [UserPhysiqueHistoryController],
            providers: [{ provide: UserPhysiqueHistoryService, useValue: mockService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /user-physique-history/:lineUserId', () => {
        it('200 - returns physique history records', async () => {
            const record = UserFactory.physiqueHistory();
            mockService.getPhysiqueHistoryByLineUserId.mockResolvedValue([record] as any);

            await request(app.getHttpServer())
                .get('/user-physique-history/U_TRAINEE_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveLength(1);
                    expect(res.body[0].lineUserId).toBe('U_TRAINEE_001');
                });
        });

        it('200 - returns empty array when no records exist', async () => {
            mockService.getPhysiqueHistoryByLineUserId.mockResolvedValue([]);

            await request(app.getHttpServer())
                .get('/user-physique-history/U_TRAINEE_EMPTY')
                .expect(200)
                .expect((res) => { expect(res.body).toEqual([]); });
        });
    });

    describe('POST /user-physique-history', () => {
        const validBody = {
            lineUserId: 'U_TRAINEE_001',
            age: 25,
            weight: 70,
            height: 175,
            bodyFatPercentage: 20,
            goal: 'lose weight',
        };

        it('201 - inserts physique record successfully', async () => {
            mockService.insertPhysiqueHistoryForTrainee.mockResolvedValue(undefined);

            await request(app.getHttpServer())
                .post('/user-physique-history')
                .send(validBody)
                .expect(201);

            expect(mockService.insertPhysiqueHistoryForTrainee).toHaveBeenCalledWith(validBody);
        });

        it('500 - returns error when user is not found', async () => {
            mockService.insertPhysiqueHistoryForTrainee.mockRejectedValue(new Error('User not found'));

            await request(app.getHttpServer())
                .post('/user-physique-history')
                .send({ ...validBody, lineUserId: 'NON_EXISTENT' })
                .expect(500);
        });
    });
});
