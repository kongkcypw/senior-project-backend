import { MessageEvent } from "@line/bot-sdk";
import { Injectable } from "@nestjs/common";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";

@Injectable()
export class FeatureDisableHandler {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ) { }

    async handle(event: MessageEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, [
            {
                type: 'text',
                text: 'ขออภัยครับ ขุนพันธ์ยังไม่พร้อมให้บริการในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลังนะครับ',
            }
        ]);
    }
}