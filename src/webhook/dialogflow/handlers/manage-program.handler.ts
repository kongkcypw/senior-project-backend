import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { MessageEvent } from "@line/bot-sdk";
import { ManageProgramMessages } from "../messages/manage-program.message";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";

@Injectable()
export class ManageProgramHandler implements IntentHandlerInterface {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly lineGroupMemberService: LineGroupMemberService,
    ) { }

    async handle(event: MessageEvent): Promise<void> {

        const groupId = event.source.type === 'group' ? event.source.groupId : null;
        const userId = event.source.userId;
        let navigatePath: string;

        if (!userId) {
            return;
        }

        if (!groupId) {
            navigatePath = this.lineLiffNavigatePathService.getManageProgramPage(userId);
            await this.lineMessagingApiClientService.sendReplyMessages(
                event.replyToken,
                ManageProgramMessages(navigatePath)
            );
            return
        }

        const trainee = await this.lineGroupMemberService.findTraineeInGroup(groupId);

        if (!trainee) {
            return;
        }

        navigatePath = this.lineLiffNavigatePathService.getManageProgramPage(trainee.lineUserId);

        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            ManageProgramMessages(navigatePath)
        );
    }

}