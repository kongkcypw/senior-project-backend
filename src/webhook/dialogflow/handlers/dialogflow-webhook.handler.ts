import { Injectable } from "@nestjs/common";
import { DialogflowIntentName } from "../enums/dialogflow-intent-name";
import { TriggerHandler } from "./trigger.handler";
import { MessageEvent } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { TestProfileMessages } from "../messages/test-profile.message";

@Injectable()
export class DialogflowWebhookHandler {
    constructor(
        private readonly triggerHandler: TriggerHandler,
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
    ) { }

    async handleIntent(intentName: string, event: MessageEvent): Promise<any> {

        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.TRIGGER) {
            return this.triggerHandler.handle(event);
        }

        if (intentName === DialogflowIntentName.TEST_PROFILE) {
            const profileUrl = this.lineLiffNavigatePathService.navigateProfilePage;
            await this.lineMessagingApiClientService.sendReplyMessages(
                event.replyToken,
                TestProfileMessages(profileUrl)
            );
        }

        return;
    }
}