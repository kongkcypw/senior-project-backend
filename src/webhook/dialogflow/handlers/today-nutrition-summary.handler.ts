import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { messagingApi } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { TodayNutritionSummaryMessage } from "../messages/today-nutrition-summary.message";
import { NutritionPlanService } from "src/nutrition/services/nutrition-plan.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";

@Injectable()
export class TodayNutritionSummaryHandler implements IntentHandlerInterface {

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

        const planNavigateUrl = this.lineLiffNavigatePathService.getNutritionInDayPage(userId);

        const now = new Date();
        const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        const planWithMeals = await this.nutritionPlanService.findNutritionPlanWithMealsInDay(userId, dateStr);

        if (!planWithMeals || planWithMeals.totalCalories === 0) {
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
                                    uri: planNavigateUrl,
                                },
                            },
                        ],
                    },
                },
            }];
            await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, noPlanMessage);
            return;
        }

        const meals = planWithMeals.meals ?? [];
        const intake = {
            calories: meals.reduce((sum, m) => sum + m.calories, 0),
            carbohydrate: meals.reduce((sum, m) => sum + m.carbohydrate, 0),
            protein: meals.reduce((sum, m) => sum + m.protein, 0),
            fat: meals.reduce((sum, m) => sum + m.fat, 0),
        };

        const plan = {
            calories: planWithMeals.totalCalories,
            carbohydrate: planWithMeals.carbohydrate,
            protein: planWithMeals.protein,
            fat: planWithMeals.fat,
        };

        const mealItems = meals.map(m => ({
            mealName: m.foodTitle,
            imageUrl: m.imageUrl ?? "",
            detailUrl: this.lineLiffNavigatePathService.getMealDetailPage(userId, m.id.toString()),
            calories: m.calories,
            carbohydrate: m.carbohydrate,
            protein: m.protein,
            fat: m.fat,
        }));

        const clamp = (actual: number, target: number) =>
            target > 0 ? Math.min(actual / target, 1) : 0;

        const nutritionScore = (
            clamp(intake.calories, planWithMeals.totalCalories)
            + clamp(intake.protein, planWithMeals.protein)
            + clamp(intake.carbohydrate, planWithMeals.carbohydrate)
            + clamp(intake.fat, planWithMeals.fat)
        ) / 4 * 50;

        const payload = TodayNutritionSummaryMessage(
            planNavigateUrl,
            intake,
            plan,
            mealItems,
            nutritionScore,
        );
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, payload);
    }
}
