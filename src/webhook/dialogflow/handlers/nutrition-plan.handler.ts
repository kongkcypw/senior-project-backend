import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { messagingApi } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { NutritionPlanMessage } from "../messages/nutrition-plan";
import { NutritionPlanService } from "src/nutrition/services/nutrition-plan.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";

@Injectable()
export class NutritionPlanHandler implements IntentHandlerInterface {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly nutritionPlanService: NutritionPlanService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
    ) { }

    async handleGroupChat(event: any): Promise<void> {
    }

    async handlePersonalChat(event: any): Promise<void> {
        const userId = event.source.userId;
        if (!userId) return;

        const navigateUrl = this.lineLiffNavigatePathService.getNutritionPlanPage(userId);
        const plan = await this.nutritionPlanService.getNutritionPlanByLineUserId(userId);

        if (!plan || plan.totalCalories === 0) {
            const noPlanMessage: messagingApi.Message[] = [{
                type: "flex",
                altText: "ยังไม่มีแผนโภชนาการ",
                contents: {
                    type: "bubble",
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
                                text: "กรุณาติดต่อเทรนเนอร์เพื่อสร้างแผนโภชนาการของคุณ",
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
                                type: "button",
                                style: "primary",
                                color: "#4270ED",
                                action: {
                                    type: "uri",
                                    label: "ดูแผนโภชนาการ",
                                    uri: navigateUrl,
                                },
                            },
                        ],
                    },
                },
            }];
            await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, noPlanMessage);
            return;
        }

        const carbCalories = plan.carbohydrate * 4;
        const proteinCalories = plan.protein * 4;
        const fatCalories = plan.fat * 9;

        const payload = NutritionPlanMessage(navigateUrl, {
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

        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, payload);
    }
}
