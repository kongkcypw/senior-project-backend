import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { UserController } from 'src/users/controllers/user.controller';
import { UserService } from 'src/users/services/user.service';
import { UserRole } from 'src/users/enums/user-role.enum';
import { buildTestApp } from './helpers/create-test-module';
import { UserFactory } from './factories/user.factory';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let mockUserService: jest.Mocked<Pick<UserService, 'findByLineUserId' | 'insertUserIfNotExist' | 'findUserStatusForEligibleDashboardAccess'>>;

    beforeAll(async () => {
        mockUserService = {
            findByLineUserId: jest.fn(),
            insertUserIfNotExist: jest.fn(),
            findUserStatusForEligibleDashboardAccess: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [UserController],
            providers: [{ provide: UserService, useValue: mockUserService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /user/info/:lineUserId', () => {
        it('200 - returns user info when user exists', async () => {
            const trainer = UserFactory.trainer();
            mockUserService.findByLineUserId.mockResolvedValue(trainer as any);

            await request(app.getHttpServer())
                .get('/user/info/U_TRAINER_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body.lineUserId).toBe('U_TRAINER_001');
                    expect(res.body.role).toBe(UserRole.TRAINER);
                });
        });

        it('404 - returns not found when user does not exist', async () => {
            mockUserService.findByLineUserId.mockRejectedValue(new NotFoundException('User not found'));

            await request(app.getHttpServer())
                .get('/user/info/NON_EXISTENT')
                .expect(404);
        });
    });

    describe('GET /user/dashboard-status/:lineUserId', () => {
        it('200 - returns status for known user', async () => {
            const status = { id: 1, lineUserId: 'U_TRAINER_001', role: UserRole.TRAINER, isTrainer: true, isActiveTrainee: false };
            mockUserService.findUserStatusForEligibleDashboardAccess.mockResolvedValue(status as any);

            await request(app.getHttpServer())
                .get('/user/dashboard-status/U_TRAINER_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body.isTrainer).toBe(true);
                });
        });

        it('200 - returns null for unknown user', async () => {
            mockUserService.findUserStatusForEligibleDashboardAccess.mockResolvedValue(null);

            await request(app.getHttpServer())
                .get('/user/dashboard-status/UNKNOWN')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual({});
                });
        });
    });

    describe('POST /user/create', () => {
        it('201 - creates user successfully', async () => {
            mockUserService.insertUserIfNotExist.mockResolvedValue(undefined);

            await request(app.getHttpServer())
                .post('/user/create')
                .send({ lineUserId: 'U_NEW_001', role: UserRole.TRAINEE })
                .expect(201);

            expect(mockUserService.insertUserIfNotExist).toHaveBeenCalledWith(
                'U_NEW_001', null, UserRole.TRAINEE, null,
            );
        });

        it('500 - returns error when service throws', async () => {
            mockUserService.insertUserIfNotExist.mockRejectedValue(new Error('DB error'));

            await request(app.getHttpServer())
                .post('/user/create')
                .send({ lineUserId: 'U_BAD', role: UserRole.TRAINEE })
                .expect(500);
        });
    });
});
