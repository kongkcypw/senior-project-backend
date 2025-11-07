import { Module } from "@nestjs/common";
import { LineMessagingApiController } from "./controllers/line-messaging-api.controller";
import { HttpModule } from "@nestjs/axios";
import { LineMessagingApiConfigService } from "./services/config.service";
import { LineMessagingApiClientService } from "./services/client.service";
import { LineMessagingApiGroupChatService } from "./services/group-chat.service";

@Module({
    imports: [HttpModule],
    providers: [
        LineMessagingApiConfigService, 
        LineMessagingApiClientService, 
        LineMessagingApiGroupChatService
    ],
    controllers: [LineMessagingApiController],
    exports: [
        LineMessagingApiConfigService, 
        LineMessagingApiClientService, 
        LineMessagingApiGroupChatService
    ]
})

export class LineMessagingApiModule {}