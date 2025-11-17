import { Injectable } from '@nestjs/common';
import { DialogflowClientService } from 'src/external/dialogflow-client/services/client.service';
import { DialogflowConfigService } from 'src/external/dialogflow-client/services/config.service';
import { LineMessagingApiClientService } from 'src/external/line-messaging-api/services/client.service';
import { MessageEvent } from '@line/bot-sdk';

@Injectable()
export class DialogflowWebhookService {

    constructor(
        private readonly dialogflowClientService: DialogflowClientService,
        private readonly dialogflowConfigService: DialogflowConfigService,
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ) {}

    async getFullfilmentTextAndReplyMessage(event: MessageEvent): Promise<void> {

        if (event.message.type !== 'text') {
            return;
        }

        try {
            const dialogflowClient = this.dialogflowClientService.createSessionsClient();
            const sessionPath = dialogflowClient.projectAgentSessionPath(
                this.dialogflowConfigService.projectId,
                event.source.userId || 'default-session',
            )

            const request = {
                session: sessionPath,
                queryInput: {
                    text: {
                        text: event.message.text,
                        languageCode: 'th',
                    },
                },
            };

            const responses = await dialogflowClient.detectIntent(request);
            const result = responses[0].queryResult;

            console.log(`Dialogflow response for user ${event.source.userId}:`);
            console.log(` Response: ${result?.fulfillmentText}`);

            if(result?.fulfillmentText){
                await this.lineMessagingApiClientService.sendReplyMessages(
                    event.replyToken,
                    [{
                        type: 'text',
                        text: result.fulfillmentText,
                    }],
                );
            }
        } catch (error) {
            console.error('Error handling Dialogflow text event:', error);
        }
    }
}