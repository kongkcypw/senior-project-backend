import type { HistoryPeriod } from 'src/common/utils/score.util';

export class ScoreHistoryPointDto {
    /** X-axis label (e.g. "จ", "W1", "ม.ค."). */
    label: string;
    /** Trainer-wide average score for this bucket, or null if the bucket is in the future. */
    avg: number | null;
}

export class ScoreHistoryDto {
    period: HistoryPeriod;
    points: ScoreHistoryPointDto[];
}
