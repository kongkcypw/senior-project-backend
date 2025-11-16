import { UserCaloriesEntity } from "src/users/entities/user-calories.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";
import { UserCaloriesPlanEntity } from "src/users/entities/user-calories-plan.entity";

type UserCaloriesPlanSeedType =  Omit<UserCaloriesPlanEntity, 'createdAt' | 'updatedAt' | 'user' | 'notificationSchedule'>;

export class MockUserCaloriesPlan {
    static readonly USER_CALORIES_PlAN_001: UserCaloriesPlanSeedType = {
        id: 1,
        lineUserId: MockUsers.TRAINEE_USER_002.lineUserId,
        totalCalories: 2000,
        protein: 150,
        carbohydrate: 250,
        fat: 70,
        needNotification: true,
        notificationScheduleId: 1,
    };

    static readonly UserCaloriesPlans = [
        this.USER_CALORIES_PlAN_001,
    ]
}

export default class MockUserCaloriesPlanSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(UserCaloriesPlanEntity);

        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )

        await repository.save(MockUserCaloriesPlan.UserCaloriesPlans);
    }
}