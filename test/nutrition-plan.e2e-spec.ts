import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { NutritionPlanController } from 'src/nutrition/controllers/nutrition-plan.controller';
import { NutritionPlanService } from 'src/nutrition/services/nutrition-plan.service';
import { buildTestApp } from './helpers/create-test-module';
import { NutritionPlanFactory } from './factories/nutrition.factory';

describe('NutritionPlanController (e2e)', () => {
    let app: INestApplication;
    let mockService: jest.Mocked<Pick<NutritionPlanService, 'getNutritionPlanByLineUserId' | 'createOrUpdateNutritionPlan' | 'findNutritionPlanWithMealsInDay'>>;

    beforeAll(async () => {
        mockService = {
            getNutritionPlanByLineUserId: jest.fn(),
            createOrUpdateNutritionPlan: jest.fn(),
            findNutritionPlanWithMealsInDay: jest.fn(),
        };

        app = await buildTestApp({
            controllers: [NutritionPlanController],
            providers: [{ provide: NutritionPlanService, useValue: mockService }],
        });
    });

    afterAll(() => app.close());

    describe('GET /nutrition-plan/:lineUserId', () => {
        it('200 - returns nutrition plan when found', async () => {
            const plan = NutritionPlanFactory.create();
            mockService.getNutritionPlanByLineUserId.mockResolvedValue(plan as any);

            await request(app.getHttpServer())
                .get('/nutrition-plan/U_TRAINEE_001')
                .expect(200)
                .expect((res) => {
                    expect(res.body.totalCalories).toBe(2000);
                });
        });

        it('200 - returns empty plan when user has no plan', async () => {
            const emptyPlan = NutritionPlanFactory.create({ totalCalories: 0, protein: 0, carbohydrate: 0, fat: 0 });
            mockService.getNutritionPlanByLineUserId.mockResolvedValue(emptyPlan as any);

            await request(app.getHttpServer())
                .get('/nutrition-plan/U_NO_PLAN')
                .expect(200)
                .expect((res) => {
                    expect(res.body.totalCalories).toBe(0);
                });
        });
    });

    describe('POST /nutrition-plan/:lineUserId', () => {
        const planBody = NutritionPlanFactory.create();

        it('201 - creates or updates nutrition plan', async () => {
            mockService.createOrUpdateNutritionPlan.mockResolvedValue(undefined);

            await request(app.getHttpServer())
                .post('/nutrition-plan/U_TRAINEE_001')
                .send(planBody)
                .expect(201);

            expect(mockService.createOrUpdateNutritionPlan).toHaveBeenCalled();
        });

        it('500 - returns error when service throws', async () => {
            mockService.createOrUpdateNutritionPlan.mockRejectedValue(new Error('DB error'));

            await request(app.getHttpServer())
                .post('/nutrition-plan/U_TRAINEE_001')
                .send(planBody)
                .expect(500);
        });
    });

    describe('GET /nutrition-plan/meals/:lineUserId', () => {
        it('200 - returns nutrition plan with meals for a given date', async () => {
            const planWithMeals = NutritionPlanFactory.create({ meals: [] });
            mockService.findNutritionPlanWithMealsInDay.mockResolvedValue(planWithMeals as any);

            await request(app.getHttpServer())
                .get('/nutrition-plan/meals/U_TRAINEE_001?date=2024-01-01')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.meals)).toBe(true);
                });
        });

        it('500 - returns error when service throws', async () => {
            mockService.findNutritionPlanWithMealsInDay.mockRejectedValue(new Error('fail'));

            await request(app.getHttpServer())
                .get('/nutrition-plan/meals/BAD?date=2024-01-01')
                .expect(500);
        });
    });
});
