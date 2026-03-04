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
import { CaloriesInDayHandler } from "./handlers/calories-in-day.handler";
import { NutritionModule } from "src/nutrition/nutrition.module";
import { WorkoutProgramHandler } from "./handlers/workout-program.handler";
import { RagApiModule } from "src/external/rag-api/rag-api.module";
import { FallbackIntentService } from "./services/fallback-intent.service";

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
    providers: [
        DialogflowWebhookService,
        DialogflowWebhookHandler,
        TriggerHandler,
        ManageProgramHandler,
        CaloriesInDayHandler,
        WorkoutProgramHandler,
        FallbackIntentService,
    ],
    exports: [DialogflowWebhookService, DialogflowWebhookHandler],
})
export class DialogflowWebhookModule { }