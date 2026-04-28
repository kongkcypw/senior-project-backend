import { webhook, WebhookEvent, WebhookRequestBody } from "@line/bot-sdk";
import { Injectable } from "@nestjs/common";
import { MessageEventHandler } from "../handlers/message-event.handler";
import { JoinEventHandler } from "../handlers/join-event.handler";
import { MemberJoinEventHandler } from "../handlers/member-join-event.handler";
import { WebhookEventType } from "../enums/webhook-event-type.enum";
import { PostBackEventHandler } from "../handlers/postback-event.handler";
import { MemberLeaveEventHandler } from "../handlers/member-leave-event.handler";
import { LeaveEventHandler } from "../handlers/leave-event.handler";
import { FollowEventHandler } from "../handlers/follow-event.handler";

@Injectable()
export class LineWebhookService {
    constructor(
        private readonly messageEventHandler: MessageEventHandler,
        private readonly joinEventHandler: JoinEventHandler,
        private readonly leaveEventHandler: LeaveEventHandler,
        private readonly memberJoinedEventHandler: MemberJoinEventHandler,
        private readonly memberLeaveEventHandler: MemberLeaveEventHandler,
        private readonly postbackEventHandler: PostBackEventHandler,
        private readonly followEventHandler: FollowEventHandler,
    ){}

    async handleWebhookEvent(body: WebhookRequestBody, lineSignature: string): Promise<void> {
       try {
        await this.processEvents(body.events, body.destination);
       } catch (error) {
           console.error('Error handling webhook event:', error);
       }
    }

    /* Mark as Public for unit testing only. */
    async processEvents(events: WebhookEvent[], destination: string): Promise<void> {
        await Promise.all(events.map(event => this.handleEvent(event, destination)));    
    }

    /* Mark as Public for unit testing only. */
    async handleEvent(event: WebhookEvent, destination: string): Promise<void> {
        try {
            switch (event.type) {
                case WebhookEventType.MESSAGE:
                    await this.messageEventHandler.handle(event);
                    break;
                case WebhookEventType.POSTBACK:
                    await this.postbackEventHandler.handle(event);
                    break;
                case WebhookEventType.JOIN:
                    await this.joinEventHandler.handle(event);
                    break;
                case WebhookEventType.LEAVE:
                    await this.leaveEventHandler.handle(event);
                    break;
                case WebhookEventType.MEMBER_JOINED:
                    await this.memberJoinedEventHandler.handle(event);
                    break;
                case WebhookEventType.MEMBER_LEAVED:
                    await this.memberLeaveEventHandler.handle(event);
                    break;
                case WebhookEventType.FOLLOW:
                    await this.followEventHandler.handle(event, destination);
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