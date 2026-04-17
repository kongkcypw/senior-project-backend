import { Injectable } from '@nestjs/common';
import { DialogflowClientService } from 'src/external/dialogflow-client/services/client.service';
import { DialogflowConfigService } from 'src/external/dialogflow-client/services/config.service';
import { MessageEvent } from '@line/bot-sdk';
import { DialogflowWebhookGroupChatHandler } from '../handlers/dialogflow-webhook-group-chat.handler';
import { FallbackIntentService } from './fallback-intent.service';
import { DialogflowWebhookPersonalChatHandler } from '../handlers/dialogflow-webhook-personal-chat.handler';
import { ConfidenceFallbackThreshold } from '../constants/intent-detect-confidence';
import { FeatureFlagService } from 'src/feature-flag/services/feature-flag.service';
import { FeatureFlagKey } from 'src/feature-flag/enums/feature-flag.constant';
import { FeatureDisableHandler } from '../handlers/global/feature-disable.handler';
import { FeatureRateLimitService } from 'src/feature-rate-limit/services/feature-rate-limit.service';
import { FeatureRateLimitKey } from 'src/feature-rate-limit/enums/feature-rate-limit.enum';
import { FeatureReachRateLimitHandler } from '../handlers/global/feature-reach-rate-limit.handler';

@Injectable()
export class DialogflowWebhookService {

    constructor(
        private readonly dialogflowClientService: DialogflowClientService,
        private readonly dialogflowConfigService: DialogflowConfigService,
        private readonly dialogflowWebhookGroupChatHandler: DialogflowWebhookGroupChatHandler,
        private readonly dialogflowWebhookPersonalChatHandler: DialogflowWebhookPersonalChatHandler,
        private readonly fallbackIntentService: FallbackIntentService,
        private readonly featureFlagService: FeatureFlagService,
        private readonly featureDisableHandler: FeatureDisableHandler,
        private readonly featureRateLimitService: FeatureRateLimitService,
        private readonly featureReachRateLimitHandler: FeatureReachRateLimitHandler,
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

            // Route to RAG fallback when any of the following is true:
            // 1. !result || !result.intent       — Dialogflow returned no result at all (unexpected error / empty response)
            // 2. displayName === 'Default Fallback Intent' — Dialogflow is certain no trained intent matches (confidence: 1 but it is a fallback)
            // 3. confidence < threshold           — Dialogflow guessed a real intent but is not confident enough;
            //                                       treat ambiguous matches (e.g. "อยากปรับโปรแกรม..." hitting WorkoutProgram at 0.42) as fallback
            if (!result || !result.intent || result.intent.displayName === 'Default Fallback Intent' || (result.intentDetectionConfidence ?? 0) < ConfidenceFallbackThreshold) {
                const isRagEnabled = await this.featureFlagService.isEnabled(FeatureFlagKey.RAG_LLM_SERVICE);
                if (!isRagEnabled) {
                    await this.featureDisableHandler.handle(event);
                    console.warn('RAG LLM Service is disabled. Handling fallback intent with feature disable handler.');
                    return;
                }
                const isRateLimitReached = await this.featureRateLimitService.isLimitReached(FeatureRateLimitKey.RAG_LLM_SERVICE);
                if (isRateLimitReached) {
                    await this.featureReachRateLimitHandler.handle(event);
                    console.warn('RAG LLM Service rate limit reached. Handling fallback intent with feature reach rate limit handler.');
                    return;
                }
                await this.fallbackIntentService.handleFallbackIntent(event.message.text, event);
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