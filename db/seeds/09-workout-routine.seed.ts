import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";;
import { WorkoutRoutineEntity } from "src/workout/entities/workout-routine.entity";
import { MockWorkoutPrograms } from "./08-workout-program.seed";

type WorkoutRoutineSeed = Omit<WorkoutRoutineEntity, 'createdAt' | 'updatedAt' | 'workoutProgram'>;

export class MockWorkoutRoutines {
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

    static readonly WorkoutDayDefinitions = [
        this.DAY_PUSH_001,
        this.DAY_PULL_002,
        this.DAY_LEGS_003,
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