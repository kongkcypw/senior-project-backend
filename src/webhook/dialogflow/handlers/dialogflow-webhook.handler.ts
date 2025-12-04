import { Injectable } from "@nestjs/common";
import { DialogflowIntentName } from "../enums/dialogflow-intent-name";
import { TriggerHandler } from "./trigger.handler";
import { MessageEvent } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { TestProfileMessages } from "../messages/test-profile.message";
import { ManageProgramHandler } from "./manage-program.handler";

@Injectable()
export class DialogflowWebhookHandler {
    constructor(
        private readonly triggerHandler: TriggerHandler,
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly manageProgramHandler: ManageProgramHandler
    ) { }

    async handleIntent(intentName: string, event: MessageEvent, fulfillmentMessages?: any[], parameters?: any): Promise<void> {

        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.TRIGGER) {
            return this.triggerHandler.handle(event);
        }

        if (intentName === DialogflowIntentName.TRIGGER_MANAGE_PROGRAM) {
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

        if (intentName === DialogflowIntentName.SAVENOTE && fulfillmentMessages && fulfillmentMessages[0].text.text) {
            await this.lineMessagingApiClientService.sendReplyMessages(event.replyToken, [
                {
                    type: 'text',
                    text: fulfillmentMessages[0].text.text[0],
                    // quickReply: {
                    //     items: [
                    //         {
                    //             type: 'action',
                    //             action: {
                    //                 type: 'message',
                    //                 label: 'ข้อมูลร่างกาย',
                    //                 text: 'ข้อมูลร่างกาย',
                    //             },
                    //         },
                    //         {
                    //             type: 'action',
                    //             action: {
                    //                 type: 'message',
                    //                 label: 'ข้อมูลโภชนาการ',
                    //                 text: 'ข้อมูลโภชนาการ',
                    //             },
                    //         },
                    //         {
                    //             type: 'action',
                    //             action: {
                    //                 type: 'message',
                    //                 label: 'ข้อมูลการออกกำลังกาย',
                    //                 text: 'ข้อมูลการออกกำลังกาย',
                    //             }
                    //         }
                    //     ],
                    // }
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