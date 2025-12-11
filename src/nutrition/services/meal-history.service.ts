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
    ) { }

    async findMealDetailByMealId(id: number): Promise<MealDetailDto> {
        const meal = await this.mealHistoryRepository.findOne({ where: { id } });

        if (!meal) {
            throw new NotFoundException(`Meal with id ${id} not found`);
        }
        const mealDto = MealDetailDto.fromEntityToDto(meal);

        return mealDto;
    }

    async insertMealHistory(mealData: Partial<MealHistoryEntity>): Promise<MealDetailDto> {
        const meal = this.mealHistoryRepository.create(mealData);
        const mealDto = MealDetailDto.fromEntityToDto(meal);
        return mealDto;
    }

    async confirmMeal(id: number, mealData: Partial<MealHistoryEntity>): Promise<MealDetailDto> {
        const meal = this.mealHistoryRepository.create(mealData);
        meal.confirmAt = new Date();
        await this.mealHistoryRepository.save(meal);
        const mealDto = MealDetailDto.fromEntityToDto(meal);
        return mealDto;
    }

    async findMealsByDate(lineUserId: string, date: Date): Promise<MealDetailDto[]> {
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
        const meals = await this.mealHistoryRepository.find({ where: { lineUserId, createdAt: Between(startOfDay, endOfDay) } });

        const mealsDto = meals.map(meal => MealDetailDto.fromEntityToDto(meal));
        return mealsDto;
    }
}