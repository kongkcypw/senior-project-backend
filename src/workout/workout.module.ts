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

@Module({
    imports: [UserModule],
    controllers: [
        WorkoutHistoryController,
        WorkoutProgramController,
        WorkoutRoutineController,
    ],
    providers: [
        WorkoutRoutineRepository,
        WorkoutExerciseRepository,
        WorkoutHistoryRepository,
        WorkoutProgramPlanRepository,
        WorkoutHistoryService,
        WorkoutProgramService,
        WorkoutRoutineService,
    ],
    exports: [],
})

export class WorkoutModule { }