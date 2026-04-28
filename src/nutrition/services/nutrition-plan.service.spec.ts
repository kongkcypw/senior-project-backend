import { NutritionPlanService } from './nutrition-plan.service';
import { NutritionPlanDto } from '../dto/nutrition-plan.dto';

describe('NutritionPlanService', () => {
    let service: NutritionPlanService;
    let nutritionPlanRepository: any;
    let nutritionNotificationTimeRepository: any;
    let mealHistoryService: any;

    beforeEach(() => {
        nutritionPlanRepository = {
            findByLineUserId: jest.fn(),
            upsertNutritionPlan: jest.fn(),
        };
        nutritionNotificationTimeRepository = {
            create: jest.fn(() => ({})),
            save: jest.fn(),
            deleteNotificationsNotIn: jest.fn(),
        };
        mealHistoryService = {
            findMealsByDate: jest.fn(),
        };
        service = new NutritionPlanService(
            nutritionPlanRepository,
            nutritionNotificationTimeRepository,
            mealHistoryService,
        );
    });

    describe('getNutritionPlanByLineUserId', () => {
        it('returns no-record DTO when no plan', async () => {
            nutritionPlanRepository.findByLineUserId.mockResolvedValue(null);
            const r = await service.getNutritionPlanByLineUserId('U1');
            expect(r?.totalCalories).toBe(0);
            expect(r?.line_user_id).toBe('U1');
        });

        it('maps entity to DTO when plan exists', async () => {
            nutritionPlanRepository.findByLineUserId.mockResolvedValue({
                lineUserId: 'U1',
                totalCalories: 2000,
                protein: 150,
                carbohydrate: 250,
                fat: 50,
                needNotification: true,
                notificationTimes: [{ id: 1, nutritionPlanId: 1, sendAt: '08:00:00' }],
            });
            const r = await service.getNutritionPlanByLineUserId('U1');
            expect(r?.totalCalories).toBe(2000);
            expect(r?.notificationTimes[0].sendAt).toBe('08:00');
        });
    });

    describe('createOrUpdateNutritionPlan', () => {
        it('saves new plan and creates new notification times', async () => {
            const dto = new NutritionPlanDto();
            dto.line_user_id = 'U1';
            dto.totalCalories = 2000;
            dto.protein = 150;
            dto.carbohydrate = 250;
            dto.fat = 50;
            dto.needNotification = true;
            dto.notificationTimes = [{ id: null, nutritionPlanId: null, sendAt: '08:00' } as any];

            nutritionPlanRepository.upsertNutritionPlan.mockResolvedValue({ id: 10 });
            nutritionNotificationTimeRepository.save.mockResolvedValue([{ id: 100 }]);

            await service.createOrUpdateNutritionPlan(dto);

            expect(nutritionPlanRepository.upsertNutritionPlan).toHaveBeenCalled();
            expect(nutritionNotificationTimeRepository.save).toHaveBeenCalled();
            expect(nutritionNotificationTimeRepository.deleteNotificationsNotIn).toHaveBeenCalled();
        });

        it('sets needNotification=false when no notification times', async () => {
            const dto = new NutritionPlanDto();
            dto.line_user_id = 'U1';
            dto.totalCalories = 2000;
            dto.protein = 150;
            dto.carbohydrate = 250;
            dto.fat = 50;
            dto.needNotification = true;
            dto.notificationTimes = [];

            nutritionPlanRepository.upsertNutritionPlan.mockResolvedValue({ id: 10 });
            await service.createOrUpdateNutritionPlan(dto);

            const upsertedArg = nutritionPlanRepository.upsertNutritionPlan.mock.calls[0][0];
            expect(upsertedArg.needNotification).toBe(false);
        });

        it('updates existing notification times when ID present', async () => {
            const dto = new NutritionPlanDto();
            dto.line_user_id = 'U1';
            dto.totalCalories = 2000;
            dto.protein = 150;
            dto.carbohydrate = 250;
            dto.fat = 50;
            dto.needNotification = true;
            dto.notificationTimes = [{ id: 5, nutritionPlanId: 10, sendAt: '08:00' } as any];

            nutritionPlanRepository.upsertNutritionPlan.mockResolvedValue({ id: 10 });
            await service.createOrUpdateNutritionPlan(dto);

            expect(nutritionNotificationTimeRepository.save).toHaveBeenCalledWith([
                { id: 5, nutritionPlanId: 10, sendAt: '08:00:00' },
            ]);
        });
    });

    describe('findNutritionPlanWithMealsInDay', () => {
        it('returns no-record DTO when no plan', async () => {
            nutritionPlanRepository.findByLineUserId.mockResolvedValue(null);
            const r = await service.findNutritionPlanWithMealsInDay('U1', '2024-01-01');
            expect(r?.totalCalories).toBe(0);
        });

        it('attaches meals when plan exists', async () => {
            nutritionPlanRepository.findByLineUserId.mockResolvedValue({
                lineUserId: 'U1',
                totalCalories: 2000,
                protein: 150,
                carbohydrate: 250,
                fat: 50,
                needNotification: false,
                notificationTimes: [],
            });
            mealHistoryService.findMealsByDate.mockResolvedValue([{ id: 1 } as any]);
            const r = await service.findNutritionPlanWithMealsInDay('U1', '2024-01-01');
            expect(r?.meals).toHaveLength(1);
            expect(mealHistoryService.findMealsByDate).toHaveBeenCalled();
        });
    });
});
