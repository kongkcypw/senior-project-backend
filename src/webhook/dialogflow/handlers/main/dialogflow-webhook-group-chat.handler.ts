import { Injectable } from "@nestjs/common";
import { DialogflowIntentName } from "../../enums/dialogflow-intent-name";
import { MessageEvent } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { CaloriesInDayHandler } from "../calories-in-day.handler";
import { WorkoutProgramHandler } from "../workout-program.handler";
import { HelpHandler } from "../help.handler";

@Injectable()
export class DialogflowWebhookGroupChatHandler {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,

        private readonly caloriesInDayHandler: CaloriesInDayHandler,
        private readonly workoutProgramHandler: WorkoutProgramHandler,
        private readonly helpHandler: HelpHandler,
    ) { }

    async handleIntent(intentName: string, event: MessageEvent, fulfillmentMessages?: any[], parameters?: any): Promise<void> {

        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.HELP) {
            return this.helpHandler.handleGroupChat(event);
        }

        if (intentName === DialogflowIntentName.CALORIES_IN_DAY) {
            return this.caloriesInDayHandler.handleGroupChat(event);
        }

        if (intentName === DialogflowIntentName.WORKOUT_PROGRAM) {
            return this.workoutProgramHandler.handleGroupChat(event);
        }

        return;
    }
}