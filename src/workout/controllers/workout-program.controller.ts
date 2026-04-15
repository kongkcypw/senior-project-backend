import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { WorkoutProgramService } from "../services/workout-program.service";
import { getProtectedGuards } from "src/utils/guards.util";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";
import { SkipAssignedTrainerGuard } from "src/auth/decorators/skip-trainer-guard.decorator";

@Controller('workout-program')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutProgramController {
    constructor(
        private readonly workoutProgramService: WorkoutProgramService,
    ) { }

    @Get('by-trainer/:lineUserId')
    getByLineUserIdTrainer(
        @Param('lineUserId') lineUserId: string,
    ) {
        return this.workoutProgramService.getProgramPlanByLineUserIdTrainer(lineUserId);
    }

    @SkipAssignedTrainerGuard()
    @Get('detail/:programId')
    getProgramById(
        @Param('programId') programId: string,
    ) {
        return this.workoutProgramService.getProgramPlanByPlanId(Number(programId));
    }

    @Get(':lineUserId')
    getByLineUserIdTrainee(
        @Param('lineUserId') lineUserId: string,
    ) {
        return this.workoutProgramService.getProgramPlanByLineUserIdTrainee(lineUserId);
    }

    @Post()
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    createProgramPlan(
        @Body() body: { name: string; lineUserIdTrainee: string; lineUserIdTrainer: string }
    ) {
        return this.workoutProgramService.createProgramPlan(body.name, body.lineUserIdTrainee, body.lineUserIdTrainer);
    }
}