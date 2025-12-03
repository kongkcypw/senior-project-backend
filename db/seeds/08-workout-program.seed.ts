import { MockUsers } from "./01-users.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { WorkoutProgramEntity } from "src/workout/entities/workout-program.entity";

type WorkoutProgramSeed = Omit<WorkoutProgramEntity, 'createdAt' | 'updatedAt' | 'trainee' | 'trainer' | 'routines'>;

export class MockWorkoutPrograms {
    static readonly PPL_TEMPLATE_001: WorkoutProgramSeed = {
        id: 1,
        name: 'Push Pull Legs (PPL) Template',
        lineUserIdTrainee: MockUsers.TRAINEE_USER_003.lineUserId, // Nullable for template
        lineUserIdTrainer: MockUsers.TRAINER_USER_001.lineUserId,
        orderInProgram: 1,
    };

    static readonly WorkoutProgramPlans = [
        this.PPL_TEMPLATE_001,
    ]
}

export default class MockWorkoutProgramSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutProgramEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutPrograms.WorkoutProgramPlans);
    }
}