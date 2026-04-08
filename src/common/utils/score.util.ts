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

// ---------------------------------------------------------------------------
// Score-history buckets (for the trainer-wide average chart)
// ---------------------------------------------------------------------------

export type HistoryPeriod = 'daily' | 'weekly' | 'monthly';
export type TruncUnit = 'day' | 'week' | 'month';

export interface ScoreBucket {
    /** Display label for the X-axis (e.g. "จ", "W1", "ม.ค."). */
    label: string;
    /** Bucket start (inclusive). Used as the Map key when joining DB results. */
    from: Date;
    /** Bucket end (exclusive). */
    to: Date;
    /** Number of days this bucket covers, used to scale nutrition targets. */
    windowDays: number;
    /** True if the whole bucket lies in the future (from > now). */
    isFuture: boolean;
}

export interface HistoryBuckets {
    /** The SQL DATE_TRUNC unit that groups rows into the same bucket span. */
    truncUnit: TruncUnit;
    /** Overall range that covers all buckets — use as the WHERE range in SQL. */
    rangeFrom: Date;
    rangeTo: Date;
    /** Ordered list of buckets for rendering. */
    buckets: ScoreBucket[];
}

const THAI_DAY_LABELS = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'];
const THAI_MONTH_LABELS = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
];

/**
 * Build the bucket list for the score-history chart.
 *
 * - `daily`   → 7 buckets, Mon–Sun of the current ISO week (windowDays = 1)
 * - `weekly`  → one bucket per ISO week that overlaps the current month,
 *               each 7 days long, starting on Monday (windowDays = 7)
 * - `monthly` → 12 buckets, Jan–Dec of the current year (windowDays = days in that month)
 *
 * `isFuture` is true when the bucket starts strictly after "now", so the caller
 * can emit null values for those buckets (chart shows a gap).
 */
export function buildHistoryBuckets(period: HistoryPeriod): HistoryBuckets {
    const now = new Date();

    if (period === 'daily') {
        // Mon–Sun of this week, 7 buckets
        const { from: weekStart } = weeklyWindow();
        const buckets: ScoreBucket[] = [];
        for (let i = 0; i < 7; i++) {
            const bucketFrom = new Date(weekStart);
            bucketFrom.setDate(weekStart.getDate() + i);
            const bucketTo = new Date(bucketFrom);
            bucketTo.setDate(bucketFrom.getDate() + 1);
            buckets.push({
                label: THAI_DAY_LABELS[i],
                from: bucketFrom,
                to: bucketTo,
                windowDays: 1,
                isFuture: bucketFrom > now,
            });
        }
        const rangeTo = new Date(weekStart);
        rangeTo.setDate(weekStart.getDate() + 7);
        return { truncUnit: 'day', rangeFrom: weekStart, rangeTo, buckets };
    }

    if (period === 'weekly') {
        // Every ISO week (Mon start) that overlaps the current calendar month.
        // Range is the union of those weeks (so a week that straddles a month
        // boundary is still counted fully).
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd   = new Date(now.getFullYear(), now.getMonth() + 1, 1);

        // First bucket: Monday of the week that contains monthStart
        const firstBucketFrom = new Date(monthStart);
        const dow = firstBucketFrom.getDay(); // 0 = Sun
        const daysToMonday = (dow + 6) % 7;
        firstBucketFrom.setDate(firstBucketFrom.getDate() - daysToMonday);
        firstBucketFrom.setHours(0, 0, 0, 0);

        const buckets: ScoreBucket[] = [];
        let cursor = firstBucketFrom;
        let weekIndex = 1;
        while (cursor < monthEnd) {
            const bucketTo = new Date(cursor);
            bucketTo.setDate(cursor.getDate() + 7);
            buckets.push({
                label: `W${weekIndex}`,
                from: cursor,
                to: bucketTo,
                windowDays: 7,
                isFuture: cursor > now,
            });
            cursor = bucketTo;
            weekIndex++;
        }
        const rangeFrom = buckets[0].from;
        const rangeTo   = buckets[buckets.length - 1].to;
        return { truncUnit: 'week', rangeFrom, rangeTo, buckets };
    }

    // monthly — 12 buckets, Jan–Dec of current year
    const year = now.getFullYear();
    const buckets: ScoreBucket[] = [];
    for (let m = 0; m < 12; m++) {
        const bucketFrom = new Date(year, m, 1);
        const bucketTo   = new Date(year, m + 1, 1);
        const daysInMonth = Math.round((bucketTo.getTime() - bucketFrom.getTime()) / (1000 * 60 * 60 * 24));
        buckets.push({
            label: THAI_MONTH_LABELS[m],
            from: bucketFrom,
            to: bucketTo,
            windowDays: daysInMonth,
            isFuture: bucketFrom > now,
        });
    }
    return {
        truncUnit: 'month',
        rangeFrom: new Date(year, 0, 1),
        rangeTo:   new Date(year + 1, 0, 1),
        buckets,
    };
}
