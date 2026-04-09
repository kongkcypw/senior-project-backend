import { BadRequestException, Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { UserRelationshipsService } from "../services/user-relationships.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "../enums/user-role.enum";
import { getProtectedGuards } from "src/utils/guards.util";
import type { HistoryPeriod } from "src/common/utils/score.util";

const VALID_PERIODS: HistoryPeriod[] = ['daily', 'weekly', 'monthly'];

@Controller('user-relationships')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class UserRelationshipsController {
    constructor(
        private readonly userRelationshipsService: UserRelationshipsService
    ) { }

    @Get('trainees-by-trainer/:lineUserId')
    @Roles(UserRole.TRAINER)
    async findAllTraineeByTrainerLineUserId(
        @Param('lineUserId') trainerLineUserId: string
    ) {
        return this.userRelationshipsService.findAllTraineeByTrainerLineUserId(trainerLineUserId);
    }

    @Get('trainee/:traineeId')
    @Roles(UserRole.TRAINER)
    async getTraineeDetail(
        @Param('traineeId') traineeId: string,
    ) {
        return this.userRelationshipsService.getTraineeDetailById(parseInt(traineeId, 10));
    }

    @Get('home-stats/:lineUserId')
    @Roles(UserRole.TRAINER)
    async getHomeStats(
        @Param('lineUserId') trainerLineUserId: string,
    ) {
        return this.userRelationshipsService.getHomeStatsForTrainer(trainerLineUserId);
    }

    @Get('trainees-summary/:lineUserId')
    @Roles(UserRole.TRAINER)
    async getTraineesSummary(
        @Param('lineUserId') trainerLineUserId: string,
    ) {
        return this.userRelationshipsService.findTraineesSummaryByTrainer(trainerLineUserId);
    }

    @Get('score-history/:lineUserId')
    @Roles(UserRole.TRAINER)
    async getScoreHistoryForTrainer(
        @Param('lineUserId') trainerLineUserId: string,
        @Query('period') period?: string,
    ) {
        const resolved = (period ?? 'weekly') as HistoryPeriod;
        if (!VALID_PERIODS.includes(resolved)) {
            throw new BadRequestException(
                `Invalid period "${period}". Must be one of: ${VALID_PERIODS.join(', ')}`,
            );
        }
        return this.userRelationshipsService.getScoreHistoryForTrainer(trainerLineUserId, resolved);
    }
}