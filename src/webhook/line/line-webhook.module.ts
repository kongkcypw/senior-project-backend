import { Module } from "@nestjs/common";
import { LineWebhookController } from "./controllers/line-webhook.controller";
import { LineWebhookConfigService } from "./services/line-webhook-config.service";
import { LineMessagingService } from "./services/line-messaging.service";
import { LineMessagingApiClientService } from "./services/line-messaging-api-client.service";
import { MessageEventHandler } from "./handlers/message-event.handler";
import { CaloriesHandler } from "./handlers/calories.handlers";
import { JoinEventHandler } from "./handlers/join-event.handler";
import { MemberJoinEventHandler } from "./handlers/member-join-event.handler";
import { LineGroupModule } from "src/line-group/line-group.module";
import { UserModule } from "src/users/user.module";

@Module({
    imports: [
        UserModule,
        LineGroupModule,
    ],
    providers: [
        // Services
        LineWebhookConfigService,
        LineMessagingService,
        LineMessagingApiClientService,

        // Handlers
        MessageEventHandler,
        CaloriesHandler,
        JoinEventHandler,
        MemberJoinEventHandler,
    ],
    controllers: [LineWebhookController],
})
export class LineWebhookModule {}