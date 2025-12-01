import { ApiProperty } from "@nestjs/swagger";

export class NutritionNotificationTimeDto {
    @ApiProperty()
    id: number;

    @ApiProperty()
    nutritionPlanId: number;

    @ApiProperty()
    sendAt: string;
}