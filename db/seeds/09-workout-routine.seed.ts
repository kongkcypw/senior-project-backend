import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";;
import { WorkoutRoutineEntity } from "src/workout/entities/workout-routine.entity";
import { MockWorkoutPrograms } from "./08-workout-program.seed";

type WorkoutRoutineSeed = Omit<WorkoutRoutineEntity, 'createdAt' | 'updatedAt' | 'description' | 'workoutProgram' | 'exercises' | 'workoutHistories'>;

export class MockWorkoutRoutines {
    // --- Latif PPL (program 1) ---
    static readonly DAY_PUSH_001: WorkoutRoutineSeed = {
        id: 1,
        programId: MockWorkoutPrograms.PPL_TEMPLATE_001.id,
        name: 'Push Day',
        orderInProgram: 1,
    };

    static readonly DAY_PULL_002: WorkoutRoutineSeed = {
        id: 2,
        programId: MockWorkoutPrograms.PPL_TEMPLATE_001.id,
        name: 'Pull Day',
        orderInProgram: 2,
    };

    static readonly DAY_LEGS_003: WorkoutRoutineSeed = {
        id: 3,
        programId: MockWorkoutPrograms.PPL_TEMPLATE_001.id,
        name: 'Leg Day',
        orderInProgram: 3,
    };

    // --- Arisa PPL (program 2) — 3 routines ---
    static readonly ARISA_PUSH_004: WorkoutRoutineSeed = {
        id: 4,
        programId: MockWorkoutPrograms.PPL_ARISA_002.id,
        name: 'Push Day',
        orderInProgram: 1,
    };

    static readonly ARISA_PULL_005: WorkoutRoutineSeed = {
        id: 5,
        programId: MockWorkoutPrograms.PPL_ARISA_002.id,
        name: 'Pull Day',
        orderInProgram: 2,
    };

    static readonly ARISA_LEGS_006: WorkoutRoutineSeed = {
        id: 6,
        programId: MockWorkoutPrograms.PPL_ARISA_002.id,
        name: 'Leg Day',
        orderInProgram: 3,
    };

    // --- Tawan Upper/Lower (program 3) — 4 routines ---
    static readonly TAWAN_UPPER_A_007: WorkoutRoutineSeed = {
        id: 7,
        programId: MockWorkoutPrograms.UPPER_LOWER_TAWAN_003.id,
        name: 'Upper A',
        orderInProgram: 1,
    };

    static readonly TAWAN_UPPER_B_008: WorkoutRoutineSeed = {
        id: 8,
        programId: MockWorkoutPrograms.UPPER_LOWER_TAWAN_003.id,
        name: 'Upper B',
        orderInProgram: 2,
    };

    static readonly TAWAN_LOWER_A_009: WorkoutRoutineSeed = {
        id: 9,
        programId: MockWorkoutPrograms.UPPER_LOWER_TAWAN_003.id,
        name: 'Lower A',
        orderInProgram: 3,
    };

    static readonly TAWAN_LOWER_B_010: WorkoutRoutineSeed = {
        id: 10,
        programId: MockWorkoutPrograms.UPPER_LOWER_TAWAN_003.id,
        name: 'Lower B',
        orderInProgram: 4,
    };

    // --- Nuch Full Body (program 4) — 3 routines ---
    static readonly NUCH_FULL_A_011: WorkoutRoutineSeed = {
        id: 11,
        programId: MockWorkoutPrograms.FULL_BODY_NUCH_004.id,
        name: 'Full Body A',
        orderInProgram: 1,
    };

    static readonly NUCH_FULL_B_012: WorkoutRoutineSeed = {
        id: 12,
        programId: MockWorkoutPrograms.FULL_BODY_NUCH_004.id,
        name: 'Full Body B',
        orderInProgram: 2,
    };

    static readonly NUCH_FULL_C_013: WorkoutRoutineSeed = {
        id: 13,
        programId: MockWorkoutPrograms.FULL_BODY_NUCH_004.id,
        name: 'Full Body C',
        orderInProgram: 3,
    };

    static readonly WorkoutDayDefinitions = [
        this.DAY_PUSH_001,
        this.DAY_PULL_002,
        this.DAY_LEGS_003,
        this.ARISA_PUSH_004,
        this.ARISA_PULL_005,
        this.ARISA_LEGS_006,
        this.TAWAN_UPPER_A_007,
        this.TAWAN_UPPER_B_008,
        this.TAWAN_LOWER_A_009,
        this.TAWAN_LOWER_B_010,
        this.NUCH_FULL_A_011,
        this.NUCH_FULL_B_012,
        this.NUCH_FULL_C_013,
    ]
}

export default class MockWorkoutRoutineSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutRoutineEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutRoutines.WorkoutDayDefinitions);
    }
}
