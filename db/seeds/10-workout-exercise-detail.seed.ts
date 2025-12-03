import { WorkoutExerciseEntity } from "src/workout/entities/workout-exercise.entity";
import { MockWorkoutRoutines } from "./09-workout-routine.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

type WorkoutExerciseSeed = Omit<WorkoutExerciseEntity, 'createdAt' | 'updatedAt' | 'workoutRoutine'>;

export class MockWorkoutExerciseDetails {

    static readonly EXERCISE_001_BENCH_PRESS: WorkoutExerciseSeed = {
        id: 1,
        routineId: MockWorkoutRoutines.DAY_PUSH_001.id,
        name: 'Barbell Bench Press',
        rep: 8,
        set: 3,
        weightKg: null, // Let the trainee determine weight
        restTimeSecond: 120,
        imageUrl: 'http://example.com/images/bench_press.jpg',
        orderInRoutine: 1,
    };

    static readonly EXERCISE_002_SHOULDER_PRESS: WorkoutExerciseSeed = {
        id: 2,
        routineId: MockWorkoutRoutines.DAY_PUSH_001.id,
        name: 'Dumbbell Overhead Press',
        rep: 10,
        set: 3,
        weightKg: null,
        restTimeSecond: 90,
        imageUrl: 'http://example.com/images/ohp.jpg',
        orderInRoutine: 2,
    };

    // --- Pull Day Exercises (ID 2) ---
    static readonly EXERCISE_003_DEADLIFT: WorkoutExerciseSeed = {
        id: 3,
        routineId: MockWorkoutRoutines.DAY_PULL_002.id,
        name: 'Conventional Deadlift',
        rep: 5,
        set: 3,
        weightKg: null,
        restTimeSecond: 180,
        imageUrl: 'http://example.com/images/deadlift.jpg',
        orderInRoutine: 3,
    };

    static readonly WorkoutExerciseDetails = [
        this.EXERCISE_001_BENCH_PRESS,
        this.EXERCISE_002_SHOULDER_PRESS,
        this.EXERCISE_003_DEADLIFT,
    ]
}

export default class MockWorkoutExerciseDetailSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutExerciseEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutExerciseDetails.WorkoutExerciseDetails);
    }
}