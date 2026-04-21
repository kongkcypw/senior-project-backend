import { WorkoutHistoryEntity } from "src/workout/entities/workout-history.entity";
import { WorkoutHistoryExerciseEntity } from "src/workout/entities/workout-history-exercise.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";
import { MockWorkoutRoutines } from "./09-workout-routine.seed";
import { MockWorkoutExerciseDetails } from "./10-workout-exercise-detail.seed";

type SessionSeed = Omit<WorkoutHistoryEntity, 'createdAt' | 'updatedAt' | 'user' | 'workoutRoutine' | 'exerciseLogs'>;
type ExerciseSeed = Omit<WorkoutHistoryExerciseEntity, 'createdAt' | 'updatedAt' | 'workoutHistoryRoutine' | 'workoutExercise'>;

function at(year: number, month: number, date: number, hour = 9, minute = 0): Date {
    return new Date(year, month - 1, date, hour, minute, 0);
}

// All dates relative to today: 2026-04-18 (Friday)
// Daily window  : Apr 18
// Weekly window : Apr 14 (Mon) – Apr 20 (Sun)
// Monthly window: Apr 1 – Apr 30

// ── Sessions (workout_history_routine) ──────────────────────────────────────

export const SESSIONS: SessionSeed[] = [
    // Latif Danai
    { id: 1,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, startedAt: at(2026, 4, 1),  finishedAt: at(2026, 4, 1,  9, 10) },
    { id: 2,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, startedAt: at(2026, 4, 5),  finishedAt: at(2026, 4, 5,  9, 10) },
    { id: 3,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, startedAt: at(2026, 4, 14), finishedAt: at(2026, 4, 14, 9, 10) }, // this week
    { id: 4,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, startedAt: at(2026, 4, 16), finishedAt: at(2026, 4, 16, 9, 10) }, // this week
    { id: 5,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_LEGS_003.id, startedAt: at(2026, 4, 18), finishedAt: at(2026, 4, 18, 9, 10) }, // this week, today
    // Arisa Natcha
    { id: 6,  lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, startedAt: at(2026, 4, 4),  finishedAt: at(2026, 4, 4,  9, 15) },
    { id: 7,  lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, startedAt: at(2026, 4, 8),  finishedAt: at(2026, 4, 8,  9, 10) },
    { id: 8,  lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, startedAt: at(2026, 4, 14), finishedAt: at(2026, 4, 14, 9, 15) }, // this week
    { id: 9,  lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, startedAt: at(2026, 4, 16), finishedAt: at(2026, 4, 16, 9, 10) }, // this week
    { id: 10, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_LEGS_006.id, startedAt: at(2026, 4, 18), finishedAt: at(2026, 4, 18, 9, 15) }, // this week, today
    // Tawan Kraiwit
    { id: 11, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_A_007.id, startedAt: at(2026, 4, 16), finishedAt: at(2026, 4, 16, 9, 10) }, // this week
    { id: 12, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_B_008.id, startedAt: at(2026, 4, 18), finishedAt: at(2026, 4, 18, 9, 10) }, // this week, today
    // Nuch Piyanat
    { id: 13, lineUserId: MockUsers.TRAINEE_USER_006.lineUserId, routineId: MockWorkoutRoutines.NUCH_FULL_A_011.id,  startedAt: at(2026, 4, 18), finishedAt: at(2026, 4, 18, 9, 10) }, // today
];

// ── Exercise sets (workout_history_exercise) ─────────────────────────────────

let nextExId = 1;
const eid = () => nextExId++;

export const EXERCISE_LOGS: ExerciseSeed[] = [
    // Session 1 – Latif Apr 1 Push
    { id: eid(), workoutHistoryRoutineId: 1, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, setNumber: 1, rep: 10, weightKg: 60,  notes: null },
    { id: eid(), workoutHistoryRoutineId: 1, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, setNumber: 2, rep: 8,  weightKg: 65,  notes: null },
    // Session 2 – Latif Apr 5 Pull
    { id: eid(), workoutHistoryRoutineId: 2, exerciseId: MockWorkoutExerciseDetails.EXERCISE_003_DEADLIFT.id,    setNumber: 1, rep: 8,  weightKg: 100, notes: null },
    { id: eid(), workoutHistoryRoutineId: 2, exerciseId: MockWorkoutExerciseDetails.EXERCISE_003_DEADLIFT.id,    setNumber: 2, rep: 6,  weightKg: 110, notes: null },
    // Session 3 – Latif Apr 14 Push (this week)
    { id: eid(), workoutHistoryRoutineId: 3, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, setNumber: 1, rep: 10, weightKg: 60,  notes: null },
    { id: eid(), workoutHistoryRoutineId: 3, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, setNumber: 2, rep: 9,  weightKg: 62,  notes: null },
    // Session 4 – Latif Apr 16 Pull (this week)
    { id: eid(), workoutHistoryRoutineId: 4, exerciseId: MockWorkoutExerciseDetails.EXERCISE_003_DEADLIFT.id,    setNumber: 1, rep: 8,  weightKg: 100, notes: null },
    // Session 5 – Latif Apr 18 Legs (today)
    { id: eid(), workoutHistoryRoutineId: 5, exerciseId: MockWorkoutExerciseDetails.EXERCISE_004_SQUAT.id,       setNumber: 1, rep: 12, weightKg: 80,  notes: null },
    { id: eid(), workoutHistoryRoutineId: 5, exerciseId: MockWorkoutExerciseDetails.EXERCISE_004_SQUAT.id,       setNumber: 2, rep: 10, weightKg: 85,  notes: null },
    // Session 6 – Arisa Apr 4 Push
    { id: eid(), workoutHistoryRoutineId: 6, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 1, rep: 12, weightKg: 40, notes: null },
    { id: eid(), workoutHistoryRoutineId: 6, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 2, rep: 10, weightKg: 42, notes: null },
    { id: eid(), workoutHistoryRoutineId: 6, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 3, rep: 10, weightKg: 42, notes: null },
    // Session 7 – Arisa Apr 8 Pull
    { id: eid(), workoutHistoryRoutineId: 7, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,  setNumber: 1, rep: 10, weightKg: 50, notes: null },
    { id: eid(), workoutHistoryRoutineId: 7, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,  setNumber: 2, rep: 8,  weightKg: 55, notes: null },
    // Session 8 – Arisa Apr 14 Push (this week)
    { id: eid(), workoutHistoryRoutineId: 8, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 1, rep: 12, weightKg: 42, notes: null },
    { id: eid(), workoutHistoryRoutineId: 8, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 2, rep: 10, weightKg: 45, notes: null },
    { id: eid(), workoutHistoryRoutineId: 8, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 3, rep: 10, weightKg: 45, notes: null },
    // Session 9 – Arisa Apr 16 Pull (this week)
    { id: eid(), workoutHistoryRoutineId: 9, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,  setNumber: 1, rep: 10, weightKg: 52, notes: null },
    { id: eid(), workoutHistoryRoutineId: 9, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,  setNumber: 2, rep: 8,  weightKg: 57, notes: null },
    // Session 10 – Arisa Apr 18 Legs (today)
    { id: eid(), workoutHistoryRoutineId: 10, exerciseId: MockWorkoutExerciseDetails.EXERCISE_007_LEG_PRESS.id,   setNumber: 1, rep: 15, weightKg: 60, notes: null },
    { id: eid(), workoutHistoryRoutineId: 10, exerciseId: MockWorkoutExerciseDetails.EXERCISE_007_LEG_PRESS.id,   setNumber: 2, rep: 12, weightKg: 65, notes: null },
    { id: eid(), workoutHistoryRoutineId: 10, exerciseId: MockWorkoutExerciseDetails.EXERCISE_007_LEG_PRESS.id,   setNumber: 3, rep: 10, weightKg: 70, notes: null },
    // Session 11 – Tawan Apr 16 Upper A (this week)
    { id: eid(), workoutHistoryRoutineId: 11, exerciseId: MockWorkoutExerciseDetails.EXERCISE_008_BENCH_PRESS_TAWAN.id, setNumber: 1, rep: 10, weightKg: 55, notes: null },
    { id: eid(), workoutHistoryRoutineId: 11, exerciseId: MockWorkoutExerciseDetails.EXERCISE_008_BENCH_PRESS_TAWAN.id, setNumber: 2, rep: 8,  weightKg: 60, notes: null },
    // Session 12 – Tawan Apr 18 Upper B (today)
    { id: eid(), workoutHistoryRoutineId: 12, exerciseId: MockWorkoutExerciseDetails.EXERCISE_009_SEATED_OHP.id,  setNumber: 1, rep: 10, weightKg: 50, notes: null },
    { id: eid(), workoutHistoryRoutineId: 12, exerciseId: MockWorkoutExerciseDetails.EXERCISE_009_SEATED_OHP.id,  setNumber: 2, rep: 8,  weightKg: 55, notes: null },
    // Session 13 – Nuch Apr 18 Full A (today)
    { id: eid(), workoutHistoryRoutineId: 13, exerciseId: MockWorkoutExerciseDetails.EXERCISE_010_GOBLET_SQUAT.id, setNumber: 1, rep: 10, weightKg: 30, notes: 'First session' },
];

export default class MockWorkoutHistorySeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const sessionRepo  = dataSource.getRepository(WorkoutHistoryEntity);
        const exerciseRepo = dataSource.getRepository(WorkoutHistoryExerciseEntity);

        await exerciseRepo.query(`TRUNCATE "${exerciseRepo.metadata.tableName}" RESTART IDENTITY CASCADE;`);
        await sessionRepo.query(`TRUNCATE "${sessionRepo.metadata.tableName}" RESTART IDENTITY CASCADE;`);

        await sessionRepo.save(SESSIONS);
        await exerciseRepo.save(EXERCISE_LOGS);
    }
}
