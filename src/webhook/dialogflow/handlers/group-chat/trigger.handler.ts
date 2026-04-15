import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../../interfaces/intent-handler.interface";
import { Response } from "express";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { MessageEvent } from "@line/bot-sdk";

@Injectable()
export class TriggerHandler implements IntentHandlerInterface {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ){}

    async handle(event: MessageEvent): Promise<void> {

        const replyText = 'ขุนพันธ์มาแล้วครับ! มีอะไรให้ช่วยไหมครับ?';

        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            [{
                type: 'text',
                text: replyText,
            }],
        );
    }
}