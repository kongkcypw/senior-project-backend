import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { MessageEvent } from "@line/bot-sdk";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { GreetingMessageGroupChat, GreetingMessagePersonalChat } from "../messages/greeting.message";

@Injectable()
export class GreetingHandler implements IntentHandlerInterface {

    constructor(
        private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    ) { }

    async handleGroupChat(event: MessageEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            GreetingMessageGroupChat(),
        );
    }

    async handlePersonalChat(event: MessageEvent): Promise<void> {
        await this.lineMessagingApiClientService.sendReplyMessages(
            event.replyToken,
            GreetingMessagePersonalChat(),
        );
    }
}
