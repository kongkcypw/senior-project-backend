import { NutritionPlanEntity } from "src/nutrition/entities/nutrition-plan.entity";
import { MockUsers } from "./01-users.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

type NutritionPlanSeed = Omit<NutritionPlanEntity, 'createdAt' | 'updatedAt' | 'user' | 'notificationTimes'>;

export class MockNutritionPlan {
    static readonly NUTRITION_PLAN_001: NutritionPlanSeed = {
        id: 1,
        lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        totalCalories: 2500,
        protein: 150,
        carbohydrate: 200,
        fat: 90,
        needNotification: true,
    };

    static readonly NutritionPlans = [
        this.NUTRITION_PLAN_001,
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