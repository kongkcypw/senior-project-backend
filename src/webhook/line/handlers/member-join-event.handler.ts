import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { JoinEvent, MemberJoinEvent, messagingApi } from "@line/bot-sdk";
import { MemberJoinEventMessages } from "../messages/member-join-event.message";
import { WebhookEventSourceType } from "../enums/webhook-event-source-type.enum";
import { LineGroupService } from "src/line-group/services/line-group.service";
import { UserService } from "src/users/services/users.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineMessagingApiGroupChatService } from "src/external/line-messaging-api/services/group-chat.service";
import { UserRole } from "src/users/enums/user-role.enum";

@Injectable()
export class MemberJoinEventHandler implements EventHandler<MemberJoinEvent> {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineMessagingApiGroupChatService: LineMessagingApiGroupChatService,
        private readonly userService: UserService,
        private readonly lineGroupService: LineGroupService,
        private readonly lineGroupMemberService: LineGroupMemberService,
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

        const groupId = source.groupId;
        const members = event.joined.members;

        // get group name from LINE Messaging API
        const groupSummary = await this.lineMessagingApiGroupChatService.getGroupChatSummary(groupId);
        const groupName = groupSummary ? groupSummary.groupName : null;

        // Save group to database
        await this.lineGroupService.insertGroupIfNotExist(groupId, groupName);

        // Create users for each member
        for(const member of members) {
            const lineUserId = member.userId;
            await Promise.all([
                this.userService.insertUserIfNotExist(lineUserId, UserRole.TRAINEE),
                this.lineGroupMemberService.insertGroupMemberIfNotExist(groupId, lineUserId)
            ]);
        }

        await this.sendWelcomeMessageToGroup(event);
    }

    async sendWelcomeMessageToGroup(event: MemberJoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            MemberJoinEventMessages,
        );
    }
}