import { Module } from "@nestjs/common";
import { DialogflowWebhookService } from "./services/dialogflow-webhook.service";
import { DialogflowModule } from "src/external/dialogflow-client/dialogflow.module";
import { LineMessagingApiModule } from "src/external/line-messaging-api/line-messaging-api.module";
import { DialogflowWebhookGroupChatHandler } from "./handlers/dialogflow-webhook-group-chat.handler";
import { TriggerHandler } from "./handlers/group-chat/trigger.handler";
import { LineLiffModule } from "src/external/line-liff/line-liff.module";
import { ManageProgramHandler } from "./handlers/group-chat/manage-program.handler";
import { UserModule } from "src/users/user.module";
import { LineGroupModule } from "src/line-group/line-group.module";
import { CaloriesInDayHandler } from "./handlers/group-chat/calories-in-day.handler";
import { NutritionModule } from "src/nutrition/nutrition.module";
import { WorkoutProgramHandler } from "./handlers/group-chat/workout-program.handler";
import { RagApiModule } from "src/external/rag-api/rag-api.module";
import { FallbackIntentService } from "./services/fallback-intent.service";
import { DialogflowWebhookPersonalChatHandler } from "./handlers/dialogflow-webhook-personal-chat.handler";
import { DialogflowFindTuneService } from "./services/dialogflow-find-tune.service";
import { DialogflowFineTuneRunnerService } from "./services/dialogflow-fine-tune-runner.service";
import { DialogflowFineTuneController } from "./controllers/dialogflow-fine-tune.controller";

@Module({
    imports: [
        DialogflowModule,
        LineMessagingApiModule,
        LineLiffModule,
        UserModule,
        LineGroupModule,
        NutritionModule,
        RagApiModule,
    ],
    controllers: [
        DialogflowFineTuneController,
    ],
    providers: [
        DialogflowWebhookService,
        DialogflowWebhookGroupChatHandler,
        DialogflowWebhookPersonalChatHandler,
        TriggerHandler,
        ManageProgramHandler,
        CaloriesInDayHandler,
        WorkoutProgramHandler,
        FallbackIntentService,
        DialogflowFindTuneService,
        DialogflowFineTuneRunnerService,
    ],
    exports: [
        DialogflowWebhookService,
        DialogflowWebhookGroupChatHandler,
        DialogflowWebhookPersonalChatHandler
    ],
})
export class DialogflowWebhookModule { }