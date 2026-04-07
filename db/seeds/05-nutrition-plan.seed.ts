import { NutritionPlanEntity } from "src/nutrition/entities/nutrition-plan.entity";
import { MockUsers } from "./01-users.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

type NutritionPlanSeed = Omit<NutritionPlanEntity, 'createdAt' | 'updatedAt' | 'user' | 'notificationTimes'>;

export class MockNutritionPlan {
    // Latif's plan
    static readonly NUTRITION_PLAN_001: NutritionPlanSeed = {
        id: 1,
        lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        totalCalories: 2500,
        protein: 150,
        carbohydrate: 200,
        fat: 90,
        needNotification: true,
    };

    // Arisa — clean-bulk plan (high performer)
    static readonly NUTRITION_PLAN_002: NutritionPlanSeed = {
        id: 2,
        lineUserId: MockUsers.TRAINEE_USER_004.lineUserId,
        totalCalories: 2000,
        protein: 120,
        carbohydrate: 200,
        fat: 65,
        needNotification: true,
    };

    // Tawan — moderate cut (medium performer)
    static readonly NUTRITION_PLAN_003: NutritionPlanSeed = {
        id: 3,
        lineUserId: MockUsers.TRAINEE_USER_005.lineUserId,
        totalCalories: 2200,
        protein: 140,
        carbohydrate: 220,
        fat: 70,
        needNotification: false,
    };

    // Nuch — maintenance plan (low performer — barely logs)
    static readonly NUTRITION_PLAN_004: NutritionPlanSeed = {
        id: 4,
        lineUserId: MockUsers.TRAINEE_USER_006.lineUserId,
        totalCalories: 1800,
        protein: 100,
        carbohydrate: 180,
        fat: 55,
        needNotification: false,
    };

    static readonly NutritionPlans = [
        this.NUTRITION_PLAN_001,
        this.NUTRITION_PLAN_002,
        this.NUTRITION_PLAN_003,
        this.NUTRITION_PLAN_004,
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
