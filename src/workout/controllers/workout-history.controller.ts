import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from "@nestjs/common";
import { getProtectedGuards } from "src/utils/guards.util";
import { WorkoutHistoryService } from "../services/workout-history.service";

@Controller('workout-history')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class WorkoutHistoryController {
    constructor(private readonly workoutHistoryService: WorkoutHistoryService) {}

    @Get('done-this-week')
    getRoutinesDoneThisWeek(@Query('lineUserId') lineUserId: string) {
        return this.workoutHistoryService.getRoutinesDoneThisWeek(lineUserId);
    }

    @Get('latest-session/:routineId')
    getLatestSession(
        @Param('routineId', ParseIntPipe) routineId: number,
        @Query('lineUserId') lineUserId: string,
    ) {
        return this.workoutHistoryService.getLatestSession(lineUserId, routineId);
    }
}