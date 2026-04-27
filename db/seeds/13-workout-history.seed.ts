import { WorkoutHistoryEntity } from "src/workout/entities/workout-history.entity";
import { WorkoutHistoryExerciseEntity } from "src/workout/entities/workout-history-exercise.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";
import { MockWorkoutRoutines } from "./09-workout-routine.seed";
import { MockWorkoutExerciseDetails } from "./10-workout-exercise-detail.seed";
import { monthDay, weekDay } from "./utils/relative-date.util";

type SessionSeed = Omit<WorkoutHistoryEntity, 'createdAt' | 'updatedAt' | 'user' | 'workoutRoutine' | 'exerciseLogs'>;
type ExerciseSeed = Omit<WorkoutHistoryExerciseEntity, 'createdAt' | 'updatedAt' | 'workoutHistoryRoutine' | 'workoutExercise'>;

// Sessions land on specific weekdays of the current ISO week (Mon–Sun) and
// fixed dates of the current month, computed at runtime. This guarantees
// varied weekly scores regardless of which day the seed is run; some sessions
// may be "future-dated" relative to today (intentional demo data).
//
// Target weekly workout days per trainee:
//   Latif  : 3 (Mon Push / Wed Pull / Fri Legs) → 3/3 routines = 50
//   Arisa  : 3 (Mon Push / Wed Pull / Fri Legs) → 3/3 routines = 50
//   Tawan  : 1 distinct day (Wed twice)         → 1/4 routines = 12.5
//   Nuch   : 1 (Wed)                            → 1/3 routines = 16.7

// ── Sessions (workout_history_routine) ──────────────────────────────────────

export const SESSIONS: SessionSeed[] = [
    // Latif Danai — 2 earlier-this-month + 3 this-week
    { id: 1,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, startedAt: monthDay(0, 1, 9),       finishedAt: monthDay(0, 1, 9, 10) },
    { id: 2,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, startedAt: monthDay(0, 5, 9),       finishedAt: monthDay(0, 5, 9, 10) },
    { id: 3,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, startedAt: weekDay(0, 'MON', 9),    finishedAt: weekDay(0, 'MON', 9, 10) },
    { id: 4,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, startedAt: weekDay(0, 'WED', 9),    finishedAt: weekDay(0, 'WED', 9, 10) },
    { id: 5,  lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_LEGS_003.id, startedAt: weekDay(0, 'FRI', 9),    finishedAt: weekDay(0, 'FRI', 9, 10) },
    // Arisa Natcha — 2 earlier-this-month + 3 this-week
    { id: 6,  lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, startedAt: monthDay(0, 4, 9),     finishedAt: monthDay(0, 4, 9, 15) },
    { id: 7,  lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, startedAt: monthDay(0, 8, 9),     finishedAt: monthDay(0, 8, 9, 10) },
    { id: 8,  lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, startedAt: weekDay(0, 'MON', 9),  finishedAt: weekDay(0, 'MON', 9, 15) },
    { id: 9,  lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, startedAt: weekDay(0, 'WED', 9),  finishedAt: weekDay(0, 'WED', 9, 10) },
    { id: 10, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_LEGS_006.id, startedAt: weekDay(0, 'FRI', 9),  finishedAt: weekDay(0, 'FRI', 9, 15) },
    // Tawan Kraiwit — 2 sessions on the same day (Wed) so distinct days = 1
    { id: 11, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_A_007.id, startedAt: weekDay(0, 'WED', 9),  finishedAt: weekDay(0, 'WED', 9, 10) },
    { id: 12, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_B_008.id, startedAt: weekDay(0, 'WED', 17), finishedAt: weekDay(0, 'WED', 17, 10) },
    // Nuch Piyanat — 1 session on Wed
    { id: 13, lineUserId: MockUsers.TRAINEE_USER_006.lineUserId, routineId: MockWorkoutRoutines.NUCH_FULL_A_011.id,  startedAt: weekDay(0, 'WED', 9),    finishedAt: weekDay(0, 'WED', 9, 10) },
];

// ── Exercise sets (workout_history_exercise) ─────────────────────────────────

let nextExId = 1;
const eid = () => nextExId++;

export const EXERCISE_LOGS: ExerciseSeed[] = [
    // Session 1 – Latif (this month)
    { id: eid(), workoutHistoryRoutineId: 1, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, setNumber: 1, rep: 10, weightKg: 60,  notes: null },
    { id: eid(), workoutHistoryRoutineId: 1, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, setNumber: 2, rep: 8,  weightKg: 65,  notes: null },
    // Session 2 – Latif (this month)
    { id: eid(), workoutHistoryRoutineId: 2, exerciseId: MockWorkoutExerciseDetails.EXERCISE_003_DEADLIFT.id,    setNumber: 1, rep: 8,  weightKg: 100, notes: null },
    { id: eid(), workoutHistoryRoutineId: 2, exerciseId: MockWorkoutExerciseDetails.EXERCISE_003_DEADLIFT.id,    setNumber: 2, rep: 6,  weightKg: 110, notes: null },
    // Session 3 – Latif (Mon)
    { id: eid(), workoutHistoryRoutineId: 3, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, setNumber: 1, rep: 10, weightKg: 60,  notes: null },
    { id: eid(), workoutHistoryRoutineId: 3, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, setNumber: 2, rep: 9,  weightKg: 62,  notes: null },
    // Session 4 – Latif (Wed)
    { id: eid(), workoutHistoryRoutineId: 4, exerciseId: MockWorkoutExerciseDetails.EXERCISE_003_DEADLIFT.id,    setNumber: 1, rep: 8,  weightKg: 100, notes: null },
    // Session 5 – Latif (Fri)
    { id: eid(), workoutHistoryRoutineId: 5, exerciseId: MockWorkoutExerciseDetails.EXERCISE_004_SQUAT.id,       setNumber: 1, rep: 12, weightKg: 80,  notes: null },
    { id: eid(), workoutHistoryRoutineId: 5, exerciseId: MockWorkoutExerciseDetails.EXERCISE_004_SQUAT.id,       setNumber: 2, rep: 10, weightKg: 85,  notes: null },
    // Session 6 – Arisa (this month)
    { id: eid(), workoutHistoryRoutineId: 6, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 1, rep: 12, weightKg: 40, notes: null },
    { id: eid(), workoutHistoryRoutineId: 6, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 2, rep: 10, weightKg: 42, notes: null },
    { id: eid(), workoutHistoryRoutineId: 6, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 3, rep: 10, weightKg: 42, notes: null },
    // Session 7 – Arisa (this month)
    { id: eid(), workoutHistoryRoutineId: 7, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,  setNumber: 1, rep: 10, weightKg: 50, notes: null },
    { id: eid(), workoutHistoryRoutineId: 7, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,  setNumber: 2, rep: 8,  weightKg: 55, notes: null },
    // Session 8 – Arisa (Mon)
    { id: eid(), workoutHistoryRoutineId: 8, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 1, rep: 12, weightKg: 42, notes: null },
    { id: eid(), workoutHistoryRoutineId: 8, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 2, rep: 10, weightKg: 45, notes: null },
    { id: eid(), workoutHistoryRoutineId: 8, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id, setNumber: 3, rep: 10, weightKg: 45, notes: null },
    // Session 9 – Arisa (Wed)
    { id: eid(), workoutHistoryRoutineId: 9, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,  setNumber: 1, rep: 10, weightKg: 52, notes: null },
    { id: eid(), workoutHistoryRoutineId: 9, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,  setNumber: 2, rep: 8,  weightKg: 57, notes: null },
    // Session 10 – Arisa (Fri)
    { id: eid(), workoutHistoryRoutineId: 10, exerciseId: MockWorkoutExerciseDetails.EXERCISE_007_LEG_PRESS.id,   setNumber: 1, rep: 15, weightKg: 60, notes: null },
    { id: eid(), workoutHistoryRoutineId: 10, exerciseId: MockWorkoutExerciseDetails.EXERCISE_007_LEG_PRESS.id,   setNumber: 2, rep: 12, weightKg: 65, notes: null },
    { id: eid(), workoutHistoryRoutineId: 10, exerciseId: MockWorkoutExerciseDetails.EXERCISE_007_LEG_PRESS.id,   setNumber: 3, rep: 10, weightKg: 70, notes: null },
    // Session 11 – Tawan (Wed morning)
    { id: eid(), workoutHistoryRoutineId: 11, exerciseId: MockWorkoutExerciseDetails.EXERCISE_008_BENCH_PRESS_TAWAN.id, setNumber: 1, rep: 10, weightKg: 55, notes: null },
    { id: eid(), workoutHistoryRoutineId: 11, exerciseId: MockWorkoutExerciseDetails.EXERCISE_008_BENCH_PRESS_TAWAN.id, setNumber: 2, rep: 8,  weightKg: 60, notes: null },
    // Session 12 – Tawan (Wed evening)
    { id: eid(), workoutHistoryRoutineId: 12, exerciseId: MockWorkoutExerciseDetails.EXERCISE_009_SEATED_OHP.id,  setNumber: 1, rep: 10, weightKg: 50, notes: null },
    { id: eid(), workoutHistoryRoutineId: 12, exerciseId: MockWorkoutExerciseDetails.EXERCISE_009_SEATED_OHP.id,  setNumber: 2, rep: 8,  weightKg: 55, notes: null },
    // Session 13 – Nuch (Wed)
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
