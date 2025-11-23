import { Injectable } from "@nestjs/common";
import { EventHandler } from "../interfaces/event-handler.interface";
import { PostbackEvent } from "@line/bot-sdk";
import { PostbackData } from "../enums/postback-data.enum";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupService } from "src/line-group/services/line-group.service";
import { UserService } from "src/users/services/user.service";
import { PostbackEventAuthenTrainerFalseMessages } from "../messages/postback-event-authen-trainer-false.message";
import { PostbackEventAuthenTrainerTrueMessages } from "../messages/postback-event-authen-trainer-true.message";
import { WebhookEventSourceType } from "../enums/webhook-event-source-type.enum";
import { LineMessagingApiGroupChatService } from "src/external/line-messaging-api/services/group-chat.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { UserRole } from "src/users/enums/user-role.enum";
import { Transactional } from "typeorm-transactional";
import { PostbackEventAuthenTrainerFailToInsertMessages } from "../messages/postback-event-authen-trainer-fail-to-insert.message";

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

        try {
            // Save trainer user to group member to database
            await this.lineGroupMemberService.insertGroupMemberIfNotExist(groupId, lineUserId);
            await this.sendAuthorizedTrainerMessage(event);
        } catch (error) {
            await this.sendFailToInsertGroupMemberMessage(event);
        }
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

    async sendFailToInsertGroupMemberMessage(event: PostbackEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            PostbackEventAuthenTrainerFailToInsertMessages
        );
    }
}