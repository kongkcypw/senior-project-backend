import { MockUsers } from "./01-users.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { WorkoutProgramEntity } from "src/workout/entities/workout-program.entity";

type WorkoutProgramSeed = Omit<WorkoutProgramEntity, 'createdAt' | 'updatedAt' | 'description' | 'trainee' | 'trainer' | 'routines'>;

export class MockWorkoutPrograms {
    // Latif — PPL (3 routines)
    static readonly PPL_TEMPLATE_001: WorkoutProgramSeed = {
        id: 1,
        name: 'Push Pull Legs (PPL) Template',
        lineUserIdTrainee: MockUsers.TRAINEE_USER_003.lineUserId,
        lineUserIdTrainer: MockUsers.TRAINER_USER_001.lineUserId,
        orderInWorkout: 1,
    };

    // Arisa — PPL (3 routines) — high performer
    static readonly PPL_ARISA_002: WorkoutProgramSeed = {
        id: 2,
        name: 'Push Pull Legs — Arisa',
        lineUserIdTrainee: MockUsers.TRAINEE_USER_004.lineUserId,
        lineUserIdTrainer: MockUsers.TRAINER_USER_001.lineUserId,
        orderInWorkout: 1,
    };

    // Tawan — Upper / Lower (4 routines) — medium performer
    static readonly UPPER_LOWER_TAWAN_003: WorkoutProgramSeed = {
        id: 3,
        name: 'Upper Lower Split — Tawan',
        lineUserIdTrainee: MockUsers.TRAINEE_USER_005.lineUserId,
        lineUserIdTrainer: MockUsers.TRAINER_USER_001.lineUserId,
        orderInWorkout: 1,
    };

    // Nuch — Full Body (3 routines) — low performer
    static readonly FULL_BODY_NUCH_004: WorkoutProgramSeed = {
        id: 4,
        name: 'Full Body Program — Nuch',
        lineUserIdTrainee: MockUsers.TRAINEE_USER_006.lineUserId,
        lineUserIdTrainer: MockUsers.TRAINER_USER_001.lineUserId,
        orderInWorkout: 1,
    };

    static readonly WorkoutProgramPlans = [
        this.PPL_TEMPLATE_001,
        this.PPL_ARISA_002,
        this.UPPER_LOWER_TAWAN_003,
        this.FULL_BODY_NUCH_004,
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
