import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { FollowEvent } from "@line/bot-sdk";
import { LineMessagingApiConfigService } from "src/external/line-messaging-api/services/config.service";
import { UserService } from "src/users/services/user.service";
import { LineMessagingApiUserService } from "src/external/line-messaging-api/services/user.service";
import { UserRole } from "src/users/enums/user-role.enum";

@Injectable()
export class FollowEventHandler implements EventHandler<FollowEvent> {
    constructor(
        private readonly lineMessagingApiConfigService: LineMessagingApiConfigService,
        private readonly lineMessagingApiUserService: LineMessagingApiUserService,
        private readonly userService: UserService,
    ) { }

    async handle(event: FollowEvent, destination: string): Promise<void> {

        if (!event.source || !event.source.userId) {
            console.warn('Follow event missing userId:', event);
            return;
        }

        const chatbotId = destination;
        const lineUserId = event.source.userId;

        // User add for personal chatbot
        if (chatbotId === this.lineMessagingApiConfigService.chatbotUserId) {

            console.log(`User ${lineUserId} followed the personal chatbot.`);
            const profile = await this.lineMessagingApiUserService.getProfile(lineUserId);

            if (!profile) {
                console.warn(`Failed to get profile for user ${lineUserId}. User will not be added to the database.`);
                return;
            }

            const { displayName, pictureUrl } = profile;

            // For personal chatbot, we only add trainee role users to the database. Trainer role users will be added when they follow the dashboard chatbot.
            await this.userService.insertUserIfNotExist(lineUserId, displayName, UserRole.TRAINEE, pictureUrl || null);
        }

        // User add for dashboard
        if (chatbotId === this.lineMessagingApiConfigService.chatbotDashboardId) {
            console.log(`User ${lineUserId} followed the dashboard chatbot.`);
            const profile = await this.lineMessagingApiUserService.getProfile(lineUserId);

            if (!profile) {
                console.warn(`Failed to get profile for user ${lineUserId}. User will not be added to the database.`);
                return;
            }

            const { displayName, pictureUrl } = profile;

            // For dashboard, we only add trainer role users to the database. Trainee role users will be added when they follow the chatbot.
            await this.userService.insertUserIfNotExist(lineUserId, displayName, UserRole.TRAINER, pictureUrl || null);
        }
    }
}