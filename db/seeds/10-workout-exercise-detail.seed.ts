import { WorkoutExerciseEntity } from "src/workout/entities/workout-exercise.entity";
import { MockWorkoutRoutines } from "./09-workout-routine.seed";
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";

type WorkoutExerciseSeed = Omit<WorkoutExerciseEntity, 'createdAt' | 'updatedAt' | 'description' | 'workoutRoutine' | 'setDetails'>;

export class MockWorkoutExerciseDetails {

    static readonly EXERCISE_001_BENCH_PRESS: WorkoutExerciseSeed = {
        id: 1,
        routineId: MockWorkoutRoutines.DAY_PUSH_001.id,
        name: 'Barbell Bench Press',
        imageUrl: 'http://example.com/images/bench_press.jpg',
        orderInRoutine: 1,
    };

    static readonly EXERCISE_002_SHOULDER_PRESS: WorkoutExerciseSeed = {
        id: 2,
        routineId: MockWorkoutRoutines.DAY_PUSH_001.id,
        name: 'Dumbbell Overhead Press',
        imageUrl: 'http://example.com/images/ohp.jpg',
        orderInRoutine: 2,
    };

    // --- Pull Day Exercises (routine 2) ---
    static readonly EXERCISE_003_DEADLIFT: WorkoutExerciseSeed = {
        id: 3,
        routineId: MockWorkoutRoutines.DAY_PULL_002.id,
        name: 'Conventional Deadlift',
        imageUrl: 'http://example.com/images/deadlift.jpg',
        orderInRoutine: 3,
    };

    // --- Latif Leg Day (routine 3) ---
    static readonly EXERCISE_004_SQUAT: WorkoutExerciseSeed = {
        id: 4,
        routineId: MockWorkoutRoutines.DAY_LEGS_003.id,
        name: 'Barbell Squat',
        imageUrl: null,
        orderInRoutine: 1,
    };

    // --- Arisa Push Day (routine 4) ---
    static readonly EXERCISE_005_INCLINE_BENCH: WorkoutExerciseSeed = {
        id: 5,
        routineId: MockWorkoutRoutines.ARISA_PUSH_004.id,
        name: 'Incline Bench Press',
        imageUrl: null,
        orderInRoutine: 1,
    };

    // --- Arisa Pull Day (routine 5) ---
    static readonly EXERCISE_006_LAT_PULLDOWN: WorkoutExerciseSeed = {
        id: 6,
        routineId: MockWorkoutRoutines.ARISA_PULL_005.id,
        name: 'Lat Pulldown',
        imageUrl: null,
        orderInRoutine: 1,
    };

    // --- Arisa Leg Day (routine 6) ---
    static readonly EXERCISE_007_LEG_PRESS: WorkoutExerciseSeed = {
        id: 7,
        routineId: MockWorkoutRoutines.ARISA_LEGS_006.id,
        name: 'Leg Press',
        imageUrl: null,
        orderInRoutine: 1,
    };

    // --- Tawan Upper A (routine 7) ---
    static readonly EXERCISE_008_BENCH_PRESS_TAWAN: WorkoutExerciseSeed = {
        id: 8,
        routineId: MockWorkoutRoutines.TAWAN_UPPER_A_007.id,
        name: 'Barbell Bench Press',
        imageUrl: null,
        orderInRoutine: 1,
    };

    // --- Tawan Upper B (routine 8) ---
    static readonly EXERCISE_009_SEATED_OHP: WorkoutExerciseSeed = {
        id: 9,
        routineId: MockWorkoutRoutines.TAWAN_UPPER_B_008.id,
        name: 'Seated Overhead Press',
        imageUrl: null,
        orderInRoutine: 1,
    };

    // --- Nuch Full Body A (routine 11) ---
    static readonly EXERCISE_010_GOBLET_SQUAT: WorkoutExerciseSeed = {
        id: 10,
        routineId: MockWorkoutRoutines.NUCH_FULL_A_011.id,
        name: 'Goblet Squat',
        imageUrl: null,
        orderInRoutine: 1,
    };

    static readonly WorkoutExerciseDetails = [
        this.EXERCISE_001_BENCH_PRESS,
        this.EXERCISE_002_SHOULDER_PRESS,
        this.EXERCISE_003_DEADLIFT,
        this.EXERCISE_004_SQUAT,
        this.EXERCISE_005_INCLINE_BENCH,
        this.EXERCISE_006_LAT_PULLDOWN,
        this.EXERCISE_007_LEG_PRESS,
        this.EXERCISE_008_BENCH_PRESS_TAWAN,
        this.EXERCISE_009_SEATED_OHP,
        this.EXERCISE_010_GOBLET_SQUAT,
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
