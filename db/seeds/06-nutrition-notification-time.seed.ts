import { NutritionNotificationTimeEntity } from "src/nutrition/entities/nutrition-notification-time.entity";
import { DataSource } from "typeorm";
import { MockNutritionPlan } from "./05-nutrition-plan.seed";

type NutritionNotificationTime = Omit<NutritionNotificationTimeEntity, 'createdAt' | 'updatedAt' | 'nutritionPlan'>;

export class MockNutritionNotificationTimes {
    static readonly NUTRITION_NOTIFICATION_TIME_001: NutritionNotificationTime = {
        id: 1,
        nutritionPlanId: MockNutritionPlan.NUTRITION_PLAN_001.id,
        sendAt: '08:00',
    };

    static readonly NUTRITION_NOTIFICATION_TIME_002: NutritionNotificationTime = {
        id: 2,
        nutritionPlanId: MockNutritionPlan.NUTRITION_PLAN_001.id,
        sendAt: '12:00',
    };

    static readonly NUTRITION_NOTIFICATION_TIME_003: NutritionNotificationTime = {
        id: 3,
        nutritionPlanId: MockNutritionPlan.NUTRITION_PLAN_001.id,
        sendAt: '18:00',
    };

    static readonly NutritionNotificationTimes = [
        this.NUTRITION_NOTIFICATION_TIME_001,
        this.NUTRITION_NOTIFICATION_TIME_002,
        this.NUTRITION_NOTIFICATION_TIME_003,
    ]
}

export default class MockNutritionNotificationTimeSeed {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(NutritionNotificationTimeEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockNutritionNotificationTimes.NutritionNotificationTimes);
    }
}