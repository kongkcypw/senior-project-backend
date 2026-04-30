import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutHistoryEntity } from "../entities/workout-history.entity";

export type TruncUnit = 'day' | 'week' | 'month';

export interface LatestCompletedSessionSummary {
    routineId: number;
    routineName: string;
    programName: string;
    startedAt: Date;
}

@Injectable()
export class WorkoutHistoryRepository extends Repository<WorkoutHistoryEntity> {
    constructor(private datasource: DataSource) {
        super(WorkoutHistoryEntity, datasource.createEntityManager());
    }

    async findActiveSession(lineUserId: string): Promise<WorkoutHistoryEntity | null> {
        return this.createQueryBuilder('wh')
            .leftJoinAndSelect('wh.workoutRoutine', 'wr')
            .where('wh.line_user_id = :lineUserId', { lineUserId })
            .andWhere('wh.finished_at IS NULL')
            .orderBy('wh.started_at', 'DESC')
            .getOne();
    }

    async deleteSession(sessionId: number): Promise<void> {
        await this.delete(sessionId);
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
    ): Promise<{ finishedAt: Date; sets: { exerciseId: number; setNumber: number; rep: number; weightKg: number }[] } | null> {
        const latest = await this.createQueryBuilder('wh')
            .innerJoinAndSelect('wh.exerciseLogs', 'el')
            .where('wh.line_user_id = :lineUserId', { lineUserId })
            .andWhere('wh.routine_id = :routineId', { routineId })
            .andWhere('wh.finished_at IS NOT NULL')
            .orderBy('wh.finished_at', 'DESC')
            .getOne();

        if (!latest) return null;

        return {
            finishedAt: latest.finishedAt!,
            sets: latest.exerciseLogs!.map(s => ({
                exerciseId: s.exerciseId,
                setNumber: s.setNumber,
                rep: s.rep,
                weightKg: s.weightKg ?? 0,
            })),
        };
    }

    async findLatestCompletedSessionSummary(
        lineUserId: string,
    ): Promise<LatestCompletedSessionSummary | null> {
        const latest = await this.createQueryBuilder('wh')
            .innerJoinAndSelect('wh.workoutRoutine', 'wr')
            .innerJoinAndSelect('wr.workoutProgram', 'wp')
            .where('wh.line_user_id = :lineUserId', { lineUserId })
            .andWhere('wh.finished_at IS NOT NULL')
            .orderBy('wh.started_at', 'DESC')
            .getOne();

        if (!latest) return null;

        return {
            routineId: latest.routineId,
            routineName: latest.workoutRoutine?.name ?? '-',
            programName: latest.workoutRoutine?.workoutProgram?.name ?? '-',
            startedAt: latest.startedAt,
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
