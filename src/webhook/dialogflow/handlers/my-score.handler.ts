import { Injectable } from "@nestjs/common";
import { MessageEvent } from "@line/bot-sdk";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { UserRelationshipsService } from "src/users/services/user-relationships.service";
import { MyScoreMessage } from "../messages/my-score.message";

type ScorePeriod = "daily" | "weekly" | "monthly";

@Injectable()
export class MyScoreHandler implements IntentHandlerInterface {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly userRelationshipsService: UserRelationshipsService,
    ) { }

    private formatThaiDate(date: Date): string {
        return date.toLocaleDateString("th-TH", {
            timeZone: "Asia/Bangkok",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    }

    private extractDatePeriod(parameters?: any): string | null {
        const field = parameters?.fields?.["date-period"];
        if (!field) return null;
        if (typeof field.stringValue === "string" && field.stringValue.trim()) {
            return field.stringValue;
        }
        const listValue = field.listValue?.values;
        if (Array.isArray(listValue) && listValue.length > 0) {
            const first = listValue[0];
            if (typeof first.stringValue === "string" && first.stringValue.trim()) {
                return first.stringValue;
            }
        }
        return null;
    }

    private resolvePeriod(parameters?: any, fallbackText?: string): { period: ScorePeriod; label: string; prefix: string } {
        const raw = `${this.extractDatePeriod(parameters) ?? fallbackText ?? ""}`.toLowerCase();

        if (raw.includes("วันนี้") || raw.includes("today") || raw.includes("daily")) {
            return {
                period: "daily",
                label: this.formatThaiDate(new Date()),
                prefix: "วันที่",
            };
        }

        if (raw.includes("เดือน") || raw.includes("month") || raw.includes("monthly")) {
            return { period: "monthly", label: "เดือนนี้", prefix: "ช่วงเวลา" };
        }

        if (raw.includes("สัปดาห์") || raw.includes("week") || raw.includes("weekly")) {
            return { period: "weekly", label: "สัปดาห์นี้", prefix: "ช่วงเวลา" };
        }

        return { period: "weekly", label: "สัปดาห์นี้", prefix: "ช่วงเวลา" };
    }

    private async buildPayload(lineUserId: string, parameters?: any, fallbackText?: string) {
        const { period, label, prefix } = this.resolvePeriod(parameters, fallbackText);
        const detailUrl = this.lineLiffNavigatePathService.navigateProfilePage;

        const detail = await this.userRelationshipsService.getTraineeDetailByLineUserId(lineUserId);
        const scores = detail.scores[period];

        return MyScoreMessage({
            totalScore: scores.total,
            workoutScore: scores.workout,
            nutritionScore: scores.nutrition,
            periodLabel: label,
            periodPrefix: prefix,
            detailUrl,
        });
    }

    async handleGroupChat(event: MessageEvent, parameters?: any): Promise<void> {
        const groupId = event.source.type === "group" ? event.source.groupId : null;
        const userId = event.source.userId;

        if (!userId || !groupId) return;

        const trainee = await this.lineGroupMemberService.findTraineeInGroup(groupId);
        if (!trainee) return;

        const payload = await this.buildPayload(trainee.lineUserId, parameters, event.message.type === "text" ? event.message.text : undefined);
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, payload);
    }

    async handlePersonalChat(event: MessageEvent, parameters?: any): Promise<void> {
        const userId = event.source.userId;
        if (!userId) return;

        const payload = await this.buildPayload(userId, parameters, event.message.type === "text" ? event.message.text : undefined);
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, payload);
    }
}
