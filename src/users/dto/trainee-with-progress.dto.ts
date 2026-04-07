import type { Trend } from 'src/common/utils/score.util';

// ---------------------------------------------------------------------------
// Sub-shapes
// ---------------------------------------------------------------------------

export class WorkoutWindowDto {
    /** Number of distinct calendar days the trainee logged any workout set. */
    sessionsLogged: number;
    /** Total number of routines across all programs assigned to the trainee. */
    totalRoutines: number;
    /** Computed workout score for this window (0–50). */
    score: number;
}

export class NutritionWindowDto {
    /** Actual summed calories consumed in the window. */
    calories: number;
    /** Actual summed protein consumed in the window (g). */
    protein: number;
    /** Actual summed carbohydrate consumed in the window (g). */
    carbohydrate: number;
    /** Actual summed fat consumed in the window (g). */
    fat: number;
    /** Target calories for the window (plan.totalCalories × windowDays). */
    targetCalories: number;
    /** Target protein for the window (g). */
    targetProtein: number;
    /** Target carbohydrate for the window (g). */
    targetCarbohydrate: number;
    /** Target fat for the window (g). */
    targetFat: number;
    /** Computed nutrition score for this window (0–50). */
    score: number;
}

export class PeriodScoreDto {
    workout: WorkoutWindowDto;
    nutrition: NutritionWindowDto;
    /** Total composite score (0–100). */
    total: number;
}

// ---------------------------------------------------------------------------
// Root DTO
// ---------------------------------------------------------------------------

export class TraineeWithProgressDto {
    id: number;
    lineUserId: string;
    displayName: string | null;
    pictureUrl?: string | null;
    role: string | null;
    /** ISO date string of when the trainer-trainee relationship was created. */
    joinDate: string;

    daily: PeriodScoreDto;
    weekly: PeriodScoreDto;
    monthly: PeriodScoreDto;

    /** Score trend based on this week vs last week. */
    trend: Trend;
}
