import { WebhookEvent, WebhookRequestBody } from "@line/bot-sdk";
import { Injectable } from "@nestjs/common";
import { MessageEventHandler } from "../handlers/message-event.handler";
import { JoinEventHandler } from "../handlers/join-event.handler";
import { MemberJoinEventHandler } from "../handlers/member-join-event.handler";
import { WebhookEventType } from "../enums/webhook-event-type.enum";

@Injectable()
export class LineWebhookService {
    constructor(
        private readonly messageEventHandler: MessageEventHandler,
        private readonly joinEventHandler: JoinEventHandler,
        private readonly memberJoinedEventHandler: MemberJoinEventHandler,
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
                case WebhookEventType.MESSAGE:
                    await this.messageEventHandler.handle(event);
                    break;
                case WebhookEventType.JOIN:
                    await this.joinEventHandler.handle(event);
                    break;
                case WebhookEventType.MEMBER_JOINED:
                    await this.memberJoinedEventHandler.handle(event);
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