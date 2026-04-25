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

    async handleGroupChat(event: MessageEvent): Promise<void> {

        const groupId = event.source.type === 'group' ? event.source.groupId : null;
        const userId = event.source.userId;
        let navigatePathNutrition: string;
        let navigatePathWorkout: string;

        if (!userId) {
            return;
        }

        if (!groupId) {
            return
        }

        const trainee = await this.lineGroupMemberService.findTraineeInGroup(groupId);

        if (!trainee) {
            return;
        }

        navigatePathNutrition = this.lineLiffNavigatePathService.getManageNutritionProgramPage(trainee.lineUserId);
        navigatePathWorkout = this.lineLiffNavigatePathService.getManageWorkoutProgramPage(trainee.lineUserId);

        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            ManageProgramMessages(navigatePathNutrition, navigatePathWorkout, trainee.displayName)
        );
    }

    async handlePersonalChat(event: MessageEvent): Promise<void> {}
}