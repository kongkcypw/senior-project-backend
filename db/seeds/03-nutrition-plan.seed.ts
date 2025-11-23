import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";
import { NutritionPlanEntity } from "src/nutrition/entities/nutrition-plan.entity";

type NutritionPlanSeedType =  Omit<NutritionPlanEntity, 'createdAt' | 'updatedAt' | 'user' | 'notificationSchedule'>;

export class MockNutritionPlan {
    static readonly NUTRITION_PlAN_001: NutritionPlanSeedType = {
        id: 1,
        lineUserId: MockUsers.TRAINEE_USER_002.lineUserId,
        totalCalories: 2000,
        protein: 150,
        carbohydrate: 250,
        fat: 70,
        needNotification: true,
        notificationScheduleId: 1,
    };

    static readonly NutritionPlans = [
        this.NUTRITION_PlAN_001,
    ]
}

export default class MockNutritionPlanSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(NutritionPlanEntity);

        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )

        await repository.save(MockNutritionPlan.NutritionPlans);
    }
}