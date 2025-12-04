import { Injectable } from '@nestjs/common';
import { DialogflowClientService } from 'src/external/dialogflow-client/services/client.service';
import { DialogflowConfigService } from 'src/external/dialogflow-client/services/config.service';
import { MessageEvent } from '@line/bot-sdk';
import { DialogflowWebhookHandler } from '../handlers/dialogflow-webhook.handler';

@Injectable()
export class DialogflowWebhookService {

    constructor(
        private readonly dialogflowClientService: DialogflowClientService,
        private readonly dialogflowConfigService: DialogflowConfigService,
        private readonly dialogflowWebhookHandler: DialogflowWebhookHandler,
    ) { }

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

            if (!result) {
                return;
            }

            if (!result.intent) {
                return;
            }

            if (result.parameters) {
                const parameters = result.parameters.fields;
                console.log('Extracted Parameters:', parameters);
            }

            if (result.intent.displayName) {
                await this.dialogflowWebhookHandler.handleIntent(result.intent.displayName, event, result.fulfillmentMessages ?? undefined, result.parameters);
            }

        } catch (error) {
            console.error('Error handling Dialogflow text event:', error);
        }
    }
}