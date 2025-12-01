import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { NutritionNotificationCronJobName } from "../enums/cron-job-name.enum";
import { NutritionNotificationTimeRepository } from "../repositories/nutrition-notification-time.repository";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { CaloriesIntakeReminderMessages } from "../messages/calories-intake-reminder.message";

@Injectable()
export class NutritionNotificationTimeService {
    constructor(
        private readonly nutritionNotificationTimeRepository: NutritionNotificationTimeRepository,
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService
    ) { }

    @Cron(CronExpression.EVERY_30_MINUTES, {
        name: NutritionNotificationCronJobName.CALORIES_INTAKE_REMINDER,
        timeZone: 'Asia/Bangkok'
    })
    async caloriesIntakeReminder(): Promise<void> {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, "0");
        const minute = now.getMinutes().toString().padStart(2, "0");
        const time = `${hour}:${minute}:00`;

        const notificationTimes = await this.nutritionNotificationTimeRepository.findByTimeWithPlan(time);

        for (const notification of notificationTimes) {
            // Now you directly access the related plan
            const userPlan = notification.nutritionPlan;

            // Check if notification is actually needed (based on the needNotification flag)
            if (!userPlan || !userPlan.needNotification) continue;

            const lineUserId = userPlan.lineUserId;
            const messages = CaloriesIntakeReminderMessages(userPlan.totalCalories);

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