import { Body, Controller, Get, Param, Put, UseGuards } from "@nestjs/common";
import { MealHistoryService } from "../services/meal-history.service";
import { MealDetailDto } from "../dto/meal-detail.dto";
import { ApiResponse } from "@nestjs/swagger";
import { UserRole } from "src/users/enums/user-role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";
import { getProtectedGuards } from "src/utils/guards.util";

@Controller('meal-history')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class MealHistoryController {
    constructor(
        private readonly mealHistoryService: MealHistoryService,
    ) { }

    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    @Get(':lineUserId/:id')
    @ApiResponse({ status: 200, description: 'Meal detail retrieved successfully.', type: MealDetailDto })
    @ApiResponse({ status: 404, description: 'Meal not found.' })
    async findMealDetailByMealId(
        @Param('id') id: string,
        @Param('lineUserId') lineUserId: string
    ): Promise<MealDetailDto> {
        return this.mealHistoryService.findMealDetailByMealId(Number(id));
    }

    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    @Put('/:id')
    @ApiResponse({ status: 200, description: 'Meal confirmed successfully.', type: MealDetailDto })
    @ApiResponse({ status: 404, description: 'Meal not found.' })
    async confirmMeal(
        @Param('id') id: string,
        @Body() body: MealDetailDto
    ): Promise<MealDetailDto> {
        return this.mealHistoryService.confirmMeal(Number(id), body);
    }
}