import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkoutProgramService } from "../services/workout-program.service";
import { getProtectedGuards } from "src/utils/guards.util";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";

@Controller('workout-program')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutProgramController {
    constructor(
        private readonly workoutProgramService: WorkoutProgramService,
    ) { }

    @Get(':lineUserId')
    getByLineUserIdTrainer(
        @Param('lineUserId') lineUserId: string,
    ) {
        return this.workoutProgramService.getProgramPlanByLineUserIdTrainee(lineUserId);
    }

    @Get('test')
    getProgramPlanDetails(
    ) {
        const programPlanId = 1;
        return this.workoutProgramService.getProgramPlanByPlanId(Number(programPlanId));
    }

    @Post()
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    createProgramPlan(
        @Body() body: { name: string; lineUserIdTrainee: string; lineUserIdTrainer: string }
    ) {
        return this.workoutProgramService.createProgramPlan(body.name, body.lineUserIdTrainee, body.lineUserIdTrainer);
    }
}