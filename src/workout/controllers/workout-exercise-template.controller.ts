import { Controller, Get, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";
import { WorkoutExerciseTemplateService } from "../services/workout-exercise-template.service";
import { WorkoutExerciseTemplateDto } from "../dto/workout-exercise-template.dto";

@Controller('workout-exercise-template')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutExerciseTemplateController {
    constructor(
        private readonly workoutExerciseTemplateService: WorkoutExerciseTemplateService
    ) { }

    @Get('')
    async getAll(): Promise<WorkoutExerciseTemplateDto[]> {
        return this.workoutExerciseTemplateService.getAll();
    }
}

