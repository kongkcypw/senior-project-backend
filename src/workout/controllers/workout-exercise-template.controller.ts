import { Controller, Get, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";
import { WorkoutExerciseTemplateService } from "../services/workout-exercise-template.service";
import { WorkoutExerciseTemplateEntity } from "../entities/workout-exercise-template.entity";

@Controller('workout-exercise-template')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutExerciseTemplateController {
    constructor(
        private readonly workoutExerciseTemplateService: WorkoutExerciseTemplateService
    ) { }

    @Get('')
    async getAll(): Promise<WorkoutExerciseTemplateEntity[]> {
        return this.workoutExerciseTemplateService.getAll();
    }
}

