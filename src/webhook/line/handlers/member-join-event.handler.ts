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
import { MemberJoinEventFailToGetProfileMessages } from "../messages/member-join-event-fail-to-get-profile.message";

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
        let membersName: string[] = [];

        // get group name from LINE Messaging API
        const groupSummary = await this.lineMessagingApiGroupChatService.getGroupChatSummary(groupId);
        const groupName = groupSummary ? groupSummary.groupName : null;
        const groupPictureUrl = groupSummary ? (groupSummary.pictureUrl ? groupSummary.pictureUrl : null) : null;

        // Save group to database
        await this.lineGroupService.insertGroupIfNotExist(groupId, groupName, groupPictureUrl);

        // Create users for each member
        for(const member of members) {
            const lineUserId = member.userId;
            const profile = await this.lineMessagingApiGroupChatService.getGroupChatMemberProfile(groupId, lineUserId);

            // if fail to get profile, send message and leave group
            if (!profile) {
                console.error(`Could not get profile for userId: ${lineUserId} in groupId: ${groupId}`);
                await this.sendFailToGetProfileMessage(event);
                return;
            }

            const displayName = profile.displayName ? profile.displayName : null;
            const pictureUrl = profile.pictureUrl ? profile.pictureUrl : null;

            membersName.push(displayName ? displayName : '');

            // Save trainee user and group member to database
            // Can't use Promise.all here because we need to wait for user foriegn key constraint
            await this.userService.insertUserIfNotExist(lineUserId, displayName, UserRole.TRAINEE, pictureUrl);
            await this.lineGroupMemberService.insertGroupMemberIfNotExist(groupId, lineUserId);
            
        }

        await this.sendWelcomeMessageToGroup(event, membersName);
    }

    async sendFailToGetProfileMessage(event: MemberJoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            MemberJoinEventFailToGetProfileMessages,
        );
    }

    async sendWelcomeMessageToGroup(event: MemberJoinEvent, membersName: string[]): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            MemberJoinEventMessages(membersName),
        );
    }
}