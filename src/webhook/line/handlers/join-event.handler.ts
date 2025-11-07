import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { JoinEvent, messagingApi } from "@line/bot-sdk";
import { welcomeToGroupMessage } from "../messages/welcome-to-group-message";
import { WebhookEventSourceType } from "../enums/webhook-event-source-type.enum";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";

@Injectable()
export class JoinEventHandler implements EventHandler<JoinEvent> {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ){}

    async handle(event: JoinEvent): Promise<void> {
        console.log('Handling Join Event:', event);
        await this.processJoinEvent(event);
    }

    async processJoinEvent(event: JoinEvent): Promise<void | messagingApi.Message[]> {
        const { source } = event;
        const sourceType = source.type

        // return early if not a group
        if(sourceType !== WebhookEventSourceType.GROUP) {
            console.log('Join event source is not a group. No action taken.');
            return;
        }

        // Save group info to database
        const groupId = source.groupId;

        await this.sendWelcomeMessageToGroup(event);
    }

    async sendWelcomeMessageToGroup(event: JoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            welcomeToGroupMessage,
        );
    }
}