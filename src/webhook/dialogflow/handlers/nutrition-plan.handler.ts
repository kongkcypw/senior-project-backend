import { Injectable } from "@nestjs/common";
import { MessageEvent } from "@line/bot-sdk";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { messagingApi } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { NutritionPlanMessage } from "../messages/nutrition-plan";
import { NutritionPlanService } from "src/nutrition/services/nutrition-plan.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";

@Injectable()
export class NutritionPlanHandler implements IntentHandlerInterface {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly nutritionPlanService: NutritionPlanService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly lineGroupMemberService: LineGroupMemberService,
    ) { }

    private async buildPayload(lineUserId: string): Promise<messagingApi.Message[]> {
        const navigateUrl = this.lineLiffNavigatePathService.getNutritionPlanPage(lineUserId);
        const plan = await this.nutritionPlanService.getNutritionPlanByLineUserId(lineUserId);

        if (!plan || plan.totalCalories === 0) {
            return [{
                type: "flex",
                altText: "ยังไม่มีแผนโภชนาการ",
                contents: {
                    type: "bubble",
                    styles: {
                        header: { backgroundColor: "#4270ED" },
                    },
                    header: {
                        type: "box",
                        layout: "vertical",
                        paddingAll: "16px",
                        backgroundColor: "#4270ED",
                        contents: [
                            {
                                type: "text",
                                text: "แผนโภชนาการ",
                                weight: "bold",
                                size: "lg",
                                color: "#FFFFFF",
                                wrap: true,
                            },
                        ],
                    },
                    body: {
                        type: "box",
                        layout: "vertical",
                        paddingAll: "16px",
                        contents: [
                            {
                                type: "text",
                                text: "ยังไม่มีแผนโภชนาการ",
                                weight: "bold",
                                size: "lg",
                                wrap: true,
                                color: "#111111",
                            },
                            {
                                type: "text",
                                text: "คุณยังไม่เคยสร้างแผนออกกำลังกาย คลิกปุ่มข้างล่างเพื่อสร้างแผนเพื่อการติดตามที่สะดวกมากขึ้น",
                                size: "md",
                                color: "#555555",
                                wrap: true,
                                margin: "sm",
                            },
                        ],
                    },
                    footer: {
                        type: "box",
                        layout: "vertical",
                        paddingAll: "12px",
                        contents: [
                            {
                                type: "box",
                                layout: "vertical",
                                borderColor: "#4270ED",
                                borderWidth: "normal",
                                cornerRadius: "md",
                                contents: [
                                    {
                                        type: "button",
                                        style: "link",
                                        color: "#4270ED",
                                        height: "sm",
                                        action: {
                                            type: "uri",
                                            label: "รายละเอียด",
                                            uri: navigateUrl,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                },
            }];
        }

        const carbCalories = plan.carbohydrate * 4;
        const proteinCalories = plan.protein * 4;
        const fatCalories = plan.fat * 9;

        return NutritionPlanMessage(navigateUrl, {
            totalCalories: plan.totalCalories,
            carbohydrateGrams: plan.carbohydrate,
            carbohydrateCalories: carbCalories,
            carbohydratePercent: Math.round((carbCalories / plan.totalCalories) * 100),
            proteinGrams: plan.protein,
            proteinCalories: proteinCalories,
            proteinPercent: Math.round((proteinCalories / plan.totalCalories) * 100),
            fatGrams: plan.fat,
            fatCalories: fatCalories,
            fatPercent: Math.round((fatCalories / plan.totalCalories) * 100),
        });
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
