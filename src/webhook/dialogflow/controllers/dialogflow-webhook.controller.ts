import { Controller, Post, Body, Req, Res } from '@nestjs/common';
import { DialogflowIntentName } from '../enums/dialogflow-intent-name';
import { TriggerHandler } from '../handlers/trigger.handler';
import { DialogflowWebhookService } from '../services/dialogflow-webhook.service';

@Controller('webhook')
export class DialogflowWebhookController {
    constructor(
        private readonly dialogflowWebhookService: DialogflowWebhookService,
        private readonly triggerHandler: TriggerHandler,
    ) {}

    // Handle Dialogflow fulfillment webhook
    // This will trigger only if intent has fulfillment enabled
    @Post('fulfillment')
    async handleWebhook(@Req() req, @Res() res): Promise<any> {
        const body = req.body;
        const queryText = body.queryResult?.queryText;

        console.log('Dialogflow fulfillment webhook -> User message:', queryText);

        const intent = body.queryResult?.intent?.displayName;
        await this.dialogflowWebhookService.handleIntent(res, intent);

        res.status(200).send();
    }
}