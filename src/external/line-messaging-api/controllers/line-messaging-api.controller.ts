import { Controller, Get, Param } from "@nestjs/common";
import { LineMessagingApiGroupChatService } from "../services/group-chat.service";
import { LineMessagingApiUserService } from "../services/user.service";

@Controller('line-messaging-api')
// This controller is for testing purposes only
export class LineMessagingApiController {
    constructor(
        private readonly lineMessagingApiGroupChatService: LineMessagingApiGroupChatService,
        private readonly lineMessagingApiUserService: LineMessagingApiUserService,
    ) {}

    @Get('group-summary/:groupId')
    async testGetGroupChatSummary(
        @Param('groupId') groupId: string
    ): Promise<any> {
        return this.lineMessagingApiGroupChatService.getGroupChatSummary(groupId);
    }

    @Get('group-member-profile/:groupId/:userId')
    async testGetGroupChatMemberProfile(
        @Param('groupId') groupId: string,
        @Param('userId') userId: string
    ): Promise<any> {
        return this.lineMessagingApiGroupChatService.getGroupChatMemberProfile(groupId, userId);
    }

    @Get('profile/:userId')
    async testGetProfile(
        @Param('userId') userId: string
    ): Promise<any> {
        return this.lineMessagingApiUserService.getProfile(userId);
    }
}