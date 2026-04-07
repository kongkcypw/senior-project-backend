import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { WorkoutHistoryEntity } from "../entities/workout-history.entity";

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
}