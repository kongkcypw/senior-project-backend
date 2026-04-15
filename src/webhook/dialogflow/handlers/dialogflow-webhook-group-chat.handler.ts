import { Injectable } from "@nestjs/common";
import { DialogflowIntentName } from "../enums/dialogflow-intent-name";
import { TriggerHandler } from "./group-chat/trigger.handler";
import { MessageEvent } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { TestProfileMessages } from "../messages/test-profile.message";
import { ManageProgramHandler } from "./group-chat/manage-program.handler";
import { CaloriesInDayHandler } from "./group-chat/calories-in-day.handler";
import { WorkoutProgramHandler } from "./group-chat/workout-program.handler";

@Injectable()
export class DialogflowWebhookGroupChatHandler {
    constructor(
        private readonly triggerHandler: TriggerHandler,
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly manageProgramHandler: ManageProgramHandler,
        private readonly caloriesInDayHandler: CaloriesInDayHandler,
        private readonly workoutProgramHandler: WorkoutProgramHandler
    ) { }

    async handleIntent(intentName: string, event: MessageEvent, fulfillmentMessages?: any[], parameters?: any): Promise<void> {

        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.TRIGGER) {
            return this.triggerHandler.handle(event);
        }

        if (intentName === DialogflowIntentName.MANAGE_PROGRAM) {
            return this.manageProgramHandler.handle(event);
        }

        if (intentName === DialogflowIntentName.TEST_PROFILE) {
            const profileUrl = this.lineLiffNavigatePathService.navigateProfilePage;
            await this.lineMessagingApiClientService.sendReplyMessages(
                event.replyToken,
                TestProfileMessages(profileUrl)
            );
            return;
        }

        if (intentName === DialogflowIntentName.CALORIES_IN_DAY) {
            return this.caloriesInDayHandler.handle(event);
        }

        if (intentName === DialogflowIntentName.WORKOUT_PROGRAM) {
            return this.workoutProgramHandler.handle(event);
        }

        if (intentName === DialogflowIntentName.SAVENOTE && fulfillmentMessages && fulfillmentMessages[0].text.text) {
            await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, [
                {
                    type: 'text',
                    text: fulfillmentMessages[0].text.text[0],
                }
            ]);
        }

        if (fulfillmentMessages && fulfillmentMessages[0].text.text) {
            await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, [
                {
                    type: 'text',
                    text: fulfillmentMessages[0].text.text[0] || '',
                }
            ]);
        }

        if (parameters) {
            console.log('Parameters:', parameters);
        }

        return;
    }
}