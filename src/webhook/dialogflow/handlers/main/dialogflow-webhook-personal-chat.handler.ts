import { Injectable } from "@nestjs/common";
import { MessageEvent } from "@line/bot-sdk";
import { WorkoutProgramHandler } from "../workout-program.handler";
import { DialogflowIntentName } from "../../enums/dialogflow-intent-name";

@Injectable()
export class DialogflowWebhookPersonalChatHandler {
    constructor(
        private readonly workoutProgramHandler: WorkoutProgramHandler,
    ) { }

    async handleIntent(intentName: string, event: MessageEvent, fulfillmentMessages?: any[], parameters?: any): Promise<void> {
        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.WORKOUT_PROGRAM) {
            return this.workoutProgramHandler.handlePersonalChat(event);
        }
    }
}