import { Injectable } from "@nestjs/common";
import { NutritionPlanRepository } from "../repositories/nutrition-plan.repository";
import { NutritionPlanDto } from "../dto/nutrition-plan.dto";
import { Transactional } from "typeorm-transactional";
import { NutritionNotificationTimeRepository } from "../repositories/nutrition-notification-time.repository";
import { MealHistoryService } from "./meal-history.service";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { NutritionPlanInput, NutritionPlanMessage } from "src/webhook/dialogflow/messages/nutrition-plan";
import { FeatureFlagService } from "src/feature-flag/services/feature-flag.service";
import { FeatureFlagKey } from "src/feature-flag/enums/feature-flag.constant";

@Injectable()
export class NutritionPlanService {
    constructor(
        private readonly nutritionPlanRepository: NutritionPlanRepository,
        private readonly nutritionNotificationTimeRepository: NutritionNotificationTimeRepository,
        private readonly mealHistoryService: MealHistoryService,
        private readonly lineMessagingApiService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly featureFlagService: FeatureFlagService,
    ) { }

    async getNutritionPlanByLineUserId(lineUserId: string): Promise<NutritionPlanDto | null> {
        const nutritionPlan = await this.nutritionPlanRepository.findByLineUserId(lineUserId);
        if (!nutritionPlan) {
            return NutritionPlanDto.fromNoRecord(lineUserId);
        }
        return NutritionPlanDto.fromEntity(nutritionPlan);
    }

    @Transactional()
    // TODO: Check this transactional is working or not
    async createOrUpdateNutritionPlan(nutritionPlanDto: NutritionPlanDto): Promise<void> {
        const { notificationTimes } = nutritionPlanDto;
        // Always derive totalCalories from macros to prevent inconsistency
        nutritionPlanDto.totalCalories =
            nutritionPlanDto.protein * 4 +
            nutritionPlanDto.carbohydrate * 4 +
            nutritionPlanDto.fat * 9;
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

        await this.pushNutritionPlanMessage(nutritionPlanDto);
    }

    async findNutritionPlanWithMealsInDay(lineUserId: string, date: string): Promise<NutritionPlanDto | null> {
        const nutritionPlan = await this.nutritionPlanRepository.findByLineUserId(lineUserId);
        if (!nutritionPlan) {
            return NutritionPlanDto.fromNoRecord(lineUserId);
        }
        const nutritionPlanDto = NutritionPlanDto.fromEntityToDto(nutritionPlan);
        nutritionPlanDto.meals = await this.mealHistoryService.findMealsByDate(lineUserId, new Date(date));
        return nutritionPlanDto;
    }

    private async pushNutritionPlanMessage(nutritionPlanDto: NutritionPlanDto): Promise<void> {
        const isPushEnabled = await this.featureFlagService.isEnabled(FeatureFlagKey.PUSH_MESSAGE_FOR_LIFF_ACTION);
        if (!isPushEnabled) return;

        const lineUserId = nutritionPlanDto.line_user_id;
        const groupId = await this.lineGroupMemberService.findGroupIdByMemberLineUserId(lineUserId);
        if (!groupId) return;

        const totalCalories = nutritionPlanDto.totalCalories;
        const carbohydrateCalories = nutritionPlanDto.carbohydrate * 4;
        const proteinCalories = nutritionPlanDto.protein * 4;
        const fatCalories = nutritionPlanDto.fat * 9;

        const input: NutritionPlanInput = {
            totalCalories,
            carbohydrateGrams: nutritionPlanDto.carbohydrate,
            carbohydrateCalories,
            carbohydratePercent: totalCalories > 0 ? (carbohydrateCalories / totalCalories) * 100 : 0,
            proteinGrams: nutritionPlanDto.protein,
            proteinCalories,
            proteinPercent: totalCalories > 0 ? (proteinCalories / totalCalories) * 100 : 0,
            fatGrams: nutritionPlanDto.fat,
            fatCalories,
            fatPercent: totalCalories > 0 ? (fatCalories / totalCalories) * 100 : 0,
        };
        const navigateUrl = this.lineLiffNavigatePathService.getNutritionPlanPage(lineUserId);
        const messages = NutritionPlanMessage(navigateUrl, input);
        await this.lineMessagingApiService.sendPushMessages(groupId, messages);
    }
}
