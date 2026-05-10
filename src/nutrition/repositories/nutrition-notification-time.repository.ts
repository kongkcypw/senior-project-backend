import { Injectable } from "@nestjs/common";
import { NutritionNotificationTimeEntity } from "../entities/nutrition-notification-time.entity";
import { DataSource, In, Repository } from "typeorm";

@Injectable()
export class NutritionNotificationTimeRepository extends Repository<NutritionNotificationTimeEntity> {
    constructor(datasource: DataSource) {
        super(NutritionNotificationTimeEntity, datasource.createEntityManager());
    }

    async findByTimeWithPlan(time: string): Promise<NutritionNotificationTimeEntity[]> {
        return this.createQueryBuilder("notificationTime")
            .leftJoinAndSelect("notificationTime.nutritionPlan", "nutritionPlan")
            .where("notificationTime.sendAt = :time", { time })
            .getMany();
    }

    // Matches notifications whose send_at falls within [startTime, endTime].
    // When the window wraps past midnight (e.g. 23:57–00:03), wrapsAround=true
    // and the condition flips to >= startTime OR <= endTime.
    async findByTimeRangeWithPlan(startTime: string, endTime: string, wrapsAround: boolean): Promise<NutritionNotificationTimeEntity[]> {
        const qb = this.createQueryBuilder("notificationTime")
            .leftJoinAndSelect("notificationTime.nutritionPlan", "nutritionPlan");

        if (wrapsAround) {
            qb.where("notificationTime.sendAt >= :startTime OR notificationTime.sendAt <= :endTime", { startTime, endTime });
        } else {
            qb.where("notificationTime.sendAt BETWEEN :startTime AND :endTime", { startTime, endTime });
        }

        return qb.getMany();
    }

    // Inside NutritionNotificationTimeRepository.ts

    async deleteNotificationsNotIn(planId: number, notificationIds: number[]): Promise<void> {
        const queryBuilder = this.createQueryBuilder('notification') // Alias 'notification' is fine here
            .delete()
            .where('nutritionPlanId = :planId', { planId });

        // Only add the NOT IN clause if there are IDs to keep
        if (notificationIds.length > 0) {
            // FIX: Reference the column name 'id' directly without the alias.
            queryBuilder.andWhere('id NOT IN (:...notificationIds)', { notificationIds });
        }

        await queryBuilder.execute();
    }
}