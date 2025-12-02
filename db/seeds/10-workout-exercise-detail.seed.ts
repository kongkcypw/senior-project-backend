import { WorkoutExerciseDetailEntity } from "src/workout/entities/workout-exercise-detail.entity";
import { MockWorkoutDayDefinitions } from "./09-workout-day-definition.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

type WorkoutExerciseDetailSeed = Omit<WorkoutExerciseDetailEntity, 'createdAt' | 'updatedAt' | 'workoutDayDefinition'>;

export class MockWorkoutExerciseDetails {

    static readonly EXERCISE_001_BENCH_PRESS: WorkoutExerciseDetailSeed = {
        id: 1,
        workoutDayDefinitionId: MockWorkoutDayDefinitions.DAY_PUSH_001.id,
        exerciseName: 'Barbell Bench Press',
        reps: '8-12',
        sets: 3,
        prescribedWeightKg: null, // Let the trainee determine weight
        restTimeSeconds: 120,
        imageUrl: 'http://example.com/images/bench_press.jpg',
        orderInDay: 1,
    };

    static readonly EXERCISE_002_SHOULDER_PRESS: WorkoutExerciseDetailSeed = {
        id: 2,
        workoutDayDefinitionId: MockWorkoutDayDefinitions.DAY_PUSH_001.id,
        exerciseName: 'Dumbbell Overhead Press',
        reps: '10',
        sets: 3,
        prescribedWeightKg: null,
        restTimeSeconds: 90,
        imageUrl: 'http://example.com/images/ohp.jpg',
        orderInDay: 2,
    };

    // --- Pull Day Exercises (ID 2) ---
    static readonly EXERCISE_003_DEADLIFT: WorkoutExerciseDetailSeed = {
        id: 3,
        workoutDayDefinitionId: MockWorkoutDayDefinitions.DAY_PULL_002.id,
        exerciseName: 'Conventional Deadlift',
        reps: '5',
        sets: 3,
        prescribedWeightKg: null,
        restTimeSeconds: 180,
        imageUrl: 'http://example.com/images/deadlift.jpg',
        orderInDay: 1,
    };

    static readonly WorkoutExerciseDetails = [
        this.EXERCISE_001_BENCH_PRESS,
        this.EXERCISE_002_SHOULDER_PRESS,
        this.EXERCISE_003_DEADLIFT,
    ]
}

export default class MockWorkoutExerciseDetailSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutExerciseDetailEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutExerciseDetails.WorkoutExerciseDetails);
    }
}