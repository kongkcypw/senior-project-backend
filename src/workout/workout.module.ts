import { Module } from "@nestjs/common";
import { WorkoutProgramController } from "./controllers/workout-program.controller";
import { WorkoutHistoryController } from "./controllers/workout-history.controller";
import { WorkoutRoutineRepository } from "./repositories/workout-routine.repository";
import { WorkoutExerciseRepository } from "./repositories/workout-exercise.repository";
import { WorkoutHistoryRepository } from "./repositories/workout-history.repository";
import { WorkoutHistoryExerciseRepository } from "./repositories/workout-history-exercise.repository";
import { WorkoutProgramPlanRepository } from "./repositories/workout-program.repository";
import { WorkoutHistoryService } from "./services/workout-history.service";
import { WorkoutProgramService } from "./services/workout-program.service";
import { UserModule } from "src/users/user.module";
import { WorkoutRoutineController } from "./controllers/workout-routine.controller";
import { WorkoutRoutineService } from "./services/workout-routine.service";
import { WorkoutExerciseTemplateController } from "./controllers/workout-exercise-template.controller";
import { WorkoutExerciseTemplateService } from "./services/workout-exercise-template.service";
import { WorkoutExerciseTemplateRepository } from "./repositories/workout-exercise-template.repository";
import { WorkoutExerciseSetRepository } from "./repositories/workout-exercise-set.repository";
import { LineMessagingApiModule } from "src/external/line-messaging-api/line-messaging-api.module";
import { LineGroupModule } from "src/line-group/line-group.module";
import { LineLiffModule } from "src/external/line-liff/line-liff.module";
import { FeatureFlagModule } from "src/feature-flag/feature-flag.module";
import { RagApiModule } from "src/external/rag-api/rag-api.module";
import { UserPhysiqueHistoryRepository } from "src/users/repositories/user-physique-history.repository";

@Module({
    imports: [
        UserModule,
        LineMessagingApiModule,
        LineGroupModule,
        LineLiffModule,
        FeatureFlagModule,
        RagApiModule,
    ],
    controllers: [
        WorkoutHistoryController,
        WorkoutProgramController,
        WorkoutRoutineController,
        WorkoutExerciseTemplateController,
    ],
    providers: [
        WorkoutRoutineRepository,
        WorkoutExerciseRepository,
        WorkoutHistoryRepository,
        WorkoutHistoryExerciseRepository,
        WorkoutProgramPlanRepository,
        WorkoutHistoryService,
        WorkoutProgramService,
        WorkoutRoutineService,
        WorkoutExerciseTemplateRepository,
        WorkoutExerciseTemplateService,
        WorkoutExerciseSetRepository,
        UserPhysiqueHistoryRepository,
    ],
    exports: [WorkoutHistoryRepository, WorkoutProgramPlanRepository, WorkoutProgramService, WorkoutHistoryService],
})

export class WorkoutModule { }
