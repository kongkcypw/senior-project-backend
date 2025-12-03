import { Module } from "@nestjs/common";
import { WorkoutProgramController } from "./controllers/workout-program.controller";
import { WorkoutHistoryController } from "./controllers/workout-history.controller";
import { WorkoutRoutineRepository } from "./repositories/workout-routine.repository";
import { WorkoutExerciseRepository } from "./repositories/workout-exercise.repository";
import { WorkoutHistoryRepository } from "./repositories/workout-history.repository";
import { WorkoutProgramPlanRepository } from "./repositories/workout-program.repository";
import { WorkoutHistoryService } from "./services/workout-history.service";
import { WorkoutProgramService } from "./services/workout-program.service";
import { UserModule } from "src/users/user.module";
import { WorkoutRoutineController } from "./controllers/workout-routine.controller";
import { WorkoutRoutineService } from "./services/workout-routine.service";
import { WorkoutExerciseTemplateController } from "./controllers/workout-exercise-template.controller";
import { WorkoutExerciseTemplateService } from "./services/workout-exercise-template.service";
import { WorkoutExerciseTemplateRepository } from "./repositories/workout-exercise-template.repository";
import { WorkoutRoutineTemplateRepository } from "./repositories/workout-routine-template.repository";
import { WorkoutRoutineTemplateService } from "./services/workout-routine-template.service";
import { WorkoutRoutineTemplateController } from "./controllers/workout-routine-template.controller";
import { WorkoutExerciseSetRepository } from "./repositories/workout-exercise-set.repository";

@Module({
    imports: [UserModule],
    controllers: [
        WorkoutHistoryController,
        WorkoutProgramController,
        WorkoutRoutineController,
        WorkoutExerciseTemplateController,
        WorkoutRoutineTemplateController,
    ],
    providers: [
        WorkoutRoutineRepository,
        WorkoutExerciseRepository,
        WorkoutHistoryRepository,
        WorkoutProgramPlanRepository,
        WorkoutHistoryService,
        WorkoutProgramService,
        WorkoutRoutineService,
        WorkoutExerciseTemplateRepository,
        WorkoutRoutineTemplateRepository,
        WorkoutExerciseTemplateService,
        WorkoutRoutineTemplateService,
        WorkoutExerciseSetRepository,
    ],
    exports: [],
})

export class WorkoutModule { }