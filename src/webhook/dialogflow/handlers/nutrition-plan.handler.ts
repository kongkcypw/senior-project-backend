import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { NutritionPlanMessage } from "../messages/nutrition-plan";

@Injectable()
export class NutritionPlanHandler implements IntentHandlerInterface {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ) { }

    async handleGroupChat(event: any): Promise<void> {
    }

    async handlePersonalChat(event: any): Promise<void> {
        const mockNutritionInput = {
            totalCalories: 2400,
            carbohydrateGrams: 240,
            carbohydrateCalories: 960,
            carbohydratePercent: 40,
            proteinGrams: 180,
            proteinCalories: 720,
            proteinPercent: 30,
            fatGrams: 80,
            fatCalories: 720,
            fatPercent: 30,
        };
        const payload = NutritionPlanMessage("https://example.com/nutrition-details", mockNutritionInput);

        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            payload
        );
    }
}