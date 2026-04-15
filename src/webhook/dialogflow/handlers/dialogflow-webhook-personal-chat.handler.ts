import { Injectable } from "@nestjs/common";
import { MessageEvent } from "@line/bot-sdk";

@Injectable()
export class DialogflowWebhookPersonalChatHandler {
    constructor(
    ) { }

    async handleIntent(intentName: string, event: MessageEvent, fulfillmentMessages?: any[], parameters?: any): Promise<void> {
    }
}