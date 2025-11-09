import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { JoinEvent, messagingApi } from "@line/bot-sdk";
import { welcomeToGroupMessage } from "../messages/welcome-to-group-message";
import { WebhookEventSourceType } from "../enums/webhook-event-source-type.enum";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineMessagingApiGroupChatService } from "src/external/line-messaging-api/services/group-chat.service";
import { LineGroupService } from "src/line-group/services/line-group.service";
import { ALLOW_MEMBER_COUNT_ON_INVITE_BOT } from "../constants/allow-member-count-on-invite-bot.constant";

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

        // Save group to database
        await this.lineGroupService.insertGroupIfNotExist(groupId, groupName);

        // Send welcome message to group
        await this.sendWelcomeMessageToGroup(event);
    }

    async isValidGroup(memberCount: number): Promise<boolean> {
        if (memberCount > ALLOW_MEMBER_COUNT_ON_INVITE_BOT){
            return false;
        }
        return true;
    }

    async sendFailToGetMemberCountMessageToGroup(event: JoinEvent): Promise<void> {
        const failToGetMemberCount: messagingApi.Message = {
            type: 'text',
            text: 'ขอโทษครับ เกิดข้อผิดพลาดในการตรวจสอบจำนวนสมาชิกในกลุ่ม กรุณาลองใหม่อีกครั้ง',
        };
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            [failToGetMemberCount],
        );
    }

    async sendInvalidMemberCountMessageToGroup(event: JoinEvent): Promise<void> {
        const invalidMemberCount: messagingApi.Message = {
            type: 'text',
            text: 'ขอโทษครับ กลุ่มนี้ไม่สามารถใช้งานบอทได้ เนื่องจากมีสมาชิกเกินจำนวนที่กำหนดไว้',
        };
        const usageCondition: messagingApi.Message = {
            type: 'text',
            text: 'เงื่อนไขการใช้งานบอท: กลุ่มนี้ต้องสร้างขึ้นมาใหม่โดยมีเทรนเนอร์เพียงคนเดียว และเพิ่มลูกเทรนเข้ามาหลังจากเพิ่มบอทแล้วเท่านั้นครับ',
        };
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            [invalidMemberCount, usageCondition],
        );
    }

    async sendWelcomeMessageToGroup(event: JoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            welcomeToGroupMessage,
        );
    }
}