import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { PostbackEvent } from "@line/bot-sdk";
import { PostbackData } from "../enums/postback-data.enum";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupService } from "src/line-group/services/line-group.service";
import { UserService } from "src/users/services/users.service";
import { PostbackEventAuthenTrainerFalseMessages } from "../messages/postback-event-authen-trainer-false.message";
import { PostbackEventAuthenTrainerTrueMessages } from "../messages/postback-event-authen-trainer-true.message";
import { WebhookEventSourceType } from "../enums/webhook-event-source-type.enum";
import { LineMessagingApiGroupChatService } from "src/external/line-messaging-api/services/group-chat.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { UserRole } from "src/users/enums/user-role.enum";

@Injectable()
export class PostBackEventHandler implements EventHandler<PostbackEvent> {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineMessagingApiGroupChatService: LineMessagingApiGroupChatService,
        private readonly lineGroupService: LineGroupService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly userService: UserService,
    ){}

    async handle(event: PostbackEvent): Promise<void> {
        console.log('Handling Postback Event:', event);
        if (event.postback.data === PostbackData.AUTHENTICATE_TRAINER) {
            await this.processAuthenticationTrainer(event);
        }
    }

    async processAuthenticationTrainer(event: PostbackEvent): Promise<void> {
        const lineUserId = event.source.userId;
        if (!lineUserId) {
            console.error('User ID is undefined in postback event source.');
            return;
        }
        const trainerUser = await this.userService.findTrainerByLineUserId(lineUserId);

        if (!trainerUser) {
            await this.sendUnauthorizedTrainerMessage(event);
            return;
        }

        if(event.source.type !== WebhookEventSourceType.GROUP) {
            console.log('Postback event source is not a group. No action taken.');
            return;
        }

        const groupId = event.source.groupId;

        // get group name from LINE Messaging API
        const groupSummary = await this.lineMessagingApiGroupChatService.getGroupChatSummary(groupId);
        const groupName = groupSummary ? groupSummary.groupName : null;
        const groupPictureUrl = groupSummary ? (groupSummary.pictureUrl ? groupSummary.pictureUrl : null) : null;

        const displayName = trainerUser.displayName ? trainerUser.displayName : null;
        const pictureUrl = trainerUser.pictureUrl ? trainerUser.pictureUrl : null;

        // Save trainer user, group, and group member to database
        // Can't use Promise.all here because we need to wait for user and group foriegn key constraint
        await this.userService.insertUserIfNotExist(lineUserId, displayName, UserRole.TRAINER, pictureUrl);
        await this.lineGroupService.insertGroupIfNotExist(groupId, groupName, groupPictureUrl);
        await this.lineGroupMemberService.insertGroupMemberIfNotExist(groupId, lineUserId);

        await this.sendAuthorizedTrainerMessage(event);
    }

    async sendUnauthorizedTrainerMessage(event: PostbackEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            PostbackEventAuthenTrainerFalseMessages
        );
    }

    async sendAuthorizedTrainerMessage(event: PostbackEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            PostbackEventAuthenTrainerTrueMessages
        );
    }
}