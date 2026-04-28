import { NotFoundException } from '@nestjs/common';
import { MealHistoryService } from './meal-history.service';

describe('MealHistoryService', () => {
    let service: MealHistoryService;
    let mealHistoryRepository: any;
    let nutritionPlanRepository: any;

    beforeEach(() => {
        mealHistoryRepository = {
            findOne: jest.fn(),
            create: jest.fn((x) => ({ ...x })),
            save: jest.fn((x) => Promise.resolve({ id: 1, ...x })),
            find: jest.fn(),
        };
        nutritionPlanRepository = {};
        service = new MealHistoryService(mealHistoryRepository, nutritionPlanRepository);
    });

    describe('findMealDetailByMealId', () => {
        it('returns meal DTO when found', async () => {
            mealHistoryRepository.findOne.mockResolvedValue({ id: 1, foodTitle: 'rice' });
            const r = await service.findMealDetailByMealId(1);
            expect(r).toBeDefined();
            expect(mealHistoryRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
        });

        it('throws NotFoundException when meal missing', async () => {
            mealHistoryRepository.findOne.mockResolvedValue(null);
            await expect(service.findMealDetailByMealId(1)).rejects.toBeInstanceOf(NotFoundException);
        });
    });

    describe('insertMealHistory', () => {
        it('creates and saves with confirmAt=null', async () => {
            const data = { lineUserId: 'U1', foodTitle: 'food' };
            const r = await service.insertMealHistory(data);
            expect(mealHistoryRepository.create).toHaveBeenCalledWith(data);
            expect(mealHistoryRepository.save).toHaveBeenCalled();
            const savedArg = mealHistoryRepository.save.mock.calls[0][0];
            expect(savedArg.confirmAt).toBeNull();
            expect(r).toBeDefined();
        });
    });

    describe('confirmMeal', () => {
        it('saves with confirmAt set to a Date', async () => {
            const data = { foodTitle: 'food' };
            const r = await service.confirmMeal(2, data);
            const savedArg = mealHistoryRepository.save.mock.calls[0][0];
            expect(savedArg.confirmAt).toBeInstanceOf(Date);
            expect(r).toBeDefined();
        });
    });

    describe('findMealsByDate', () => {
        it('queries with start/end-of-day window and maps DTOs', async () => {
            const date = new Date(2024, 5, 10);
            mealHistoryRepository.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
            const r = await service.findMealsByDate('U1', date);
            expect(mealHistoryRepository.find).toHaveBeenCalled();
            expect(r).toHaveLength(2);
        });
    });
});
