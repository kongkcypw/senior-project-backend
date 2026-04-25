import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { TodayNutritionSummaryMessage } from "../messages/today-nutrition-summary.message";

@Injectable()
export class TodayNutritionSummaryHandler implements IntentHandlerInterface {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ) { }

    async handleGroupChat(event: any): Promise<void> {
        // Implement logic to fetch today's nutrition summary and reply to the group chat
        console.log('Handling today nutrition summary for group chat');
    }

    async handlePersonalChat(event: any): Promise<void> {

        const navigateUrl = "https://example.com/nutrition-details";

        const intake = {
            calories: 550,
            carbohydrate: 52,
            protein: 29,
            fat: 20,
        };

        const plan = {
            calories: 550,
            carbohydrate: 60,
            protein: 35,
            fat: 18,
        };

        const payload = TodayNutritionSummaryMessage(
            navigateUrl,
            intake,
            plan,
            [
                {
                    mealName: "ข้าวมันไก่",
                    imageUrl: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=1200&q=80",
                    detailUrl: "https://example.com/meal-detail/1",
                    calories: 550,
                    carbohydrate: 52,
                    protein: 29,
                    fat: 20
                },
                {
                    mealName: "ข้าวผัดหมู",
                    imageUrl: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1200&q=80",
                    detailUrl: "https://example.com/meal-detail/2",
                    calories: 530,
                    carbohydrate: 44,
                    protein: 23,
                    fat: 24,
                }
            ]
        )

        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            payload
        );
    }
}