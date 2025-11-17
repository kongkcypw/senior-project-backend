import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { TriggerHandler } from '../handlers/trigger.handler';
import { DialogflowIntentName } from '../enums/dialogflow-intent-name';
import { DialogflowClientService } from 'src/external/dialogflow-client/services/client.service';
import { DialogflowConfigService } from 'src/external/dialogflow-client/services/config.service';
import { LineMessagingApiClientService } from 'src/external/line-messaging-api/services/client.service';
import { MessageEvent } from '@line/bot-sdk';

@Injectable()
export class DialogflowWebhookService {

    constructor(
        private readonly triggerHandler: TriggerHandler,
    ) {}

    async handleIntent(res: Response, intentName: string | null): Promise<any> {

        console.log('Intent detected:', intentName);

        if (intentName === DialogflowIntentName.TRIGGER) {
            return this.triggerHandler.handle(res);
        }

        return;
    }
}