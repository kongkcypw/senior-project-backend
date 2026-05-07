import { Injectable, NotFoundException } from "@nestjs/common";
import { MealHistoryRepository } from "../repositories/meal-history.repository";
import { MealHistoryEntity } from "../entities/meal-history.entity";
import { Between } from "typeorm";
import { MealDetailDto } from "../dto/meal-detail.dto";
import { UserRelationshipsRepository } from "src/users/repositories/user-relationships.repository";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { FeatureFlagService } from "src/feature-flag/services/feature-flag.service";
import { FeatureFlagKey } from "src/feature-flag/enums/feature-flag.constant";

@Injectable()
export class MealHistoryService {
    constructor(
        private readonly mealHistoryRepository: MealHistoryRepository,
        private readonly userRelationshipsRepository: UserRelationshipsRepository,
        private readonly lineMessagingApiService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly featureFlagService: FeatureFlagService,
    ) { }

    async findMealDetailByMealId(id: number): Promise<MealDetailDto> {
        const meal = await this.mealHistoryRepository.findOne({ where: { id } });

        if (!meal) {
            throw new NotFoundException(`Meal with id ${id} not found`);
        }
        const mealDto = MealDetailDto.fromEntityToDto(meal);

        return mealDto;
    }

    async insertMealHistory(mealData: Partial<MealHistoryEntity>): Promise<MealDetailDto> {
        const meal = this.mealHistoryRepository.create(mealData);

        // Auto-confirm for personal-use trainees (no active trainer relationship)
        if (mealData.lineUserId) {
            const activeRelationship = await this.userRelationshipsRepository.findActiveRelationshipsByTrainee(mealData.lineUserId);
            meal.confirmAt = activeRelationship === null ? new Date() : null;
        } else {
            meal.confirmAt = null;
        }

        const insertedMeal = await this.mealHistoryRepository.save(meal);
        const mealDto = MealDetailDto.fromEntityToDto(insertedMeal);
        return mealDto;
    }

    async confirmMeal(id: number, mealData: Partial<MealHistoryEntity>): Promise<MealDetailDto> {
        const existingMeal = await this.mealHistoryRepository.findOne({ where: { id } });
        const lineUserId = existingMeal?.lineUserId ?? (mealData as any).lineUserId;

        const meal = this.mealHistoryRepository.create(mealData);
        meal.confirmAt = new Date();
        const updatedMeal = await this.mealHistoryRepository.save(meal);
        const mealDto = MealDetailDto.fromEntityToDto(updatedMeal);

        const isPushEnabled = await this.featureFlagService.isEnabled(FeatureFlagKey.PUSH_MESSAGE_FOR_LIFF_ACTION);
        if (isPushEnabled && lineUserId) {
            const groupId = await this.lineGroupMemberService.findGroupIdByMemberLineUserId(lineUserId);
            if (groupId) {
                await this.lineMessagingApiService.sendPushMessages(groupId, [
                    { type: 'text', text: 'เทรนเนอร์ได้ตรวจสอบและยืนยันโภชนาการอาหารมื้อนี้ของคุณแล้ว' },
                ]);
            }
        }

        return mealDto;
    }

    async findMealsByDate(lineUserId: string, date: Date): Promise<MealDetailDto[]> {
        const BANGKOK_OFFSET_MS = 7 * 60 * 60 * 1000;
        const bangkokTime = new Date(date.getTime() + BANGKOK_OFFSET_MS);
        const year = bangkokTime.getUTCFullYear();
        const month = bangkokTime.getUTCMonth();
        const day = bangkokTime.getUTCDate();
        const startOfDay = new Date(Date.UTC(year, month, day) - BANGKOK_OFFSET_MS);
        const endOfDay = new Date(Date.UTC(year, month, day + 1) - BANGKOK_OFFSET_MS);
        const meals = await this.mealHistoryRepository.find({ where: { lineUserId, createdAt: Between(startOfDay, endOfDay) } });

        const mealsDto = meals.map(meal => MealDetailDto.fromEntityToDto(meal));
        return mealsDto;
    }

    async findMealsByDateRange(lineUserId: string, startDate: Date, endDate: Date): Promise<MealDetailDto[]> {
        const meals = await this.mealHistoryRepository.find({
            where: { lineUserId, createdAt: Between(startDate, endDate) },
            order: { createdAt: 'DESC' },
        });
        return meals.map(meal => MealDetailDto.fromEntityToDto(meal));
    }
}
