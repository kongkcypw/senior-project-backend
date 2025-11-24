import { Controller, Get, Param } from "@nestjs/common";
import { MealHistoryEntity } from "../entities/meal-history.entity";
import { MealHistoryService } from "../services/meal-history.service";
import { MealDetailDto } from "../dto/meal-detail.dto";
import { ApiResponse } from "@nestjs/swagger";

@Controller('meal-history')
export class MealHistoryController {
    constructor(
        private readonly mealHistoryService: MealHistoryService,
    ) {}

    @Get(':id')
    @ApiResponse({ status: 200, description: 'Meal detail retrieved successfully.', type: MealDetailDto })
    @ApiResponse({ status: 404, description: 'Meal not found.' })
    async findMealDetailByMealId(
        @Param('id') id: string
    ): Promise<MealDetailDto> {
        return this.mealHistoryService.findMealDetailByMealId(Number(id));
    }
}