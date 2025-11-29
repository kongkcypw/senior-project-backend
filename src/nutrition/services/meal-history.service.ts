import { Injectable, NotFoundException } from "@nestjs/common";
import { MealHistoryRepository } from "../repositories/meal-history.repository";
import { MealHistoryEntity } from "../entities/meal-history.entity";
import { Between } from "typeorm";
import { NutritionPlanRepository } from "../repositories/nutrition-plan.repository";
import { MealDetailDto } from "../dto/meal-detail.dto";
import { NutritionPlanEntity } from "../entities/nutrition-plan.entity";

@Injectable()
export class MealHistoryService {
    constructor(
        private readonly mealHistoryRepository: MealHistoryRepository,
        private readonly nutritionPlanRepository: NutritionPlanRepository,
    ) {}

    private mapToMealDetailDto(meal: MealHistoryEntity, plan: NutritionPlanEntity | null): MealDetailDto {
        const dto: MealDetailDto = {
            id: meal.id,
            lineUserId: meal.lineUserId,
            imageUrl: meal.imageUrl,
            foodTitle: meal.foodTitle,
            calories: meal.calories,
            protein: meal.protein,
            carbohydrate: meal.carbohydrate,
            fat: meal.fat,
            ingredients: meal.ingredients,
            createdAt: meal.createdAt,
            confirmAt: meal.confirmAt,
            isNutritionPlanExist: !!plan,
            totalDailyCalories: null,
            totalDailyProtein: null,
            totalDailyCarbohydrate: null,
            totalDailyFat: null,
        };

        if (plan) {
            dto.totalDailyCalories = plan.totalCalories;
            dto.totalDailyProtein = plan.protein;
            dto.totalDailyCarbohydrate = plan.carbohydrate;
            dto.totalDailyFat = plan.fat;
        }

        return dto;
    }

    async findMealDetailByMealId(id: number): Promise<MealDetailDto> {
        const meal = await this.mealHistoryRepository.findOne({ where: { id } });
        
        if (!meal) {
            throw new NotFoundException(`Meal with id ${id} not found`);
        }

        const plan = await this.nutritionPlanRepository.findOne({
            where: { lineUserId: meal.lineUserId },
        });

        return this.mapToMealDetailDto(meal, plan);
    }

    async insertMealHistory(mealData: Partial<MealHistoryEntity>): Promise<MealHistoryEntity> {
        const meal = this.mealHistoryRepository.create(mealData);
        return this.mealHistoryRepository.save(meal);
    }
}