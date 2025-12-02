import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkoutProgramPlanService } from "../services/workout-program-plan.service";
import { getProtectedGuards } from "src/utils/guards.util";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";

@Controller('workout-program-plan')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutProgramPlanController {
    constructor(
        private readonly workoutProgramPlanService: WorkoutProgramPlanService,
    ) { }

    @Get(':lineUserId')
    getByLineUserIdTrainer(
        @Param('lineUserId') lineUserId: string,
    ) {
        return this.workoutProgramPlanService.getProgramPlanByLineUserIdTrainee(lineUserId);
    }

    @Get('test')
    getProgramPlanDetails(
    ) {
        const programPlanId = 1;
        return this.workoutProgramPlanService.getProgramPlanByPlanId(Number(programPlanId));
    }

    @Post()
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    createProgramPlan(
        @Body() body: { name: string; lineUserIdTrainee: string; lineUserIdTrainer: string }
    ) {
        return this.workoutProgramPlanService.createProgramPlan(body.name, body.lineUserIdTrainee, body.lineUserIdTrainer);
    }
}