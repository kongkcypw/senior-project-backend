import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MealHistoryEntity } from "../entities/meal-history.entity";

export interface MacroTotals {
    calories: number;
    protein: number;
    carbohydrate: number;
    fat: number;
}

export type TruncUnit = 'day' | 'week' | 'month';

@Injectable()
export class MealHistoryRepository extends Repository<MealHistoryEntity> {
    constructor(private datasource: DataSource){
        super(MealHistoryEntity, datasource.createEntityManager());
    }

    async findMealProgressOfDayById(id: number): Promise<MealHistoryEntity | null> {
        return this.findOne({
            where: {
                id
            }
        })
    }

    /**
     * Sum calories, protein, carbohydrate, and fat consumed by the user
     * within the given date range [from, to).
     */
    async sumMacrosInWindow(
        lineUserId: string,
        from: Date,
        to: Date,
    ): Promise<MacroTotals> {
        const result = await this.createQueryBuilder('mh')
            .select('COALESCE(SUM(mh.calories), 0)',    'calories')
            .addSelect('COALESCE(SUM(mh.protein), 0)',      'protein')
            .addSelect('COALESCE(SUM(mh.carbohydrate), 0)', 'carbohydrate')
            .addSelect('COALESCE(SUM(mh.fat), 0)',          'fat')
            .where('mh.lineUserId = :lineUserId', { lineUserId })
            .andWhere('mh.createdAt >= :from', { from })
            .andWhere('mh.createdAt < :to',   { to })
            .getRawOne<{ calories: string; protein: string; carbohydrate: string; fat: string }>();

        return {
            calories:     parseFloat(result?.calories     ?? '0'),
            protein:      parseFloat(result?.protein      ?? '0'),
            carbohydrate: parseFloat(result?.carbohydrate ?? '0'),
            fat:          parseFloat(result?.fat          ?? '0'),
        };
    }

    /**
     * Sum macros grouped by DATE_TRUNC bucket (day | week | month).
     * Returns a Map keyed by bucket-start ISO string.
     */
    async sumMacrosGroupedByBucket(
        lineUserId: string,
        from: Date,
        to: Date,
        truncUnit: TruncUnit,
    ): Promise<Map<string, MacroTotals>> {
        const rows = await this.createQueryBuilder('mh')
            .select(`DATE_TRUNC('${truncUnit}', mh.created_at)`, 'bucket')
            .addSelect('COALESCE(SUM(mh.calories), 0)',     'calories')
            .addSelect('COALESCE(SUM(mh.protein), 0)',      'protein')
            .addSelect('COALESCE(SUM(mh.carbohydrate), 0)', 'carbohydrate')
            .addSelect('COALESCE(SUM(mh.fat), 0)',          'fat')
            .where('mh.line_user_id = :lineUserId', { lineUserId })
            .andWhere('mh.created_at >= :from', { from })
            .andWhere('mh.created_at < :to',   { to })
            .groupBy('bucket')
            .getRawMany<{ bucket: Date; calories: string; protein: string; carbohydrate: string; fat: string }>();

        const map = new Map<string, MacroTotals>();
        for (const row of rows) {
            map.set(new Date(row.bucket).toISOString(), {
                calories:     parseFloat(row.calories),
                protein:      parseFloat(row.protein),
                carbohydrate: parseFloat(row.carbohydrate),
                fat:          parseFloat(row.fat),
            });
        }
        return map;
    }
}
