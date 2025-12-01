import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { getProtectedGuards } from "src/utils/guards.util";
import { NutritionPlanService } from "../services/nutrition-plan.service";
import { NutritionPlanDto } from "../dto/nutrition-plan.dto";

@Controller('nutrition-plan')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class NutritionPlanController {
    constructor(
        private readonly  nutritionPlanService: NutritionPlanService,
    ) { }

    @Get(':lineUserId')
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    async getNutritionPlanByLineUserId(
        @Param('lineUserId') lineUserId: string
    ) : Promise<NutritionPlanDto | null> {
        return this.nutritionPlanService.getNutritionPlanByLineUserId(lineUserId);
    }

    @Post(':lineUserId')
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    async createOrUpdateNutritionPlan(
        @Param('lineUserId') lineUserId: string,
        @Body() nutritionPlanDto: NutritionPlanDto
    ): Promise<void> {
        return this.nutritionPlanService.createOrUpdateNutritionPlan(nutritionPlanDto);
    }
}