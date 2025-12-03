import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { UserInfoDto } from "../dto/user-info.dto";
import { CreateUserDto } from "../dto/create-user.dto";
import { getProtectedGuards } from "src/utils/guards.util";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "../enums/user-role.enum";

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
        console.log(id);
        return this.usersService.findByLineUserId(id);
    }

    @Post('create')
    async createUser(
        @Body() body: CreateUserDto
    ): Promise<void> {
        await this.usersService.insertUserIfNotExist(body.lineUserId, body.displayName ?? null, body.role, body.pictureUrl ?? null);;
        return;
    }
}