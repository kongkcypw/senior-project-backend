import { WorkoutProgramPlanEntity } from "src/workout/entities/workout-program-plan.entity";
import { MockUsers } from "./01-users.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

type WorkoutProgramPlanSeed = Omit<WorkoutProgramPlanEntity, 'createdAt' | 'updatedAt' | 'trainee' | 'trainer' | 'dayDefinitions'>;

export class MockWorkoutProgramPlans {
    static readonly PPL_TEMPLATE_001: WorkoutProgramPlanSeed = {
        id: 1,
        name: 'Push Pull Legs (PPL) Template',
        lineUserIdTrainee: MockUsers.TRAINEE_USER_003.lineUserId, // Nullable for template
        lineUserIdTrainer: MockUsers.TRAINER_USER_001.lineUserId,
    };

    static readonly WorkoutProgramPlans = [
        this.PPL_TEMPLATE_001,
    ]
}

export default class MockWorkoutProgramPlanSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutProgramPlanEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutProgramPlans.WorkoutProgramPlans);
    }
}