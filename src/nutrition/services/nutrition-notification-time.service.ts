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
        const bkNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const hour = bkNow.getUTCHours().toString().padStart(2, "0");
        const minute = bkNow.getUTCMinutes().toString().padStart(2, "0");
        const time = `${hour}:${minute}:00`;

        const notificationTimes = await this.nutritionNotificationTimeRepository.findByTimeWithPlan(time);

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

            if (!groupId) {
                console.log(`No group found for user ${lineUserId}. Skipping notification for plan ID ${userPlan.id}`);
            } else {
                await this.lineMessagingApiClientService.sendPushMessages(groupId, messages);
                console.log(`Sent calories intake reminder to user ${lineUserId} for plan ID ${userPlan.id} at time ${notification.sendAt}`);
            }
        }
    }
}