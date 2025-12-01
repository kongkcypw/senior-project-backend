import { Injectable } from "@nestjs/common";
import { NutritionPlanRepository } from "../repositories/nutrition-plan.repository";
import { NutritionPlanDto } from "../dto/nutrition-plan.dto";

@Injectable()
export class NutritionPlanService {
    constructor(
        private readonly nutritionPlanRepository: NutritionPlanRepository
    ) {}

    async getNutritionPlanByLineUserId(lineUserId: string): Promise<NutritionPlanDto | null> {
        const nutritionPlan = await this.nutritionPlanRepository.findByLineUserId(lineUserId);
        if (!nutritionPlan) {
            return null;
        }
        // return NutritionPlanDto.fromEntity(nutritionPlan);
        return NutritionPlanDto.fromNoRecord(lineUserId);
    }
}