import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Query, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";
import { WorkoutHistoryService } from "../services/workout-history.service";
import { LogSessionDto } from "../dto/log-session.dto";

@Controller('workout-history')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutHistoryController {
    constructor(private readonly workoutHistoryService: WorkoutHistoryService) {}

    @Get('done-this-week')
    getRoutinesDoneThisWeek(@Query('lineUserId') lineUserId: string) {
        return this.workoutHistoryService.getRoutinesDoneThisWeek(lineUserId);
    }

    @Get('active-session')
    getActiveSession(@Query('lineUserId') lineUserId: string) {
        return this.workoutHistoryService.getActiveSession(lineUserId);
    }

    @Delete('session/:sessionId')
    discardSession(@Param('sessionId', ParseIntPipe) sessionId: number) {
        return this.workoutHistoryService.discardSession(sessionId);
    }

    @Post('start-session')
    startSession(@Body() body: { lineUserId: string; routineId: number }) {
        return this.workoutHistoryService.startSession(body.lineUserId, body.routineId);
    }

    @Post('log-session')
    logSession(@Body() dto: LogSessionDto) {
        return this.workoutHistoryService.logSession(dto);
    }

    @Get('latest-session/:routineId')
    getLatestSession(
        @Param('routineId', ParseIntPipe) routineId: number,
        @Query('lineUserId') lineUserId: string,
    ) {
        return this.workoutHistoryService.getLatestSession(lineUserId, routineId);
    }

    @Get('sessions')
    getSessionList(
        @Query('lineUserId') lineUserId: string,
        @Query('limit') limit?: string,
    ) {
        return this.workoutHistoryService.getSessionList(lineUserId, limit ? parseInt(limit, 10) : 20);
    }

    @Get('session/:sessionId')
    getSessionDetail(@Param('sessionId', ParseIntPipe) sessionId: number) {
        return this.workoutHistoryService.getSessionDetail(sessionId);
    }
}
