import { Injectable } from '@nestjs/common';
import { DialogflowClientService } from 'src/external/dialogflow-client/services/client.service';
import { DialogflowConfigService } from 'src/external/dialogflow-client/services/config.service';
import { MessageEvent } from '@line/bot-sdk';
import { DialogflowWebhookGroupChatHandler } from '../handlers/dialogflow-webhook-group-chat.handler';
import { FallbackIntentService } from './fallback-intent.service';
import { DialogflowWebhookPersonalChatHandler } from '../handlers/dialogflow-webhook-personal-chat.handler';
import { ConfidenceFallbackThreshold } from '../constants/intent-detect-confidence';

@Injectable()
export class DialogflowWebhookService {

    constructor(
        private readonly dialogflowClientService: DialogflowClientService,
        private readonly dialogflowConfigService: DialogflowConfigService,
        private readonly dialogflowWebhookGroupChatHandler: DialogflowWebhookGroupChatHandler,
        private readonly dialogflowWebhookPersonalChatHandler: DialogflowWebhookPersonalChatHandler,
        private readonly fallbackIntentService: FallbackIntentService,
    ) { }

    async getFullfilmentTextAndReplyMessage(event: MessageEvent, isGroupChat: boolean): Promise<void> {

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

            console.log(JSON.stringify(result, null, 2));

            if (!result || !result.intent || (result.intentDetectionConfidence && result.intentDetectionConfidence < ConfidenceFallbackThreshold)) {
                // await this.fallbackIntentService.handleFallbackIntent(event.message.text, event);
                console.log('No intent matched. Consider handling fallback intent.');
                return;
            }

            if (result.parameters) {
                const parameters = result.parameters.fields;
                console.log('Extracted Parameters:', parameters);
            }

            if (result.intent.displayName) {
                if (isGroupChat) {
                    await this.dialogflowWebhookGroupChatHandler.handleIntent(result.intent.displayName, event, result.fulfillmentMessages ?? undefined, result.parameters);
                } else {
                    await this.dialogflowWebhookPersonalChatHandler.handleIntent(result.intent.displayName, event, result.fulfillmentMessages ?? undefined, result.parameters);
                }
            }


        } catch (error) {
            console.error('Error handling Dialogflow text event:', error);
        }
    }
}