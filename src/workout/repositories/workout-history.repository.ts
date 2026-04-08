import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutHistoryEntity } from "../entities/workout-history.entity";

export type TruncUnit = 'day' | 'week' | 'month';

@Injectable()
export class WorkoutHistoryRepository extends Repository<WorkoutHistoryEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutHistoryEntity, datasource.createEntityManager());
    }

    /**
     * Count the number of distinct calendar days the trainee logged
     * any workout set within the given date range [from, to).
     */
    async countDistinctSessionDays(
        lineUserId: string,
        from: Date,
        to: Date,
    ): Promise<number> {
        const result = await this.createQueryBuilder('wh')
            .select('COUNT(DISTINCT DATE(wh.performedAt))', 'count')
            .where('wh.lineUserId = :lineUserId', { lineUserId })
            .andWhere('wh.performedAt >= :from', { from })
            .andWhere('wh.performedAt < :to', { to })
            .getRawOne<{ count: string }>();

        return parseInt(result?.count ?? '0', 10);
    }

    /**
     * Count distinct workout days grouped by DATE_TRUNC bucket (day | week | month).
     * Used for the trainer's score-history chart — one SQL query yields every
     * bucket's day-count for a trainee in one round-trip.
     *
     * Returns a Map whose key is the bucket start timestamp (ISO string) and
     * whose value is the number of distinct days the trainee trained in that bucket.
     */
    async countDaysGroupedByBucket(
        lineUserId: string,
        from: Date,
        to: Date,
        truncUnit: TruncUnit,
    ): Promise<Map<string, number>> {
        const rows = await this.createQueryBuilder('wh')
            .select(`DATE_TRUNC('${truncUnit}', wh.performed_at)`, 'bucket')
            .addSelect('COUNT(DISTINCT DATE(wh.performed_at))', 'count')
            .where('wh.line_user_id = :lineUserId', { lineUserId })
            .andWhere('wh.performed_at >= :from', { from })
            .andWhere('wh.performed_at < :to', { to })
            .groupBy('bucket')
            .getRawMany<{ bucket: Date; count: string }>();

        const map = new Map<string, number>();
        for (const row of rows) {
            map.set(new Date(row.bucket).toISOString(), parseInt(row.count, 10));
        }
        return map;
    }
}
