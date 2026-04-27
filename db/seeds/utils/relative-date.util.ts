/**
 * Date helpers for seed files. All values are computed at runtime against
 * "today" (server local time) so seeded history stays aligned with the
 * daily / weekly / monthly score windows without re-editing seeds.
 *
 * Score windows (see `backend/src/common/utils/score.util.ts`):
 *   daily   = today
 *   weekly  = Mon → Sun of the current week
 *   monthly = 1st → last day of the current month
 */

export type Weekday = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

const ISO_WEEKDAY: Record<Weekday, number> = {
    MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6, SUN: 7,
};

function withTime(d: Date, hour: number, minute: number): Date {
    d.setHours(hour, minute, 0, 0);
    return d;
}

/** Today at the given clock time. */
export function today(hour = 0, minute = 0): Date {
    return withTime(new Date(), hour, minute);
}

/** N days before today (n=1 → yesterday, n=0 → today, n=-1 → tomorrow). */
export function daysAgo(n: number, hour = 0, minute = 0): Date {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return withTime(d, hour, minute);
}

/**
 * A specific weekday relative to the current ISO week (Mon–Sun).
 * weekOffset: 0 = current week, -1 = last week, +1 = next week.
 */
export function weekDay(weekOffset: number, weekday: Weekday, hour = 0, minute = 0): Date {
    const d = new Date();
    const jsDay = d.getDay();                  // 0=Sun … 6=Sat
    const isoToday = jsDay === 0 ? 7 : jsDay;  // 1=Mon … 7=Sun
    const diff = ISO_WEEKDAY[weekday] - isoToday + weekOffset * 7;
    d.setDate(d.getDate() + diff);
    return withTime(d, hour, minute);
}

/**
 * A specific day-of-month in the current (or offset) calendar month.
 * monthOffset: 0 = this month, -1 = last month, +1 = next month.
 * `dayOfMonth` is clamped to the last valid day of the resolved month.
 */
export function monthDay(monthOffset: number, dayOfMonth: number, hour = 0, minute = 0): Date {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + monthOffset;
    const lastDay = new Date(year, month + 1, 0).getDate();
    const d = new Date(year, month, Math.min(dayOfMonth, lastDay));
    return withTime(d, hour, minute);
}

/** Returns a new Date offset by N minutes — handy for `finishedAt = startedAt + duration`. */
export function plusMinutes(d: Date, minutes: number): Date {
    const r = new Date(d);
    r.setMinutes(r.getMinutes() + minutes);
    return r;
}
