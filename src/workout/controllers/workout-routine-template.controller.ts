import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";
import { WorkoutRoutineTemplateEntity } from "../entities/workout-routine-template.entity";
import { WorkoutRoutineTemplateService } from "../services/workout-routine-template.service";

@Controller('workout-routine-template')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutRoutineTemplateController {
    constructor(
        private readonly workoutRoutineTemplateService: WorkoutRoutineTemplateService,
    ) { }


    @Get('')
    async getAll(): Promise<WorkoutRoutineTemplateEntity[]> {
        return this.workoutRoutineTemplateService.getAll();
    }
}
