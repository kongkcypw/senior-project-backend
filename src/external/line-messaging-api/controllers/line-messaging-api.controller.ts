import { Controller, Get, Param } from "@nestjs/common";
import { LineMessagingApiGroupChatService } from "../services/group-chat.service";

@Controller()
export class LineMessagingApiController {
    constructor(
        private readonly groupChatService: LineMessagingApiGroupChatService,
    ) {}

    @Get('/line-messaging-api/test/group-summary/:groupId')
    async testGetGroupChatSummary(
        @Param('groupId') groupId: string
    ): Promise<any> {
        return this.groupChatService.getGroupChatSummary(groupId);
    }
}