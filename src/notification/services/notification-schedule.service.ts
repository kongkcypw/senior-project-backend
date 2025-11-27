import { Injectable } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { NotificationScheduleCronJobName } from "../enums/cron-job-name.enum";
import { NotificationScheduleEntity } from "../entities/notification-schedule.entity";
import { NotificationScheduleRepository } from "../repositories/notification-schedule.repository";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { CaloriesIntakeReminderMessages } from "../messages/calories-intake-reminder.message";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";

@Injectable()
export class NotificationScheduleService {

  constructor(
    private readonly notificationScheduleRepository: NotificationScheduleRepository,
    private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    private readonly lineGroupMemberService: LineGroupMemberService,
  ){}

  // TODO: Minimize cron job frequency if possible
  @Cron(CronExpression.EVERY_30_MINUTES, { 
  name: NotificationScheduleCronJobName.CALORIES_INTAKE_REMINDER, 
  timeZone: 'Asia/Bangkok' 
  })
  async caloriesIntakeReminder(): Promise<void> {
    const now = new Date();
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");
    const time = `${hour}:${minute}:00`;

    const schedules = await this.notificationScheduleRepository.findCaloriesIntakeReminderByTime(time);

    for (const schedule of schedules) {
      for (const userPlan of schedule.nutritionPlan) {
        const lineUserId = userPlan.lineUserId;
        const messages = CaloriesIntakeReminderMessages(
          userPlan.totalCalories,
        );
        const groupId = await this.lineGroupMemberService.findGroupIdByMemberLineUserId(lineUserId);

        if (!groupId) {
          console.log(`No group found for user ${lineUserId}. Skipping notification for plan ID ${userPlan.id}`);
        } else {
          await this.lineMessagingApiClientService.sendPushMessages(groupId, messages);
          console.log(`Sent calories intake reminder to user ${lineUserId} for plan ID ${userPlan.id}`);
        }
      }
    }
  }
}