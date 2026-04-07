import { Module } from "@nestjs/common";
import { MealHistoryController } from "./controllers/meal-history.controller";
import { MealHistoryRepository } from "./repositories/meal-history.repository";
import { MealHistoryService } from "./services/meal-history.service";
import { NutritionPlanRepository } from "./repositories/nutrition-plan.repository";
import { LineMessagingApiModule } from "src/external/line-messaging-api/line-messaging-api.module";
import { LineGroupModule } from "src/line-group/line-group.module";
import { NutritionNotificationTimeRepository } from "./repositories/nutrition-notification-time.repository";
import { NutritionNotificationTimeService } from "./services/nutrition-notification-time.service";
import { NutritionPlanController } from "./controllers/nutrition-plan.controller";
import { NutritionPlanService } from "./services/nutrition-plan.service";
import { UserModule } from "src/users/user.module";
import { LineLiffModule } from "src/external/line-liff/line-liff.module";

@Module({
    imports: [
        LineMessagingApiModule,
        LineGroupModule,
        UserModule,
        LineLiffModule
    ],
    providers: [
        MealHistoryRepository,
        MealHistoryService,
        NutritionPlanRepository,
        NutritionPlanService,
        NutritionNotificationTimeRepository,
        NutritionNotificationTimeService],
    controllers: [
        MealHistoryController,
        NutritionPlanController
    ],
    exports: [MealHistoryService, NutritionPlanService, MealHistoryRepository, NutritionPlanRepository],
})

export class NutritionModule { }