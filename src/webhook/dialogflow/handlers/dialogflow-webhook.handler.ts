import { Injectable } from "@nestjs/common";
import { DialogflowIntentName } from "../enums/dialogflow-intent-name";
import { TriggerHandler } from "./trigger.handler";
import { MessageEvent } from "@line/bot-sdk";

@Injectable()
export class DialogflowWebhookHandler {
    constructor(
        private readonly triggerHandler: TriggerHandler,
    ){}

    async handleIntent(intentName: string, event: MessageEvent): Promise<any> {

        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.TRIGGER) {
            return this.triggerHandler.handle(event);
        }

        return;
    }
}