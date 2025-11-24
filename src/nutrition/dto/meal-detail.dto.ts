import { ApiProperty } from "@nestjs/swagger";

export class MealDetailDto {

    @ApiProperty()
    id: number;

    @ApiProperty()
    lineUserId: string;

    @ApiProperty()
    imageUrl: string;

    @ApiProperty()
    foodTitle: string;

    @ApiProperty()
    calories: number;

    @ApiProperty()
    protein: number;

    @ApiProperty()
    carbohydrate: number;

    @ApiProperty()
    fat: number;

    @ApiProperty()
    ingredients: any[];

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    confirmAt: Date | null;

    @ApiProperty()
    isNutritionPlanExist: boolean;

    @ApiProperty()
    totalDailyCalories?: number | null;

    @ApiProperty()
    totalDailyProtein?: number | null;

    @ApiProperty()
    totalDailyCarbohydrate?: number | null;

    @ApiProperty()
    totalDailyFat?: number | null;
}