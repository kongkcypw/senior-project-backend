import { Module } from "@nestjs/common";
import { DialogflowWebhookService } from "./services/dialogflow-webhook.service";
import { DialogflowModule } from "src/external/dialogflow-client/dialogflow.module";
import { LineMessagingApiModule } from "src/external/line-messaging-api/line-messaging-api.module";
import { DialogflowWebhookHandler } from "./handlers/dialogflow-webhook.handler";
import { TriggerHandler } from "./handlers/trigger.handler";
import { LineLiffModule } from "src/external/line-liff/line-liff.module";
import { ManageProgramHandler } from "./handlers/manage-program.handler";
import { UserModule } from "src/users/user.module";
import { LineGroupModule } from "src/line-group/line-group.module";

@Module({
    imports: [DialogflowModule, LineMessagingApiModule, LineLiffModule, UserModule, LineGroupModule],
    providers: [DialogflowWebhookService, DialogflowWebhookHandler, TriggerHandler, ManageProgramHandler],
    exports: [DialogflowWebhookService, DialogflowWebhookHandler],
})
export class DialogflowWebhookModule { }