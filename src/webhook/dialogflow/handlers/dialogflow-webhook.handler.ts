import { Injectable } from "@nestjs/common";
import { DialogflowIntentName } from "../enums/dialogflow-intent-name";
import { TriggerHandler } from "./trigger.handler";
import { Response } from "express";

@Injectable()
export class DialogflowWebhookHandler {
    constructor(
        private readonly triggerHandler: TriggerHandler,
    ){}

    async handleIntent(res: Response, intentName: string | null): Promise<any> {

        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.TRIGGER) {
            return this.triggerHandler.handle(res);
        }

        return;
    }
}