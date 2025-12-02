import { Module } from "@nestjs/common";
import { WorkoutProgramPlanController } from "./controllers/workout-program-plan.controller";
import { WorkoutHistoryController } from "./controllers/workout-history.controller";
import { WorkoutDayDefinitionRepository } from "./repositories/workout-day-definition.repository";
import { WorkoutExerciseDetailRepository } from "./repositories/workout-exercise-detail.repository";
import { WorkoutHistoryRepository } from "./repositories/workout-history.repository";
import { WorkoutProgramPlanRepository } from "./repositories/workout-program-plan.repository";
import { WorkoutScheduleItemRepository } from "./repositories/workout-schedule-item.repository";
import { WorkoutHistoryService } from "./services/workout-history.service";
import { WorkoutProgramPlanService } from "./services/workout-program-plan.service";
import { UserModule } from "src/users/user.module";
import { WorkoutDayDefinitionService } from "./services/workout-day-definition.service";
import { WorkoutDayDefinitionController } from "./controllers/workout-day-definition.controller";

@Module({
    imports: [UserModule],
    controllers: [
        WorkoutHistoryController,
        WorkoutProgramPlanController,
        WorkoutDayDefinitionController,
    ],
    providers: [
        WorkoutDayDefinitionRepository,
        WorkoutExerciseDetailRepository,
        WorkoutHistoryRepository,
        WorkoutProgramPlanRepository,
        WorkoutScheduleItemRepository,
        WorkoutHistoryService,
        WorkoutProgramPlanService,
        WorkoutDayDefinitionService,
    ],
    exports: [],
})

export class WorkoutModule {}