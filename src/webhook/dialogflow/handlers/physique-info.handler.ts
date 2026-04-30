import { Injectable } from "@nestjs/common";
import { MessageEvent } from "@line/bot-sdk";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { UserPhysiqueHistoryService } from "src/users/services/user-physique-history.service";
import { UserService } from "src/users/services/user.service";
import { PhysiqueInfoMessage } from "../messages/physique-info.message";

@Injectable()
export class PhysiqueInfoHandler implements IntentHandlerInterface {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly userPhysiqueHistoryService: UserPhysiqueHistoryService,
        private readonly userService: UserService,
    ) { }

    private formatThaiDate(date: Date): string {
        return date.toLocaleDateString("th-TH", {
            timeZone: "Asia/Bangkok",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    private async buildPayload(lineUserId: string) {
        const navigateUrl = this.lineLiffNavigatePathService.getBodyInformationPage(lineUserId);
        const [physiqueHistory, userInfo] = await Promise.all([
            this.userPhysiqueHistoryService.getPhysiqueHistoryByLineUserId(lineUserId),
            this.userService.findByLineUserId(lineUserId),
        ]);

        if (!physiqueHistory.length) {
            return PhysiqueInfoMessage(null, userInfo.pictureUrl ?? null, navigateUrl);
        }

        const latest = physiqueHistory[0];
        const updatedAtText = this.formatThaiDate(new Date(latest.updatedAt));

        return PhysiqueInfoMessage(
            {
                heightCm: latest.height,
                weightKg: latest.weight,
                bodyFatPercentage: latest.bodyFatPercentage ?? null,
                goal: latest.goal ?? null,
                updatedAtText,
            },
            userInfo.pictureUrl ?? null,
            navigateUrl,
        );
    }

    async handleGroupChat(event: MessageEvent): Promise<void> {
        const groupId = event.source.type === "group" ? event.source.groupId : null;
        const userId = event.source.userId;

        if (!userId || !groupId) return;

        const trainee = await this.lineGroupMemberService.findTraineeInGroup(groupId);
        if (!trainee) return;

        const payload = await this.buildPayload(trainee.lineUserId);
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, payload);
    }

    async handlePersonalChat(event: MessageEvent): Promise<void> {
        const userId = event.source.userId;
        if (!userId) return;

        const payload = await this.buildPayload(userId);
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, payload);
    }
}
