import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { UserInfoDto } from "../dto/user-info.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { getProtectedGuards } from "src/utils/guards.util";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "../enums/user-role.enum";
import { UserStatusDashboardDto } from "../dto/user-status-dashboard.dto";

@Controller('user')
@UseGuards(...getProtectedGuards('liff-jwt'))
export class UserController {
    constructor(
        private readonly usersService: UserService
    ) { }

    @Get('info/:lineUserId')
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    async getUserByLineUserId(
        @Param('lineUserId') id: string
    ): Promise<UserInfoDto> {
        return this.usersService.findByLineUserId(id);
    }

    @Get('dashboard-status/:lineUserId')
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    async getUserStatusForEligibleDashboardAccess(
        @Param('lineUserId') id: string
    ): Promise<UserStatusDashboardDto | null> {
        const userStatus = await this.usersService.findUserStatusForEligibleDashboardAccess(id);
        return userStatus;
    }

    @Post('create')
    async createUser(
        @Body() body: CreateUserDto
    ): Promise<void> {
        await this.usersService.insertUserIfNotExist(body.lineUserId, body.displayName ?? null, body.role, body.pictureUrl ?? null);;
        return;
    }

    @Patch('onboarding-complete/:lineUserId')
    @Roles(UserRole.TRAINER, UserRole.TRAINEE)
    async completeOnboarding(
        @Param('lineUserId') id: string
    ): Promise<void> {
        await this.usersService.completeOnboarding(id);
    }
}