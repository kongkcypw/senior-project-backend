import { ApiProperty } from "@nestjs/swagger";
import { NutritionNotificationTimeDto } from "./nutrition-notification-time.dto";
import { NutritionPlanEntity } from "../entities/nutrition-plan.entity";

export class NutritionPlanDto {

    @ApiProperty()
    line_user_id: string;

    @ApiProperty()
    totalCalories: number;

    @ApiProperty()
    protein: number;

    @ApiProperty()
    carbohydrate: number;

    @ApiProperty()
    fat: number;

    @ApiProperty()
    needNotification: boolean;

    @ApiProperty()
    notificationTimes: NutritionNotificationTimeDto[];

    static fromEntity(entity: NutritionPlanEntity): NutritionPlanDto {
        const dto = new NutritionPlanDto();
        dto.line_user_id = entity.lineUserId;
        dto.totalCalories = entity.totalCalories;
        dto.protein = entity.protein;
        dto.carbohydrate = entity.carbohydrate;
        dto.fat = entity.fat;
        dto.needNotification = entity.needNotification;
        dto.notificationTimes = entity.notificationTimes.map((notification: any) => ({
            id: notification.id,
            nutritionPlanId: notification.nutritionPlanId,
            sendAt: notification.sendAt,
        }));
        return dto;
    }

    static fromNoRecord(line_user_id: string): NutritionPlanDto {
        const dto = new NutritionPlanDto();
        dto.line_user_id = line_user_id;
        dto.totalCalories = 0;
        dto.protein = 0;
        dto.carbohydrate = 0;
        dto.fat = 0;
        dto.needNotification = false;
        dto.notificationTimes = [];
        return dto;
    }
}