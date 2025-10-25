import { Injectable } from "@nestjs/common";
import { MessageHandler, MessageHandlerContext } from "../interfaces/message-handler.interface";
import { LineWebhookConfigService } from "../services/line-webhook-config.service";
import { messagingApi } from "@line/bot-sdk";

@Injectable()
export class CaloriesHandler implements MessageHandler {
    constructor(
        private readonly lineWebhookConfigService: LineWebhookConfigService,
    ){}

    async handle(
        context: MessageHandlerContext
    ): Promise<messagingApi.Message[]> {
        if(!context.lineUserId){
            console.log('User not authenticated. Cannot fetch calories data.');
            return [{
                type: 'text',
                text: 'กรุณาเชื่อมต่อบัญชีก่อนเพื่อดูข้อมูลแคลอรี่ของคุณ',
            }];
        }
        

        return [{
            type: 'text',
            text: `แคลอรี่ที่คุณได้รับในวันนี้คือ 1,500 แคลอรี่`,
        }]
    }
}