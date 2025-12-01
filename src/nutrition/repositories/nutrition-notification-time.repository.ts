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