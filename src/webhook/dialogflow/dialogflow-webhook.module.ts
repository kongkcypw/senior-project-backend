import { Module } from "@nestjs/common";
import { DialogflowWebhookService } from "./services/dialogflow-webhook.service";
import { DialogflowModule } from "src/external/dialogflow-client/dialogflow.module";
import { LineMessagingApiModule } from "src/external/line-messaging-api/line-messaging-api.module";
import { DialogflowWebhookGroupChatHandler } from "./handlers/main/dialogflow-webhook-group-chat.handler";
import { LineLiffModule } from "src/external/line-liff/line-liff.module";
import { UserModule } from "src/users/user.module";
import { LineGroupModule } from "src/line-group/line-group.module";
import { NutritionModule } from "src/nutrition/nutrition.module";
import { WorkoutProgramHandler } from "./handlers/workout-program.handler";
import { WorkoutModule } from "src/workout/workout.module";
import { RagApiModule } from "src/external/rag-api/rag-api.module";
import { FallbackIntentService } from "./services/fallback-intent.service";
import { DialogflowWebhookPersonalChatHandler } from "./handlers/main/dialogflow-webhook-personal-chat.handler";
import { DialogflowFindTuneService } from "./services/dialogflow-find-tune.service";
import { DialogflowFineTuneRunnerService } from "./services/dialogflow-fine-tune-runner.service";
import { DialogflowFineTuneController } from "./controllers/dialogflow-fine-tune.controller";
import { FeatureFlagModule } from "src/feature-flag/feature-flag.module";
import { FeatureRateLimitModule } from "src/feature-rate-limit/feature-rate-limit.module";
import { FeatureReachRateLimitHandler } from "./handlers/feature-reach-rate-limit.handler";
import { FeatureDisableHandler } from "./handlers/feature-disable.handler";
import { NutritionPlanHandler } from "./handlers/nutrition-plan.handler";
import { TodayNutritionSummaryHandler } from "./handlers/today-nutrition-summary.handler";
import { HelpHandler } from "./handlers/help.handler";
import { LastWorkoutSessionHandler } from "./handlers/last-workout-session.handler";

@Module({
    imports: [
        DialogflowModule,
        LineMessagingApiModule,
        LineLiffModule,
        UserModule,
        LineGroupModule,
        NutritionModule,
        WorkoutModule,
        RagApiModule,
        FeatureFlagModule,
        FeatureRateLimitModule,
    ],
    controllers: [
        DialogflowFineTuneController,
    ],
    providers: [
        DialogflowWebhookService,
        DialogflowWebhookGroupChatHandler,
        DialogflowWebhookPersonalChatHandler,
        WorkoutProgramHandler,
        FallbackIntentService,
        DialogflowFindTuneService,
        DialogflowFineTuneRunnerService,
        FeatureDisableHandler,
        FeatureReachRateLimitHandler,
        NutritionPlanHandler,
        TodayNutritionSummaryHandler,
        LastWorkoutSessionHandler,
        HelpHandler,
    ],
    exports: [
        DialogflowWebhookService,
        DialogflowWebhookGroupChatHandler,
        DialogflowWebhookPersonalChatHandler
    ],
})
export class DialogflowWebhookModule { }