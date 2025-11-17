import { Module } from "@nestjs/common";
import { LineWebhookController } from "./controllers/line-webhook.controller";
import { MessageEventHandler } from "./handlers/message-event.handler";
import { CaloriesHandler } from "./handlers/calories.handlers";
import { JoinEventHandler } from "./handlers/join-event.handler";
import { MemberJoinEventHandler } from "./handlers/member-join-event.handler";
import { LineGroupModule } from "src/line-group/line-group.module";
import { UserModule } from "src/users/user.module";
import { LineMessagingApiModule } from "src/external/line-messaging-api/line-messaging-api.module";
import { LineWebhookService } from "./services/line-webhook.service";
import { PostBackEventHandler } from "./handlers/postback-event.handler";
import { MemberLeaveEventHandler } from "./handlers/member-leave-event.handler";
import { LeaveEventHandler } from "./handlers/leave-event.handler";
import { DialogflowWebhookModule } from "../dialogflow/dialogflow-webhook.module";

@Module({
    imports: [
        UserModule,
        LineGroupModule,
        LineMessagingApiModule,
        DialogflowWebhookModule,
    ],
    providers: [
        // Services
        LineWebhookService,

        // Handlers
        MessageEventHandler,
        CaloriesHandler,
        JoinEventHandler,
        LeaveEventHandler,
        MemberJoinEventHandler,
        MemberLeaveEventHandler,
        PostBackEventHandler,
    ],
    controllers: [LineWebhookController],
})
export class LineWebhookModule {}