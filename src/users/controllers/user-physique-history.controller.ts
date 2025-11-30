import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { Roles } from "src/auth/decorators/roles.decorator";
import { getProtectedGuards } from "src/utils/guards.util";
import { UserRole } from "../enums/user-role.enum";
import { UserPhysiqueHistoryService } from "../services/user-physique-history.service";
import { Viewer } from "src/common/decorators/viewer.decorator";
import { UserInfoDto } from "../dto/user-info.dto";
import { UserPhysiqueDto } from "../dto/user-physique.dto";

@Controller('user-physique-history')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class UserPhysiqueHistoryController {
    constructor(
        private readonly userPhysiqueHistoryService: UserPhysiqueHistoryService
    ) { }

    @Get(':lineUserId')
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    async getPhysiqueHistoryByLineUserId(
        @Param('lineUserId') lineUserId: string,
        @Viewer() viewer: UserInfoDto
    ): Promise<UserPhysiqueDto[]> {
        return this.userPhysiqueHistoryService.getPhysiqueHistoryByLineUserId(lineUserId);
    }

    @Post()
    @Roles(UserRole.TRAINEE, UserRole.TRAINER)
    async insertPhysiqueHistoryForTrainee(
        @Body() body: {
            lineUserId: string;
            age: number;
            weight: number;
            height: number;
            bodyFatPercentage: number | null;
            goal: string;
        },
    ): Promise<void> {
        await this.userPhysiqueHistoryService.insertPhysiqueHistoryForTrainee(body);
    }
}