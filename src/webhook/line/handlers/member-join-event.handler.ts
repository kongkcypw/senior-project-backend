import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import type { MemberJoinEvent, messagingApi } from "@line/bot-sdk";
import { MemberJoinEventMessages } from "../messages/member-join-event.message";
import { WebhookEventSourceType } from "../enums/webhook-event-source-type.enum";
import { LineGroupService } from "src/line-group/services/line-group.service";
import { UserService } from "src/users/services/user.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineMessagingApiGroupChatService } from "src/external/line-messaging-api/services/group-chat.service";
import { UserRole } from "src/users/enums/user-role.enum";
import { MemberJoinEventFailToGetProfileMessages } from "../messages/member-join-event-fail-to-get-profile.message";
import { Transactional } from "typeorm-transactional";
import { MemberJoinEventFailToInsertMessages } from "../messages/member-join-event-fail-to-insert.message";
import { ALLOW_MEMBER_COUNT_ON_INVITE_TRAINEE } from "../constants/allow-member-count-on-invite-trainee.constant";
import { ALLOW_MEMBER_COUNT_ON_INVITE_BOT } from "../constants/allow-member-count-on-invite-bot.constant";
import { MemberJoinEventMemberCountExceedMessages } from "../messages/member-join-event-member-count-exceed.message";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { UserRelationshipsService } from "src/users/services/user-relationships.service";

@Injectable()
export class MemberJoinEventHandler implements EventHandler<MemberJoinEvent> {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineMessagingApiGroupChatService: LineMessagingApiGroupChatService,
        private readonly lineLiffNavigationPathService: LineLiffNavigatePathService,
        private readonly userService: UserService,
        private readonly lineGroupService: LineGroupService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly userRelationshipsService: UserRelationshipsService,
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

        const memberCountFromApi = await this.lineMessagingApiGroupChatService.getGroupChatMemberCount(groupId);
        let memberCount: number;

        if (!memberCountFromApi) {
            // With our flow, trainer already in group before inviting bot
            memberCount = ALLOW_MEMBER_COUNT_ON_INVITE_BOT + members.length; 
        } else {
            memberCount = memberCountFromApi;
        }

        if (memberCount > ALLOW_MEMBER_COUNT_ON_INVITE_TRAINEE) {
            await this.sendMemberCountExceedMessage(event);
            return;
        }

        let membersName: string[] = [];
        let firstMemberPictureUrl: string | null = null;

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
            if (firstMemberPictureUrl === null) {
                firstMemberPictureUrl = pictureUrl;
            }

            // Save trainee user and group member to database
            await this.insertUserAndGroupMember(event, lineUserId, displayName, pictureUrl, groupId);

        }

        const navigateUrl = this.lineLiffNavigationPathService.getBodyInformationPage(members[0].userId);
        await this.sendWelcomeMessageToGroup(event, membersName, navigateUrl, firstMemberPictureUrl);
    }

    // Save user and group member in a single transaction
    // If either operation fails, the entire transaction is rolled back
    @Transactional()
    async insertUserAndGroupMember(event: MemberJoinEvent, lineUserId: string, displayName: string | null, pictureUrl: string | null, groupId: string): Promise<void> {
        try {
            await this.userService.insertUserIfNotExist(lineUserId, displayName, UserRole.TRAINEE, pictureUrl);
            await this.userRelationshipsService.insertTrainerRelationshipIfNotExist(groupId, lineUserId);
            await this.lineGroupMemberService.insertGroupMemberIfNotExist(groupId, lineUserId);
        } catch (error) {
            await this.sendFailtoInsertGroupMemberMessage(event)
            throw error; // Rethrow to trigger transaction rollback
        }
    }

    async sendMemberCountExceedMessage(event: MemberJoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            MemberJoinEventMemberCountExceedMessages,
        );
    }

    async sendFailToGetProfileMessage(event: MemberJoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            MemberJoinEventFailToGetProfileMessages,
        );
    }

    async sendWelcomeMessageToGroup(event: MemberJoinEvent, membersName: string[], navigateUrl: string, profileImageUrl?: string | null): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            MemberJoinEventMessages(membersName, navigateUrl, profileImageUrl),
        );
    }

    async sendFailtoInsertGroupMemberMessage(event: MemberJoinEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            MemberJoinEventFailToInsertMessages,
        );
    }
        
}