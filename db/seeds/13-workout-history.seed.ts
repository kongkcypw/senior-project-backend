import { WorkoutHistoryEntity } from "src/workout/entities/workout-history.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";
import { MockWorkoutRoutines } from "./09-workout-routine.seed";

type WorkoutHistorySeedType = Omit<WorkoutHistoryEntity, 'createdAt' | 'updatedAt' | 'user' | 'workoutRoutine'>;

// Helper to create a Date at a specific time on a calendar day
function at(year: number, month: number, date: number, hour = 9): Date {
    return new Date(year, month - 1, date, hour, 0, 0);
}

// All dates relative to today: 2026-04-08 (Tuesday)
// Daily window  : Apr 8
// Weekly window : Apr 6 (Mon) – Apr 12 (Sun)
// Monthly window: Apr 1 – Apr 30

let nextId = 1;
const id = () => nextId++;

export class MockWorkoutHistory {

    // -----------------------------------------------------------------------
    // Latif Danai — PPL routines 1/2/3 (total 3 routines)
    // Weekly: Apr 6 Push, Apr 7 Pull, Apr 8 Legs → 3 days / 3 = 50 pts workout
    // Monthly: +Apr 1 Push, Apr 3 Pull → 5 days / 3 → capped → 50 pts
    // -----------------------------------------------------------------------
    static readonly LATIF_SETS: WorkoutHistorySeedType[] = [
        // Apr 1 – Push
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, performedAt: at(2026, 4, 1), setNumber: 1, actualReps: 10, actualWeightKg: 60, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, performedAt: at(2026, 4, 1), setNumber: 2, actualReps: 8,  actualWeightKg: 65, notes: null },
        // Apr 3 – Pull
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, performedAt: at(2026, 4, 3), setNumber: 1, actualReps: 8,  actualWeightKg: 100, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, performedAt: at(2026, 4, 3), setNumber: 2, actualReps: 6,  actualWeightKg: 110, notes: null },
        // Apr 6 – Push (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, performedAt: at(2026, 4, 6), setNumber: 1, actualReps: 10, actualWeightKg: 60, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PUSH_001.id, performedAt: at(2026, 4, 6), setNumber: 2, actualReps: 9,  actualWeightKg: 62, notes: null },
        // Apr 7 – Pull (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_PULL_002.id, performedAt: at(2026, 4, 7), setNumber: 1, actualReps: 8,  actualWeightKg: 100, notes: null },
        // Apr 8 – Legs (this week, today)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_LEGS_003.id, performedAt: at(2026, 4, 8), setNumber: 1, actualReps: 12, actualWeightKg: 80,  notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_003.lineUserId, routineId: MockWorkoutRoutines.DAY_LEGS_003.id, performedAt: at(2026, 4, 8), setNumber: 2, actualReps: 10, actualWeightKg: 85,  notes: null },
    ];

    // -----------------------------------------------------------------------
    // Arisa Natcha — PPL routines 4/5/6 (total 3 routines)
    // Weekly: Apr 6 Push, Apr 7 Pull, Apr 8 Legs → 3/3 = 50 pts workout
    // Monthly: +Apr 1 Push, Apr 3 Pull → 5 days / 3 → capped → 50 pts
    // -----------------------------------------------------------------------
    static readonly ARISA_SETS: WorkoutHistorySeedType[] = [
        // Apr 1 – Push
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, performedAt: at(2026, 4, 1), setNumber: 1, actualReps: 12, actualWeightKg: 40, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, performedAt: at(2026, 4, 1), setNumber: 2, actualReps: 10, actualWeightKg: 42, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, performedAt: at(2026, 4, 1), setNumber: 3, actualReps: 10, actualWeightKg: 42, notes: null },
        // Apr 3 – Pull
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, performedAt: at(2026, 4, 3), setNumber: 1, actualReps: 10, actualWeightKg: 50, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, performedAt: at(2026, 4, 3), setNumber: 2, actualReps: 8,  actualWeightKg: 55, notes: null },
        // Apr 6 – Push (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, performedAt: at(2026, 4, 6), setNumber: 1, actualReps: 12, actualWeightKg: 42, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, performedAt: at(2026, 4, 6), setNumber: 2, actualReps: 10, actualWeightKg: 45, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PUSH_004.id, performedAt: at(2026, 4, 6), setNumber: 3, actualReps: 10, actualWeightKg: 45, notes: null },
        // Apr 7 – Pull (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, performedAt: at(2026, 4, 7), setNumber: 1, actualReps: 10, actualWeightKg: 52, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_PULL_005.id, performedAt: at(2026, 4, 7), setNumber: 2, actualReps: 8,  actualWeightKg: 57, notes: null },
        // Apr 8 – Legs (this week, today)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_LEGS_006.id, performedAt: at(2026, 4, 8), setNumber: 1, actualReps: 15, actualWeightKg: 60, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_LEGS_006.id, performedAt: at(2026, 4, 8), setNumber: 2, actualReps: 12, actualWeightKg: 65, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, routineId: MockWorkoutRoutines.ARISA_LEGS_006.id, performedAt: at(2026, 4, 8), setNumber: 3, actualReps: 10, actualWeightKg: 70, notes: null },
    ];

    // -----------------------------------------------------------------------
    // Tawan Kraiwit — Upper/Lower routines 7/8/9/10 (total 4 routines)
    // Weekly: Apr 7 UpperA, Apr 8 UpperB → 2/4 = 50% → 25 pts workout
    // Monthly: same 2 days → 2/4 = 25 pts
    // -----------------------------------------------------------------------
    static readonly TAWAN_SETS: WorkoutHistorySeedType[] = [
        // Apr 7 – Upper A (this week)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_A_007.id, performedAt: at(2026, 4, 7), setNumber: 1, actualReps: 10, actualWeightKg: 55, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_A_007.id, performedAt: at(2026, 4, 7), setNumber: 2, actualReps: 8,  actualWeightKg: 60, notes: null },
        // Apr 8 – Upper B (this week, today)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_B_008.id, performedAt: at(2026, 4, 8), setNumber: 1, actualReps: 10, actualWeightKg: 50, notes: null },
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, routineId: MockWorkoutRoutines.TAWAN_UPPER_B_008.id, performedAt: at(2026, 4, 8), setNumber: 2, actualReps: 8,  actualWeightKg: 55, notes: null },
    ];

    // -----------------------------------------------------------------------
    // Nuch Piyanat — Full Body routines 11/12/13 (total 3 routines)
    // Weekly: Apr 8 FullA only → 1/3 = 33% → 17 pts workout
    // Monthly: same 1 day → 17 pts
    // -----------------------------------------------------------------------
    static readonly NUCH_SETS: WorkoutHistorySeedType[] = [
        // Apr 8 – Full Body A (today only)
        { id: id(), lineUserId: MockUsers.TRAINEE_USER_006.lineUserId, routineId: MockWorkoutRoutines.NUCH_FULL_A_011.id, performedAt: at(2026, 4, 8), setNumber: 1, actualReps: 10, actualWeightKg: 30, notes: 'First session' },
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
