import { Body, Controller, Get, Param } from "@nestjs/common";
import { WorkoutProgramPlanService } from "../services/workout-program-plan.service";

@Controller('workout-program-plan')
export class WorkoutProgramPlanController {
    constructor(
        private readonly workoutProgramPlanService: WorkoutProgramPlanService,
    ) {}

    @Get('test')
    getProgramPlanDetails(
        @Body() body: any
    ) {
        const programPlanId = body.programPlanId;
        console.log('Fetching program plan details for ID:', programPlanId);
        return this.workoutProgramPlanService.getProgramPlanByPlanId(Number(programPlanId));
    }
}