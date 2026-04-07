import type { MacroTotals } from 'src/nutrition/repositories/meal-history.repository';
import type { NutritionPlanEntity } from 'src/nutrition/entities/nutrition-plan.entity';

// ---------------------------------------------------------------------------
// Workout Score  (0 – 50 points)
// ---------------------------------------------------------------------------

/**
 * Score how consistently the trainee has trained.
 *
 * @param sessionsLogged  Number of distinct days a workout was logged in the window.
 * @param totalRoutines   Total number of routines in the trainee's program (target cadence).
 *                        If 0 (no program), score is 0.
 */
export function computeWorkoutScore(
    sessionsLogged: number,
    totalRoutines: number,
): number {
    if (totalRoutines === 0) return 0;
    return Math.min(sessionsLogged / totalRoutines, 1) * 50;
}

// ---------------------------------------------------------------------------
// Nutrition Score  (0 – 50 points)
// ---------------------------------------------------------------------------

/**
 * Score macro adherence vs. the trainee's nutrition plan.
 *
 * Each macro (calories, protein, carbs, fat) is clamped to [0, 1]:
 *   adherence = min(actualForWindow / targetForWindow, 1)
 *
 * The nutrition plan stores DAILY targets. For weekly and monthly windows
 * we scale the target by windowDays.
 *
 * Final score = average of the four macro adherences * 50.
 * If no plan exists, score is 0.
 *
 * @param actual      Summed macro totals for the window.
 * @param plan        The trainee's nutrition plan (daily targets). Null = no plan.
 * @param windowDays  1 (daily) | 7 (weekly) | 30 (monthly).
 */
export function computeNutritionScore(
    actual: MacroTotals,
    plan: NutritionPlanEntity | null,
    windowDays: number,
): number {
    if (!plan) return 0;

    const targetCalories     = plan.totalCalories * windowDays;
    const targetProtein      = plan.protein       * windowDays;
    const targetCarbohydrate = plan.carbohydrate  * windowDays;
    const targetFat          = plan.fat           * windowDays;

    const clamp = (actual: number, target: number) =>
        target > 0 ? Math.min(actual / target, 1) : 0;

    const adherences = [
        clamp(actual.calories,     targetCalories),
        clamp(actual.protein,      targetProtein),
        clamp(actual.carbohydrate, targetCarbohydrate),
        clamp(actual.fat,          targetFat),
    ];

    const avg = adherences.reduce((s, v) => s + v, 0) / adherences.length;
    return avg * 50;
}

// ---------------------------------------------------------------------------
// Total Score  (0 – 100 points, rounded)
// ---------------------------------------------------------------------------

export function computeTotalScore(
    workoutScore: number,
    nutritionScore: number,
): number {
    return Math.round(workoutScore + nutritionScore);
}

// ---------------------------------------------------------------------------
// Trend  (compares this week vs last week)
// ---------------------------------------------------------------------------

export type Trend = 'up' | 'down' | 'same';

/**
 * Simple trend: up when this week > last week, down when <, same when equal.
 * A ±2 point dead-band prevents noise flipping the arrow.
 */
export function computeTrend(thisWeek: number, lastWeek: number): Trend {
    const delta = thisWeek - lastWeek;
    if (delta > 2)  return 'up';
    if (delta < -2) return 'down';
    return 'same';
}

// ---------------------------------------------------------------------------
// Date-window helpers
// ---------------------------------------------------------------------------

export interface DateWindow {
    from: Date;
    to: Date;
}

/** Returns [start-of-day, start-of-next-day) for today in server local time. */
export function dailyWindow(): DateWindow {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(to.getDate() + 1);
    return { from, to };
}

/** Returns [start-of-current-ISO-week Monday, next Monday). */
export function weeklyWindow(): DateWindow {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 = Sunday
    const daysToMonday = (dayOfWeek + 6) % 7;
    const from = new Date(now);
    from.setDate(now.getDate() - daysToMonday);
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(from.getDate() + 7);
    return { from, to };
}

/** Returns [start-of-last-Monday-week, this-week-Monday). */
export function lastWeeklyWindow(): DateWindow {
    const { from } = weeklyWindow();
    const to = new Date(from);
    from.setDate(from.getDate() - 7);
    return { from, to };
}

/** Returns [1st of current month, 1st of next month). */
export function monthlyWindow(): DateWindow {
    const now = new Date();
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    const to   = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return { from, to };
}
