import { Module } from "@nestjs/common";
import { UserRepository } from "./repositories/user.repository";
import { UserService } from "./services/user.service";
import { UserController } from "./controllers/user.controller";
import { UserPhysiqueHistoryController } from "./controllers/user-physique-history.controller";
import { UserRelationshipsRepository } from "./repositories/user-relationships.repository";
import { UserRelationshipsService } from "./services/user-relationships.service";
import { UserRelationshipsController } from "./controllers/user-relationships.controller";
import { UserPhysiqueHistoryRepository } from "./repositories/user-physique-history.repository";
import { UserPhysiqueHistoryService } from "./services/user-physique-history.service";
import { LineGroupModule } from "src/line-group/line-group.module";
import { LineMessagingApiModule } from "src/external/line-messaging-api/line-messaging-api.module";
import { WorkoutHistoryRepository } from "src/workout/repositories/workout-history.repository";
import { WorkoutProgramPlanRepository } from "src/workout/repositories/workout-program.repository";
import { MealHistoryRepository } from "src/nutrition/repositories/meal-history.repository";
import { NutritionPlanRepository } from "src/nutrition/repositories/nutrition-plan.repository";

@Module({
    imports: [
        LineGroupModule,
        LineMessagingApiModule,
    ],
    providers: [
        UserRepository,
        UserService,
        UserRelationshipsRepository,
        UserRelationshipsService,
        UserPhysiqueHistoryRepository,
        UserPhysiqueHistoryService,
        // Score-computing dependencies — registered directly to avoid circular module imports
        // (WorkoutModule and NutritionModule both import UserModule)
        WorkoutHistoryRepository,
        WorkoutProgramPlanRepository,
        MealHistoryRepository,
        NutritionPlanRepository,
    ],
    controllers: [
        UserController,
        UserRelationshipsController,
        UserPhysiqueHistoryController,
    ],
    exports: [UserService, UserRelationshipsService]
})

export class UserModule { }