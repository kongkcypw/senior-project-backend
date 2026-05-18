import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { MealHistoryEntity } from "../entities/meal-history.entity";
import { UserEntity } from "src/users/entities/user.entity";

export interface PendingMealRow {
    id: number;
    lineUserId: string;
    displayName: string | null;
    pictureUrl: string | null;
    foodTitle: string;
    imageUrl: string;
    calories: number;
    createdAt: Date;
}

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
     * Count the number of meal rows (one row = one logged meal) the trainee
     * logged within the given date range [from, to). Used for timeline-based
     * nutrition status.
     */
    async countMealsInWindow(
        lineUserId: string,
        from: Date,
        to: Date,
    ): Promise<number> {
        const result = await this.createQueryBuilder('mh')
            .select('COUNT(mh.id)', 'count')
            .where('mh.lineUserId = :lineUserId', { lineUserId })
            .andWhere('mh.createdAt >= :from', { from })
            .andWhere('mh.createdAt < :to', { to })
            .getRawOne<{ count: string }>();

        return parseInt(result?.count ?? '0', 10);
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

    async findUnconfirmedMealsByTrainer(trainerLineUserId: string): Promise<PendingMealRow[]> {
        return this.createQueryBuilder('mh')
            .innerJoin(UserEntity, 'u', 'u.lineUserId = mh.lineUserId')
            .innerJoin(
                'user_relationships',
                'ur',
                'ur.trainee_line_user_id = mh.line_user_id AND ur.trainer_line_user_id = :trainerLineUserId AND ur.is_active = true',
                { trainerLineUserId },
            )
            .select('mh.id', 'id')
            .addSelect('mh.line_user_id', 'lineUserId')
            .addSelect('u.display_name', 'displayName')
            .addSelect('u.picture_url', 'pictureUrl')
            .addSelect('mh.food_title', 'foodTitle')
            .addSelect('mh.image_url', 'imageUrl')
            .addSelect('mh.calories', 'calories')
            .addSelect('mh.created_at', 'createdAt')
            .where('mh.confirm_at IS NULL')
            .orderBy('mh.created_at', 'DESC')
            .getRawMany<PendingMealRow>();
    }
}
