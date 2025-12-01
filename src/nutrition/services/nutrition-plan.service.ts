import { Injectable } from "@nestjs/common";
import { NutritionPlanRepository } from "../repositories/nutrition-plan.repository";
import { NutritionPlanDto } from "../dto/nutrition-plan.dto";
import { Transactional } from "typeorm-transactional";
import { NutritionNotificationTimeRepository } from "../repositories/nutrition-notification-time.repository";
import { NutritionPlanEntity } from "../entities/nutrition-plan.entity";

@Injectable()
export class NutritionPlanService {
    constructor(
        private readonly nutritionPlanRepository: NutritionPlanRepository,
        private readonly nutritionNotificationTimeRepository: NutritionNotificationTimeRepository,
    ) { }

    async getNutritionPlanByLineUserId(lineUserId: string): Promise<NutritionPlanDto | null> {
        const nutritionPlan = await this.nutritionPlanRepository.findByLineUserId(lineUserId);
        if (!nutritionPlan) {
            return NutritionPlanDto.fromNoRecord(lineUserId);
        }
        return NutritionPlanDto.fromEntity(nutritionPlan);
    }

    @Transactional()
    async createOrUpdateNutritionPlan(nutritionPlanDto: NutritionPlanDto): Promise<void> {
        const { notificationTimes } = nutritionPlanDto;
        const nutritionPlan = NutritionPlanDto.toEntityWithoutNotificationTimes(nutritionPlanDto);

        if (!notificationTimes || notificationTimes.length === 0) {
            nutritionPlan.needNotification = false;
        }

        const savedPlan = await this.nutritionPlanRepository.upsertNutritionPlan(nutritionPlan);
        const savedPlanId = savedPlan.id;

        // Convert "HH:mm" back to "HH:mm:ss" for the DB
        const transformedNotificationTimes = notificationTimes.map(notification => ({
            ...notification,
            sendAt: `${notification.sendAt}:00`, 
        }));

        const newNotificationTimes = transformedNotificationTimes.filter(notification => !notification.id);
        const existingNotificationTimes = transformedNotificationTimes.filter(notification => notification.id)

        // Track notification IDs to keep
        let idsToKeep: (number | null)[] = [];

        if (newNotificationTimes.length > 0) {
            const notificationEntities = newNotificationTimes.map(notification => {
                const entity = this.nutritionNotificationTimeRepository.create();
                entity.nutritionPlanId = savedPlanId;
                entity.sendAt = notification.sendAt;
                return entity;
            });
            const createdEntities = await this.nutritionNotificationTimeRepository.save(notificationEntities);
            idsToKeep.push(...createdEntities.map(entity => entity.id));
        }

        if (existingNotificationTimes.length > 0) {
            const updateEntities = existingNotificationTimes.map(notification => {
                return {
                    id: notification.id,
                    nutritionPlanId: savedPlanId,
                    sendAt: notification.sendAt
                };
            });
            await this.nutritionNotificationTimeRepository.save(updateEntities);
            idsToKeep.push(...existingNotificationTimes.map(notification => notification.id));
        }

        const currentNotificationIds = idsToKeep.filter((id): id is number => id !== null);
        await this.nutritionNotificationTimeRepository.deleteNotificationsNotIn(
            savedPlanId,
            currentNotificationIds
        );
    }
}