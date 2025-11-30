import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MealHistoryEntity } from "../entities/meal-history.entity";
import { MealHistoryService } from "../services/meal-history.service";
import { MealDetailDto } from "../dto/meal-detail.dto";
import { ApiResponse } from "@nestjs/swagger";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UserRole } from "src/users/enums/user-role.enum";
import { Roles } from "src/auth/decorators/roles.decorator";

@Controller('meal-history')
@UseGuards(AuthGuard('liff-jwt'), RolesGuard)
export class MealHistoryController {
    constructor(
        private readonly mealHistoryService: MealHistoryService,
    ) {}

    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    @Get(':id')
    @ApiResponse({ status: 200, description: 'Meal detail retrieved successfully.', type: MealDetailDto })
    @ApiResponse({ status: 404, description: 'Meal not found.' })
    async findMealDetailByMealId(
        @Param('id') id: string
    ): Promise<MealDetailDto> {
        return this.mealHistoryService.findMealDetailByMealId(Number(id));
    }
}