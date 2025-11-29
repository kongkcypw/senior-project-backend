import { Module } from "@nestjs/common";
import { MealHistoryController } from "./controllers/meal-history.controller";
import { MealHistoryRepository } from "./repositories/meal-history.repository";
import { MealHistoryService } from "./services/meal-history.service";
import { NutritionPlanRepository } from "./repositories/nutrition-plan.repository";

@Module({
    imports: [],
    providers: [MealHistoryRepository, MealHistoryService, NutritionPlanRepository],
    controllers: [MealHistoryController],
    exports: [MealHistoryService],
})

export class NutritionModule {}