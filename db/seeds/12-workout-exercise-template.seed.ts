
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { WorkoutExerciseTemplateEntity } from "src/workout/entities/workout-exercise-template.entity";
import { MockWorkoutRoutineTemplates } from "./11-workout-routine-template.seed";

type WorkoutExerciseTemplateSeed = Omit<WorkoutExerciseTemplateEntity, 'createdAt' | 'updatedAt' | 'workoutRoutineTemplate'>;

export class MockWorkoutExerciseTemplates {

    // --- Routine-Specific Exercises (PPL - Push Day) ---
    static readonly T_EXERCISE_001_BENCH_PRESS: WorkoutExerciseTemplateSeed = {
        id: 1,
        routineTemplateId: MockWorkoutRoutineTemplates.TEMPLATE_PUSH_001.id,
        name: 'Barbell Bench Press',
        rep: 6,
        set: 4,
        weightKg: null,
        restTimeSecond: 120,
        imageUrl: 'http://example.com/images/bench_press.jpg',
        orderInRoutine: 1,
    };

    static readonly T_EXERCISE_002_INCLINE_DB: WorkoutExerciseTemplateSeed = {
        id: 2,
        routineTemplateId: MockWorkoutRoutineTemplates.TEMPLATE_PUSH_001.id,
        name: 'Incline Dumbbell Press',
        rep: 10,
        set: 3,
        weightKg: null,
        restTimeSecond: 90,
        imageUrl: 'http://example.com/images/incline_db.jpg',
        orderInRoutine: 2,
    };

    static readonly T_EXERCISE_003_LATERAL_RAISE: WorkoutExerciseTemplateSeed = {
        id: 3,
        routineTemplateId: MockWorkoutRoutineTemplates.TEMPLATE_PUSH_001.id,
        name: 'Dumbbell Lateral Raise',
        rep: 15,
        set: 4,
        weightKg: null,
        restTimeSecond: 60,
        imageUrl: 'http://example.com/images/lateral_raise.jpg',
        orderInRoutine: 3,
    };

    // --- Routine-Specific Exercises (PPL - Pull Day) ---
    static readonly T_EXERCISE_004_PULLUPS: WorkoutExerciseTemplateSeed = {
        id: 4,
        routineTemplateId: MockWorkoutRoutineTemplates.TEMPLATE_PULL_002.id,
        name: 'Weighted Pull-Ups (or Lat Pulldowns)',
        rep: 8,
        set: 4,
        weightKg: null,
        restTimeSecond: 120,
        imageUrl: 'http://example.com/images/pullups.jpg',
        orderInRoutine: 1,
    };

    static readonly T_EXERCISE_005_ROWS: WorkoutExerciseTemplateSeed = {
        id: 5,
        routineTemplateId: MockWorkoutRoutineTemplates.TEMPLATE_PULL_002.id,
        name: 'T-Bar/Barbell Row',
        rep: 8,
        set: 3,
        weightKg: null,
        restTimeSecond: 90,
        imageUrl: 'http://example.com/images/t_bar_row.jpg',
        orderInRoutine: 2,
    };

    static readonly T_EXERCISE_006_FACE_PULL: WorkoutExerciseTemplateSeed = {
        id: 6,
        routineTemplateId: MockWorkoutRoutineTemplates.TEMPLATE_PULL_002.id,
        name: 'Face Pulls',
        rep: 15,
        set: 3,
        weightKg: null,
        restTimeSecond: 60,
        imageUrl: 'http://example.com/images/face_pull.jpg',
        orderInRoutine: 3,
    };

    // --- Routine-Specific Exercises (PPL - Legs Day) ---
    static readonly T_EXERCISE_007_SQUAT: WorkoutExerciseTemplateSeed = {
        id: 7,
        routineTemplateId: MockWorkoutRoutineTemplates.TEMPLATE_LEGS_003.id,
        name: 'Barbell Back Squat',
        rep: 5,
        set: 4,
        weightKg: null,
        restTimeSecond: 180,
        imageUrl: 'http://example.com/images/squat.jpg',
        orderInRoutine: 1,
    };

    static readonly T_EXERCISE_008_RDL: WorkoutExerciseTemplateSeed = {
        id: 8,
        routineTemplateId: MockWorkoutRoutineTemplates.TEMPLATE_LEGS_003.id,
        name: 'Romanian Deadlift (RDL)',
        rep: 10,
        set: 3,
        weightKg: null,
        restTimeSecond: 90,
        imageUrl: 'http://example.com/images/rdl.jpg',
        orderInRoutine: 2,
    };

    // --- Standalone Exercises (Existing Library) ---
    static readonly T_EXERCISE_009_HACK_SQUAT: WorkoutExerciseTemplateSeed = {
        id: 9,
        routineTemplateId: null, // STANDALONE
        name: 'Hack Squat',
        rep: 12,
        set: 3,
        weightKg: null,
        restTimeSecond: 90,
        imageUrl: 'http://example.com/images/hack_squat.jpg',
        orderInRoutine: null,
    };

    static readonly T_EXERCISE_010_LEG_CURL: WorkoutExerciseTemplateSeed = {
        id: 10,
        routineTemplateId: null, // STANDALONE
        name: 'Seated Leg Curl',
        rep: 15,
        set: 3,
        weightKg: null,
        restTimeSecond: 60,
        imageUrl: 'http://example.com/images/leg_curl.jpg',
        orderInRoutine: null,
    };


    static readonly T_EXERCISE_011_CABLE_CRUNCH: WorkoutExerciseTemplateSeed = {
        id: 11,
        routineTemplateId: null, // STANDALONE
        name: 'Cable Crunch (Abs)',
        rep: 15,
        set: 4,
        weightKg: null,
        restTimeSecond: 60,
        imageUrl: 'http://example.com/images/cable_crunch.jpg',
        orderInRoutine: null,
    };

    static readonly T_EXERCISE_012_BICEP_CURL: WorkoutExerciseTemplateSeed = {
        id: 12,
        routineTemplateId: null, // STANDALONE
        name: 'Standing Dumbbell Bicep Curl',
        rep: 10,
        set: 3,
        weightKg: null,
        restTimeSecond: 75,
        imageUrl: 'http://example.com/images/db_bicep_curl.jpg',
        orderInRoutine: null,
    };

    static readonly T_EXERCISE_013_TRICEP_EXTENSION: WorkoutExerciseTemplateSeed = {
        id: 13,
        routineTemplateId: null, // STANDALONE
        name: 'Overhead Dumbbell Tricep Extension',
        rep: 12,
        set: 3,
        weightKg: null,
        restTimeSecond: 75,
        imageUrl: 'http://example.com/images/overhead_tricep_extension.jpg',
        orderInRoutine: null,
    };

    static readonly T_EXERCISE_014_CALF_RAISE: WorkoutExerciseTemplateSeed = {
        id: 14,
        routineTemplateId: null, // STANDALONE
        name: 'Standing Calf Raise',
        rep: 20,
        set: 4,
        weightKg: null,
        restTimeSecond: 60,
        imageUrl: 'http://example.com/images/calf_raise.jpg',
        orderInRoutine: null,
    };

    static readonly T_EXERCISE_015_LAT_PULLOVER: WorkoutExerciseTemplateSeed = {
        id: 15,
        routineTemplateId: null, // STANDALONE
        name: 'Dumbbell Pullover',
        rep: 12,
        set: 3,
        weightKg: null,
        restTimeSecond: 90,
        imageUrl: 'http://example.com/images/db_pullover.jpg',
        orderInRoutine: null,
    };

    static readonly WorkoutExerciseTemplates = [
        this.T_EXERCISE_001_BENCH_PRESS,
        this.T_EXERCISE_002_INCLINE_DB,
        this.T_EXERCISE_003_LATERAL_RAISE,
        this.T_EXERCISE_004_PULLUPS,
        this.T_EXERCISE_005_ROWS,
        this.T_EXERCISE_006_FACE_PULL,
        this.T_EXERCISE_007_SQUAT,
        this.T_EXERCISE_008_RDL,
        // --- Standalone Exercises (Existing Library) ---
        this.T_EXERCISE_009_HACK_SQUAT,
        this.T_EXERCISE_010_LEG_CURL,
        this.T_EXERCISE_011_CABLE_CRUNCH,
        this.T_EXERCISE_012_BICEP_CURL,
        this.T_EXERCISE_013_TRICEP_EXTENSION,
        this.T_EXERCISE_014_CALF_RAISE,
        this.T_EXERCISE_015_LAT_PULLOVER,
    ]
}

export default class MockWorkoutExerciseTemplateSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutExerciseTemplateEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutExerciseTemplates.WorkoutExerciseTemplates);
    }
}