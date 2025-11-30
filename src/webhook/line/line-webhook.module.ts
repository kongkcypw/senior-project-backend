import { Module } from "@nestjs/common";
import { LineWebhookController } from "./controllers/line-webhook.controller";
import { MessageEventHandler } from "./handlers/message-event.handler";
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
import { CloudflareModule } from "src/external/cloudflare/cloudflare.module";
import { GeminiModule } from "src/external/gemini/gemini.module";
import { NutritionModule } from "src/nutrition/nutrition.module";
import { LineLiffModule } from "src/external/line-liff/line-liff.module";

@Module({
    imports: [
        UserModule,
        LineGroupModule,
        LineMessagingApiModule,
        LineLiffModule,
        DialogflowWebhookModule,
        CloudflareModule,
        GeminiModule,
        NutritionModule,
    ],
    providers: [
        // Services
        LineWebhookService,

        // Handlers
        MessageEventHandler,
        JoinEventHandler,
        LeaveEventHandler,
        MemberJoinEventHandler,
        MemberLeaveEventHandler,
        PostBackEventHandler,
    ],
    controllers: [LineWebhookController],
})
export class LineWebhookModule {}