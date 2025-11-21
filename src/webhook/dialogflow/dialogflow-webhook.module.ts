import { Module } from "@nestjs/common";
import { DialogflowWebhookService } from "./services/dialogflow-webhook.service";
import { DialogflowModule } from "src/external/dialogflow-client/dialogflow.module";
import { LineMessagingApiModule } from "src/external/line-messaging-api/line-messaging-api.module";
import { DialogflowWebhookHandler } from "./handlers/dialogflow-webhook.handler";
import { TriggerHandler } from "./handlers/trigger.handler";

@Module({
    imports: [DialogflowModule, LineMessagingApiModule],
    providers: [DialogflowWebhookService, DialogflowWebhookHandler, TriggerHandler],
    exports: [DialogflowWebhookService, DialogflowWebhookHandler],
})
export class DialogflowWebhookModule {}