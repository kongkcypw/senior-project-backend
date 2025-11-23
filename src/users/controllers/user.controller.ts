import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { UserService } from "../services/user.service";
import { UserInfoDto } from "../dto/user-info.dto";
import { CreateUserDto } from "../dto/create-user.dto";

@Controller('users')
export class UserController {
    constructor(
        private readonly usersService: UserService
    ) {}

    // TODO: Change to proper route (This is just for testing)
    @Get('info/:lineUserId')
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
        return ;
    }
}