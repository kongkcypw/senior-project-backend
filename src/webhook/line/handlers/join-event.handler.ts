import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { JoinEvent, messagingApi } from "@line/bot-sdk";
import { JoinEventMessages } from "../messages/join-event.message";
import { WebhookEventSourceType } from "../enums/webhook-event-source-type.enum";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineMessagingApiGroupChatService } from "src/external/line-messaging-api/services/group-chat.service";
import { LineGroupService } from "src/line-group/services/line-group.service";
import { ALLOW_MEMBER_COUNT_ON_INVITE_BOT } from "../constants/allow-member-count-on-invite-bot.constant";
import { JoinEventInvalidMemberCountMessages } from "../messages/join-event-invalid-member-count.message";
import { JoinEventFailToGetMemberCount } from "../messages/join-event-fail-to-get-member-count.message";
import { JoinEventFailToInsertMessages } from "../messages/join-event-fail-to-insert.message";

@Injectable()
export class JoinEventHandler implements EventHandler<JoinEvent> {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineMessagingApiGroupChatService: LineMessagingApiGroupChatService,
        private readonly lineGroupService: LineGroupService,
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

        const groupId = source.groupId;

        // get group member count
        const memberCount = await this.lineMessagingApiGroupChatService.getGroupChatMemberCount(groupId);

        // if fail to get member count, send message and leave group
        if(!memberCount){
            await this.sendFailToGetMemberCountMessageToGroup(event);
            await this.lineMessagingApiGroupChatService.leaveGroupChat(groupId);
            return;
        }

        const isValidGroup = await this.isValidGroup(memberCount);

        // if invalid group, send message and leave group
        if(!isValidGroup){
            await this.sendInvalidMemberCountMessageToGroup(event);
            await this.lineMessagingApiGroupChatService.leaveGroupChat(groupId);
            return;
        }

        // get group name from LINE Messaging API
        const groupSummary = await this.lineMessagingApiGroupChatService.getGroupChatSummary(groupId);
        const groupName = groupSummary ? groupSummary.groupName : null;
        const groupPictureUrl = groupSummary ? (groupSummary.pictureUrl ? groupSummary.pictureUrl : null) : null;

        try{
            // Save group to database
            await this.lineGroupService.insertGroupIfNotExist(groupId, groupName, groupPictureUrl);
            await this.sendWelcomeMessageToGroup(event);
        } catch (error) {
            await this.sendFailToInsertGroupMessage(event);
        }
    }

    async isValidGroup(memberCount: number): Promise<boolean> {
        if (memberCount > ALLOW_MEMBER_COUNT_ON_INVITE_BOT){
            return false;
        }
        return true;
    }

    async sendFailToGetMemberCountMessageToGroup(event: JoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            JoinEventFailToGetMemberCount,
        );
    }

    async sendInvalidMemberCountMessageToGroup(event: JoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            JoinEventInvalidMemberCountMessages,
        );
    }

    async sendWelcomeMessageToGroup(event: JoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            JoinEventMessages,
        );
    }

    async sendFailToInsertGroupMessage(event: JoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            JoinEventFailToInsertMessages,
        );
    }
}