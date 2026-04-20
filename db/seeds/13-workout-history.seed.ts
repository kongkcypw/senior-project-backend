import { WorkoutHistoryEntity } from "src/workout/entities/workout-history.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";
import { MockWorkoutRoutines } from "./09-workout-routine.seed";
import { MockWorkoutExerciseDetails } from "./10-workout-exercise-detail.seed";

type WorkoutHistorySeedType = Omit<WorkoutHistoryEntity, 'createdAt' | 'updatedAt' | 'user' | 'workoutRoutine' | 'workoutExercise'>;

// Creates a Date at a specific time on a calendar day
function at(year: number, month: number, date: number, hour = 9, minute = 0): Date {
    return new Date(year, month - 1, date, hour, minute, 0);
}

// Returns finishedAt by adding seconds to startedAt (default 90 s per set)
function fin(start: Date, seconds = 90): Date {
    return new Date(start.getTime() + seconds * 1000);
}

// All dates relative to today: 2026-04-18 (Friday)
// Daily window  : Apr 18
// Weekly window : Apr 14 (Mon) – Apr 20 (Sun)
// Monthly window: Apr 1 – Apr 30

let nextId = 1;
const id = () => nextId++;

export class MockWorkoutHistory {

    // -----------------------------------------------------------------------
    // Latif Danai — PPL routines 1/2/3 (total 3 routines)
    // Weekly: Apr 14 Push, Apr 16 Pull, Apr 18 Legs → 3 days / 3 = 50 pts workout
    // Monthly: +Apr 1 Push, Apr 5 Pull → 5 days / 3 → capped → 50 pts
    // -----------------------------------------------------------------------
    static readonly LATIF_SETS: WorkoutHistorySeedType[] = [
        // Apr 1 – Push
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, startedAt: at(2026, 4, 1, 9, 0),  finishedAt: fin(at(2026, 4, 1, 9, 0)),  setNumber: 1, rep: 10, weightKg: 60,  notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, startedAt: at(2026, 4, 1, 9, 3),  finishedAt: fin(at(2026, 4, 1, 9, 3)),  setNumber: 2, rep: 8,  weightKg: 65,  notes: null },
        // Apr 5 – Pull
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_003_DEADLIFT.id,    startedAt: at(2026, 4, 5, 9, 0),  finishedAt: fin(at(2026, 4, 5, 9, 0)),  setNumber: 1, rep: 8,  weightKg: 100, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_003_DEADLIFT.id,    startedAt: at(2026, 4, 5, 9, 3),  finishedAt: fin(at(2026, 4, 5, 9, 3)),  setNumber: 2, rep: 6,  weightKg: 110, notes: null },
        // Apr 14 – Push (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, startedAt: at(2026, 4, 14, 9, 0), finishedAt: fin(at(2026, 4, 14, 9, 0)), setNumber: 1, rep: 10, weightKg: 60,  notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_001_BENCH_PRESS.id, startedAt: at(2026, 4, 14, 9, 3), finishedAt: fin(at(2026, 4, 14, 9, 3)), setNumber: 2, rep: 9,  weightKg: 62,  notes: null },
        // Apr 16 – Pull (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_003_DEADLIFT.id,    startedAt: at(2026, 4, 16, 9, 0), finishedAt: fin(at(2026, 4, 16, 9, 0)), setNumber: 1, rep: 8,  weightKg: 100, notes: null },
        // Apr 18 – Legs (this week, today)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_LEGS_003.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_004_SQUAT.id,        startedAt: at(2026, 4, 18, 9, 0), finishedAt: fin(at(2026, 4, 18, 9, 0)), setNumber: 1, rep: 12, weightKg: 80,  notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_LEGS_003.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_004_SQUAT.id,        startedAt: at(2026, 4, 18, 9, 3), finishedAt: fin(at(2026, 4, 18, 9, 3)), setNumber: 2, rep: 10, weightKg: 85,  notes: null },
    ];

    // -----------------------------------------------------------------------
    // Arisa Natcha — PPL routines 4/5/6 (total 3 routines)
    // Weekly: Apr 14 Push, Apr 16 Pull, Apr 18 Legs → 3/3 = 50 pts workout
    // Monthly: +Apr 4 Push, Apr 8 Pull → 5 days / 3 → capped → 50 pts
    // -----------------------------------------------------------------------
    static readonly ARISA_SETS: WorkoutHistorySeedType[] = [
        // Apr 4 – Push
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id,  startedAt: at(2026, 4, 4, 9, 0),  finishedAt: fin(at(2026, 4, 4, 9, 0)),  setNumber: 1, rep: 12, weightKg: 40, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id,  startedAt: at(2026, 4, 4, 9, 3),  finishedAt: fin(at(2026, 4, 4, 9, 3)),  setNumber: 2, rep: 10, weightKg: 42, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id,  startedAt: at(2026, 4, 4, 9, 6),  finishedAt: fin(at(2026, 4, 4, 9, 6)),  setNumber: 3, rep: 10, weightKg: 42, notes: null },
        // Apr 8 – Pull
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,   startedAt: at(2026, 4, 8, 9, 0),  finishedAt: fin(at(2026, 4, 8, 9, 0)),  setNumber: 1, rep: 10, weightKg: 50, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,   startedAt: at(2026, 4, 8, 9, 3),  finishedAt: fin(at(2026, 4, 8, 9, 3)),  setNumber: 2, rep: 8,  weightKg: 55, notes: null },
        // Apr 14 – Push (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id,  startedAt: at(2026, 4, 14, 9, 0), finishedAt: fin(at(2026, 4, 14, 9, 0)), setNumber: 1, rep: 12, weightKg: 42, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id,  startedAt: at(2026, 4, 14, 9, 3), finishedAt: fin(at(2026, 4, 14, 9, 3)), setNumber: 2, rep: 10, weightKg: 45, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_005_INCLINE_BENCH.id,  startedAt: at(2026, 4, 14, 9, 6), finishedAt: fin(at(2026, 4, 14, 9, 6)), setNumber: 3, rep: 10, weightKg: 45, notes: null },
        // Apr 16 – Pull (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,   startedAt: at(2026, 4, 16, 9, 0), finishedAt: fin(at(2026, 4, 16, 9, 0)), setNumber: 1, rep: 10, weightKg: 52, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_006_LAT_PULLDOWN.id,   startedAt: at(2026, 4, 16, 9, 3), finishedAt: fin(at(2026, 4, 16, 9, 3)), setNumber: 2, rep: 8,  weightKg: 57, notes: null },
        // Apr 18 – Legs (this week, today)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_LEGS_006.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_007_LEG_PRESS.id,      startedAt: at(2026, 4, 18, 9, 0), finishedAt: fin(at(2026, 4, 18, 9, 0)), setNumber: 1, rep: 15, weightKg: 60, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_LEGS_006.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_007_LEG_PRESS.id,      startedAt: at(2026, 4, 18, 9, 3), finishedAt: fin(at(2026, 4, 18, 9, 3)), setNumber: 2, rep: 12, weightKg: 65, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_LEGS_006.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_007_LEG_PRESS.id,      startedAt: at(2026, 4, 18, 9, 6), finishedAt: fin(at(2026, 4, 18, 9, 6)), setNumber: 3, rep: 10, weightKg: 70, notes: null },
    ];

    // -----------------------------------------------------------------------
    // Tawan Kraiwit — Upper/Lower routines 7/8/9/10 (total 4 routines)
    // Weekly: Apr 16 UpperA, Apr 18 UpperB → 2/4 = 50% → 25 pts workout
    // Monthly: same 2 days → 2/4 = 25 pts
    // -----------------------------------------------------------------------
    static readonly TAWAN_SETS: WorkoutHistorySeedType[] = [
        // Apr 16 – Upper A (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_A_007.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_008_BENCH_PRESS_TAWAN.id, startedAt: at(2026, 4, 16, 9, 0), finishedAt: fin(at(2026, 4, 16, 9, 0)), setNumber: 1, rep: 10, weightKg: 55, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_A_007.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_008_BENCH_PRESS_TAWAN.id, startedAt: at(2026, 4, 16, 9, 3), finishedAt: fin(at(2026, 4, 16, 9, 3)), setNumber: 2, rep: 8,  weightKg: 60, notes: null },
        // Apr 18 – Upper B (this week, today)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_B_008.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_009_SEATED_OHP.id,        startedAt: at(2026, 4, 18, 9, 0), finishedAt: fin(at(2026, 4, 18, 9, 0)), setNumber: 1, rep: 10, weightKg: 50, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_B_008.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_009_SEATED_OHP.id,        startedAt: at(2026, 4, 18, 9, 3), finishedAt: fin(at(2026, 4, 18, 9, 3)), setNumber: 2, rep: 8,  weightKg: 55, notes: null },
    ];

    // -----------------------------------------------------------------------
    // Nuch Piyanat — Full Body routines 11/12/13 (total 3 routines)
    // Weekly: Apr 18 FullA only → 1/3 = 33% → 17 pts workout
    // Monthly: same 1 day → 17 pts
    // -----------------------------------------------------------------------
    static readonly NUCH_SETS: WorkoutHistorySeedType[] = [
        // Apr 18 – Full Body A (today only)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_006.lineUserId, routineId: MockWorkoutRoutines.NUCH_FULL_A_011.id, exerciseId: MockWorkoutExerciseDetails.EXERCISE_010_GOBLET_SQUAT.id, startedAt: at(2026, 4, 18, 9, 0), finishedAt: fin(at(2026, 4, 18, 9, 0)), setNumber: 1, rep: 10, weightKg: 30, notes: 'First session' },
    ];

    static readonly AllSets: WorkoutHistorySeedType[] = [
        ...MockWorkoutHistory.LATIF_SETS,
        ...MockWorkoutHistory.ARISA_SETS,
        ...MockWorkoutHistory.TAWAN_SETS,
        ...MockWorkoutHistory.NUCH_SETS,
    ];
}

export default class MockWorkoutHistorySeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(WorkoutHistoryEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockWorkoutHistory.AllSets);
    }
}
