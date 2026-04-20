
import { Seeder } from "typeorm-extension";
import { DataSource } from "typeorm";
import { WorkoutExerciseTemplateEntity } from "src/workout/entities/workout-exercise-template.entity";

type WorkoutExerciseTemplateSeed = Omit<WorkoutExerciseTemplateEntity, 'createdAt' | 'updatedAt'>;

export class MockWorkoutExerciseTemplates {

    static readonly T_EXERCISE_001_BENCH_PRESS: WorkoutExerciseTemplateSeed = {
        id: 1,
        name: 'Barbell Bench Press',
        imageUrl: 'http://example.com/images/bench_press.jpg',
    };

    static readonly T_EXERCISE_002_INCLINE_DB: WorkoutExerciseTemplateSeed = {
        id: 2,
        name: 'Incline Dumbbell Press',
        imageUrl: 'http://example.com/images/incline_db.jpg',
    };

    static readonly T_EXERCISE_003_LATERAL_RAISE: WorkoutExerciseTemplateSeed = {
        id: 3,
        name: 'Dumbbell Lateral Raise',
        imageUrl: 'http://example.com/images/lateral_raise.jpg',
    };

    static readonly T_EXERCISE_004_PULLUPS: WorkoutExerciseTemplateSeed = {
        id: 4,
        name: 'Weighted Pull-Ups (or Lat Pulldowns)',
        imageUrl: 'http://example.com/images/pullups.jpg',
    };

    static readonly T_EXERCISE_005_ROWS: WorkoutExerciseTemplateSeed = {
        id: 5,
        name: 'T-Bar/Barbell Row',
        imageUrl: 'http://example.com/images/t_bar_row.jpg',
    };

    static readonly T_EXERCISE_006_FACE_PULL: WorkoutExerciseTemplateSeed = {
        id: 6,
        name: 'Face Pulls',
        imageUrl: 'http://example.com/images/face_pull.jpg',
    };

    static readonly T_EXERCISE_007_SQUAT: WorkoutExerciseTemplateSeed = {
        id: 7,
        name: 'Barbell Back Squat',
        imageUrl: 'http://example.com/images/squat.jpg',
    };

    static readonly T_EXERCISE_008_RDL: WorkoutExerciseTemplateSeed = {
        id: 8,
        name: 'Romanian Deadlift (RDL)',
        imageUrl: 'http://example.com/images/rdl.jpg',
    };

    static readonly T_EXERCISE_009_HACK_SQUAT: WorkoutExerciseTemplateSeed = {
        id: 9,
        name: 'Hack Squat',
        imageUrl: 'http://example.com/images/hack_squat.jpg',
    };

    static readonly T_EXERCISE_010_LEG_CURL: WorkoutExerciseTemplateSeed = {
        id: 10,
        name: 'Seated Leg Curl',
        imageUrl: 'http://example.com/images/leg_curl.jpg',
    };

    static readonly T_EXERCISE_011_CABLE_CRUNCH: WorkoutExerciseTemplateSeed = {
        id: 11,
        name: 'Cable Crunch (Abs)',
        imageUrl: 'http://example.com/images/cable_crunch.jpg',
    };

    static readonly T_EXERCISE_012_BICEP_CURL: WorkoutExerciseTemplateSeed = {
        id: 12,
        name: 'Standing Dumbbell Bicep Curl',
        imageUrl: 'http://example.com/images/db_bicep_curl.jpg',
    };

    static readonly T_EXERCISE_013_TRICEP_EXTENSION: WorkoutExerciseTemplateSeed = {
        id: 13,
        name: 'Overhead Dumbbell Tricep Extension',
        imageUrl: 'http://example.com/images/overhead_tricep_extension.jpg',
    };

    static readonly T_EXERCISE_014_CALF_RAISE: WorkoutExerciseTemplateSeed = {
        id: 14,
        name: 'Standing Calf Raise',
        imageUrl: 'http://example.com/images/calf_raise.jpg',
    };

    static readonly T_EXERCISE_015_LAT_PULLOVER: WorkoutExerciseTemplateSeed = {
        id: 15,
        name: 'Dumbbell Pullover',
        imageUrl: 'http://example.com/images/db_pullover.jpg',
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
