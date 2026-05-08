import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";
import { WorkoutHistoryService } from "../services/workout-history.service";
import { LogSessionDto } from "../dto/log-session.dto";
import { SkipAssignedTrainerGuard } from "src/auth/decorators/skip-trainer-guard.decorator";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/users/enums/user-role.enum";

@Controller('workout-history')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutHistoryController {
    constructor(private readonly workoutHistoryService: WorkoutHistoryService) {}

    @SkipAssignedTrainerGuard()
    @Roles(UserRole.TRAINEE, UserRole.TRAINER)
    @Get('done-this-week')
    getRoutinesDoneThisWeek(@Query('lineUserId') lineUserId: string) {
        return this.workoutHistoryService.getRoutinesDoneThisWeek(lineUserId);
    }

    @SkipAssignedTrainerGuard()
    @Roles(UserRole.TRAINEE, UserRole.TRAINER)
    @Get('active-session')
    getActiveSession(@Query('lineUserId') lineUserId: string) {
        return this.workoutHistoryService.getActiveSession(lineUserId);
    }

    @SkipAssignedTrainerGuard()
    @Roles(UserRole.TRAINEE, UserRole.TRAINER)
    @Delete('session/:sessionId')
    discardSession(@Param('sessionId', ParseIntPipe) sessionId: number) {
        return this.workoutHistoryService.discardSession(sessionId);
    }

    @SkipAssignedTrainerGuard()
    @Roles(UserRole.TRAINEE, UserRole.TRAINER)
    @Post('start-session')
    startSession(@Body() body: { lineUserId: string; routineId: number }) {
        return this.workoutHistoryService.startSession(body.lineUserId, body.routineId);
    }

    @SkipAssignedTrainerGuard()
    @Roles(UserRole.TRAINEE, UserRole.TRAINER)
    @Post('log-session')
    logSession(@Body() dto: LogSessionDto) {
        return this.workoutHistoryService.logSession(dto);
    }

    @SkipAssignedTrainerGuard()
    @Roles(UserRole.TRAINEE, UserRole.TRAINER)
    @Get('latest-session/:routineId')
    getLatestSession(
        @Param('routineId', ParseIntPipe) routineId: number,
        @Query('lineUserId') lineUserId: string,
    ) {
        return this.workoutHistoryService.getLatestSession(lineUserId, routineId);
    }

    @SkipAssignedTrainerGuard()
    @Roles(UserRole.TRAINEE, UserRole.TRAINER)
    @Get('sessions')
    getSessionList(
        @Query('lineUserId') lineUserId: string,
        @Query('limit') limit?: string,
    ) {
        return this.workoutHistoryService.getSessionList(lineUserId, limit ? parseInt(limit, 10) : 20);
    }

    @SkipAssignedTrainerGuard()
    @Roles(UserRole.TRAINEE, UserRole.TRAINER)
    @Get('session/:sessionId')
    getSessionDetail(@Param('sessionId', ParseIntPipe) sessionId: number) {
        return this.workoutHistoryService.getSessionDetail(sessionId);
    }
}
