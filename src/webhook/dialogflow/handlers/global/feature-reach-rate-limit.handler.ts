import { MessageEvent } from "@line/bot-sdk";
import { Injectable } from "@nestjs/common";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";

@Injectable()
export class FeatureReachRateLimitHandler {
    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ) { }

    async handle(event: MessageEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, [
            {
                type: 'text',
                text: 'ขออภัยครับ ขุนพันธ์ไม่สามารถให้บริการในขณะนี้เนื่องจากมีผู้ใช้งานจำนวนมากเกินกว่าที่ระบบจะรองรับได้ กรุณาลองใหม่อีกครั้งในภายหลังนะครับ',
            }
        ]);
    }
}