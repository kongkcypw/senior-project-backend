import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { NutritionNotificationCronJobName } from "../enums/cron-job-name.enum";
import { NutritionNotificationTimeRepository } from "../repositories/nutrition-notification-time.repository";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { CaloriesIntakeReminderMessages } from "../messages/calories-intake-reminder.message";
import { MealHistoryService } from "./meal-history.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";

@Injectable()
export class NutritionNotificationTimeService {
    constructor(
        private readonly nutritionNotificationTimeRepository: NutritionNotificationTimeRepository,
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly mealHistoryService: MealHistoryService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService
    ) { }

    @Cron(CronExpression.EVERY_30_MINUTES, {
        name: NutritionNotificationCronJobName.CALORIES_INTAKE_REMINDER,
        timeZone: 'Asia/Bangkok'
    })
    async caloriesIntakeReminder(): Promise<void> {
        const WINDOW_MINUTES = 5;
        const bkNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const currentTotalMinutes = bkNow.getUTCHours() * 60 + bkNow.getUTCMinutes();

        const toTimeStr = (totalMinutes: number): string => {
            const normalized = ((totalMinutes % 1440) + 1440) % 1440;
            const h = Math.floor(normalized / 60).toString().padStart(2, "0");
            const m = (normalized % 60).toString().padStart(2, "0");
            return `${h}:${m}:00`;
        };

        const startMinutes = currentTotalMinutes - WINDOW_MINUTES;
        const endMinutes = currentTotalMinutes + WINDOW_MINUTES;
        const wrapsAround = startMinutes < 0 || endMinutes >= 1440;
        const startTime = toTimeStr(startMinutes);
        const endTime = toTimeStr(endMinutes);

        const notificationTimes = await this.nutritionNotificationTimeRepository.findByTimeRangeWithPlan(startTime, endTime, wrapsAround);

        for (const notification of notificationTimes) {
            // Now you directly access the related plan
            const userPlan = notification.nutritionPlan;

            // Check if notification is actually needed (based on the needNotification flag)
            if (!userPlan || !userPlan.needNotification) continue;

            const lineUserId = userPlan.lineUserId;
            const meals = await this.mealHistoryService.findMealsByDate(lineUserId, new Date());
            const totalCaloriesIntake = meals.reduce((total, meal) => total + meal.calories, 0);
            const remainingCalories = userPlan.totalCalories - totalCaloriesIntake;
            const navigatePath = this.lineLiffNavigatePathService.getNutritionInDayPage(lineUserId);
            const messages = CaloriesIntakeReminderMessages(userPlan.totalCalories, totalCaloriesIntake, remainingCalories, navigatePath);

            const groupId = await this.lineGroupMemberService.findGroupIdByMemberLineUserId(lineUserId);
            const destination = groupId ?? lineUserId;
            await this.lineMessagingApiClientService.sendPushMessages(destination, messages);
            console.log(`Sent calories intake reminder to ${groupId ? `group ${groupId}` : `personal chat ${lineUserId}`} for plan ID ${userPlan.id} at time ${notification.sendAt}`);
        }
    }
}