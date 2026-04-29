import { INestApplication, NotFoundException } from '@nestjs/common';
import request from 'supertest';
import { MealHistoryController } from 'src/nutrition/controllers/meal-history.controller';
import { MealHistoryService } from 'src/nutrition/services/meal-history.service';
import { buildTestApp } from './helpers/create-test-module';
import { MealHistoryFactory } from './factories/nutrition.factory';

describe('MealHistoryController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<MealHistoryService, 'findMealDetailByMealId' | 'confirmMeal'>>;

    beforeAll(async () => {
        mockService = {
            findMealDetailByMealId: jest.fn(),
            confirmMeal: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [MealHistoryController],
            providers: [{ provide: MealHistoryService, useValue: mockService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /meal-history/:lineUserId/:id', () => {
        it('200 - returns meal detail when found', async () => {
            const meal = MealHistoryFactory.create();
            mockService.findMealDetailByMealId.mockResolvedValue(meal as any);

            await request(app.getHttpServer())
                .get('/meal-history/U_TRAINEE_001/1')
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(1);
                    expect(res.body.foodTitle).toBe('Test Food');
                });
        });

        it('404 - returns not found when meal does not exist', async () => {
            mockService.findMealDetailByMealId.mockRejectedValue(new NotFoundException('Meal with id 999 not found'));

            await request(app.getHttpServer())
                .get('/meal-history/U_TRAINEE_001/999')
                .expect(404);
        });
    });

    describe('PUT /meal-history/:id', () => {
        const mealBody = MealHistoryFactory.create();

        it('200 - confirms meal and returns updated meal detail', async () => {
            const confirmed = MealHistoryFactory.create({ confirmAt: new Date('2024-01-01T12:00:00') });
            mockService.confirmMeal.mockResolvedValue(confirmed as any);

            await request(app.getHttpServer())
                .put('/meal-history/1')
                .send(mealBody)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toBe(1);
                });
        });

        it('500 - returns error when service throws', async () => {
            mockService.confirmMeal.mockRejectedValue(new Error('DB error'));

            await request(app.getHttpServer())
                .put('/meal-history/999')
                .send(mealBody)
                .expect(500);
        });
    });
});
