import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { JoinEvent, MemberJoinEvent, messagingApi } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "../services/line-messaging-api-client.service";
import { welcomeToGroupMessage } from "../messages/welcome-to-group-message";
import { welcomeMemberJoinGroupMessage } from "../messages/welcome-member-join-group-message";
import { WebhookEventSourceType } from "../enums/webhook-event-source-type.enum";

@Injectable()
export class MemberJoinEventHandler implements EventHandler<MemberJoinEvent> {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ){}

    async handle(event: MemberJoinEvent): Promise<void> {
        console.log('Handling Member Join Event:', event);
        await this.processMemberJoinEvent(event);
    }

    async processMemberJoinEvent(event: MemberJoinEvent): Promise<void | messagingApi.Message[]> {
        const { source } = event;
        const sourceType = source.type

        // return early if not a group
        if(sourceType !== WebhookEventSourceType.GROUP) {
            console.log('Member join event source is not a group. No action taken.');
            return;
        }

        // Save group and userId info to database
        const groupId = source.groupId;

        await this.sendWelcomeMessageToGroup(event);
    }

    async sendWelcomeMessageToGroup(event: MemberJoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            welcomeMemberJoinGroupMessage,
        );
    }
}