import { MessageEvent } from "@line/bot-sdk";
import { Injectable } from "@nestjs/common";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";

@Injectable()
export class FeatureDisableHandler implements IntentHandlerInterface {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ) { }

    async handleGeneral(event: MessageEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, [
            {
                type: 'text',
                text: 'ขออภัยครับ ขุนพันธ์ยังไม่พร้อมให้บริการในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลังนะครับ',
            }
        ]);
    }
}