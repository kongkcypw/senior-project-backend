import { ApiProperty } from "@nestjs/swagger";
import { NutritionNotificationTimeDto } from "./nutrition-notification-time.dto";
import { NutritionPlanEntity } from "../entities/nutrition-plan.entity";
import { MealDetailDto } from "./meal-detail.dto";
import { Expose, plainToInstance } from "class-transformer";

export class NutritionPlanDto {

    @ApiProperty()
    @Expose()
    line_user_id: string;

    @ApiProperty()
    @Expose()
    totalCalories: number;

    @ApiProperty()
    @Expose()
    protein: number;

    @ApiProperty()
    @Expose()
    carbohydrate: number;

    @ApiProperty()
    @Expose()
    fat: number;

    @ApiProperty()
    @Expose()
    needNotification: boolean;

    @ApiProperty()
    @Expose()
    notificationTimes: NutritionNotificationTimeDto[];

    @ApiProperty()
    @Expose()
    meals: MealDetailDto[];

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
            // Use substring to convert "HH:mm:ss" to "HH:mm"
            sendAt: notification.sendAt.substring(0, 5)
        }));
        dto.meals = [];
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

    static toEntityWithoutNotificationTimes(dto: NutritionPlanDto): NutritionPlanEntity {
        const entity = new NutritionPlanEntity();
        entity.lineUserId = dto.line_user_id;
        entity.totalCalories = dto.totalCalories;
        entity.protein = dto.protein;
        entity.carbohydrate = dto.carbohydrate;
        entity.fat = dto.fat;
        entity.needNotification = dto.needNotification;
        return entity;
    }

    static fromEntityToDto(rawData: NutritionPlanEntity): NutritionPlanDto {
        const transformedDto = plainToInstance(NutritionPlanDto, rawData);
        return transformedDto;
    }
}