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

const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;

function bkParts(utc: Date) {
    const bk = new Date(utc.getTime() + BANGKOK_OFFSET_MS);
    return { year: bk.getUTCFullYear(), month: bk.getUTCMonth(), date: bk.getUTCDate(), day: bk.getUTCDay() };
}

function bkMidnight(year: number, month: number, date: number): Date {
    return new Date(Date.UTC(year, month, date) - BANGKOK_OFFSET_MS);
}

/** Returns [start-of-day, start-of-next-day) for today in Asia/Bangkok time. */
export function dailyWindow(): DateWindow {
    const { year, month, date } = bkParts(new Date());
    return { from: bkMidnight(year, month, date), to: bkMidnight(year, month, date + 1) };
}

/** Returns [start-of-current-ISO-week Monday, next Monday) in Asia/Bangkok time. */
export function weeklyWindow(): DateWindow {
    const { year, month, date, day } = bkParts(new Date());
    const daysToMonday = (day + 6) % 7;
    const mondayDate = date - daysToMonday;
    return { from: bkMidnight(year, month, mondayDate), to: bkMidnight(year, month, mondayDate + 7) };
}

/** Returns [start-of-last-Monday-week, this-week-Monday) in Asia/Bangkok time. */
export function lastWeeklyWindow(): DateWindow {
    const { from } = weeklyWindow();
    const to = new Date(from);
    const prevMonday = new Date(from.getTime() - 7 * 86400000);
    return { from: prevMonday, to };
}

/** Returns [1st of current month, 1st of next month) in Asia/Bangkok time. */
export function monthlyWindow(): DateWindow {
    const { year, month } = bkParts(new Date());
    return { from: bkMidnight(year, month, 1), to: bkMidnight(year, month + 1, 1) };
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
        // Mon–Sun of this week, 7 buckets (Bangkok midnight boundaries)
        const { from: weekStart } = weeklyWindow();
        const buckets: ScoreBucket[] = [];
        for (let i = 0; i < 7; i++) {
            const bucketFrom = new Date(weekStart.getTime() + i * 86400000);
            const bucketTo   = new Date(weekStart.getTime() + (i + 1) * 86400000);
            buckets.push({
                label: THAI_DAY_LABELS[i],
                from: bucketFrom,
                to: bucketTo,
                windowDays: 1,
                isFuture: bucketFrom > now,
            });
        }
        const rangeTo = new Date(weekStart.getTime() + 7 * 86400000);
        return { truncUnit: 'day', rangeFrom: weekStart, rangeTo, buckets };
    }

    if (period === 'weekly') {
        // Every ISO week (Mon start) that overlaps the current Bangkok calendar month.
        const bkNow = bkParts(now);
        const monthStart = bkMidnight(bkNow.year, bkNow.month, 1);
        const monthEnd   = bkMidnight(bkNow.year, bkNow.month + 1, 1);

        // First bucket: Monday of the week that contains monthStart (Bangkok)
        const bkMonthStart = bkParts(monthStart);
        const daysToMonday = (bkMonthStart.day + 6) % 7;
        let cursor = bkMidnight(bkNow.year, bkNow.month, bkMonthStart.date - daysToMonday);

        const buckets: ScoreBucket[] = [];
        let weekIndex = 1;
        while (cursor < monthEnd) {
            const bucketTo = new Date(cursor.getTime() + 7 * 86400000);
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

    // monthly — 12 buckets, Jan–Dec of current Bangkok year
    const year = bkParts(now).year;
    const buckets: ScoreBucket[] = [];
    for (let m = 0; m < 12; m++) {
        const bucketFrom = bkMidnight(year, m, 1);
        const bucketTo   = bkMidnight(year, m + 1, 1);
        const daysInMonth = Math.round((bucketTo.getTime() - bucketFrom.getTime()) / 86400000);
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
        rangeFrom: bkMidnight(year, 0, 1),
        rangeTo:   bkMidnight(year + 1, 0, 1),
        buckets,
    };
}
