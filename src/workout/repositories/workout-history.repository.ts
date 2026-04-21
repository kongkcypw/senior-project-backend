import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutHistoryEntity } from "../entities/workout-history.entity";

export type TruncUnit = 'day' | 'week' | 'month';

@Injectable()
export class WorkoutHistoryRepository extends Repository<WorkoutHistoryEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutHistoryEntity, datasource.createEntityManager());
    }

    async createSession(lineUserId: string, routineId: number): Promise<WorkoutHistoryEntity> {
        const session = this.create({ lineUserId, routineId, startedAt: new Date(), finishedAt: null });
        return this.save(session);
    }

    async finishSession(sessionId: number, finishedAt: Date): Promise<void> {
        await this.update(sessionId, { finishedAt });
    }

    /**
     * Returns the sets logged in the most recent completed session for a routine.
     * Used by RoutineDetailPage / EditRoutinePage to pre-fill last-session values.
     */
    async findLatestSession(
        lineUserId: string,
        routineId: number,
    ): Promise<{ performedAt: Date; sets: { setNumber: number; reps: number; weightKg: number }[] } | null> {
        const latest = await this.findOne({
            where: { lineUserId, routineId },
            order: { finishedAt: 'DESC' },
            relations: ['exerciseLogs'],
        });

        if (!latest || !latest.finishedAt) return null;

        return {
            performedAt: latest.finishedAt,
            sets: (latest.exerciseLogs ?? []).map(s => ({
                setNumber: s.setNumber,
                reps: s.rep,
                weightKg: s.weightKg ?? 0,
            })),
        };
    }

    /**
     * Returns routine IDs that have at least one completed session in the given week window.
     */
    async findRoutinesDoneThisWeek(lineUserId: string, from: Date, to: Date): Promise<number[]> {
        const rows = await this.createQueryBuilder('wh')
            .select('wh.routineId', 'routineId')
            .where('wh.lineUserId = :lineUserId', { lineUserId })
            .andWhere('wh.finishedAt IS NOT NULL')
            .andWhere('wh.startedAt >= :from', { from })
            .andWhere('wh.startedAt < :to', { to })
            .groupBy('wh.routineId')
            .getRawMany<{ routineId: number }>();
        return rows.map(r => Number(r.routineId));
    }

    /**
     * Count distinct calendar days with a completed session in [from, to).
     */
    async countDistinctSessionDays(lineUserId: string, from: Date, to: Date): Promise<number> {
        const result = await this.createQueryBuilder('wh')
            .select('COUNT(DISTINCT DATE(wh.startedAt))', 'count')
            .where('wh.lineUserId = :lineUserId', { lineUserId })
            .andWhere('wh.finishedAt IS NOT NULL')
            .andWhere('wh.startedAt >= :from', { from })
            .andWhere('wh.startedAt < :to', { to })
            .getRawOne<{ count: string }>();
        return parseInt(result?.count ?? '0', 10);
    }

    async countDaysGroupedByBucket(
        lineUserId: string,
        from: Date,
        to: Date,
        truncUnit: TruncUnit,
    ): Promise<Map<string, number>> {
        const rows = await this.createQueryBuilder('wh')
            .select(`DATE_TRUNC('${truncUnit}', wh.started_at)`, 'bucket')
            .addSelect('COUNT(DISTINCT DATE(wh.started_at))', 'count')
            .where('wh.line_user_id = :lineUserId', { lineUserId })
            .andWhere('wh.finished_at IS NOT NULL')
            .andWhere('wh.started_at >= :from', { from })
            .andWhere('wh.started_at < :to', { to })
            .groupBy('bucket')
            .getRawMany<{ bucket: Date; count: string }>();

        const map = new Map<string, number>();
        for (const row of rows) {
            map.set(new Date(row.bucket).toISOString(), parseInt(row.count, 10));
        }
        return map;
    }
}
