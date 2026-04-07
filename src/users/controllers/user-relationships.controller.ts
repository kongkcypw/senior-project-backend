import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { UserRelationshipsService } from "../services/user-relationships.service";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "../enums/user-role.enum";
import { getProtectedGuards } from "src/utils/guards.util";

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
}