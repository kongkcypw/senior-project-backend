import { WebhookEvent, WebhookRequestBody } from "@line/bot-sdk";
import { Injectable } from "@nestjs/common";
import { LineWebhookConfigService } from "./line-webhook-config.service";
import { MessageEventHandler } from "../handlers/message-event.handler";

@Injectable()
export class LineMessagingService {
    constructor(
        private readonly lineWebhookConfigService: LineWebhookConfigService,
        private readonly messageEventHandler: MessageEventHandler,
    ){}

    async handleWebhookEvent(body: WebhookRequestBody, lineSignature: string): Promise<void> {
       try {
        await this.processEvents(body.events);
       } catch (error) {
           console.error('Error handling webhook event:', error);
       }
    }

    /* Mark as Public for unit testing only. */
    async processEvents(events: WebhookEvent[]): Promise<void> {
        await Promise.all(events.map(event => this.handleEvent(event)));    
    }

    /* Mark as Public for unit testing only. */
    async handleEvent(event: WebhookEvent): Promise<void> {
        try {
            switch (event.type) {
                case 'message':
                    await this.messageEventHandler.handle(event);
                    break;
                default: {
                    console.log('Unhandled event type:', event.type);
                    break;
                }
            }
        } catch (error) {
            console.error('Failed to handle event type:', event.type);
            console.error(error);
        }
    }
}