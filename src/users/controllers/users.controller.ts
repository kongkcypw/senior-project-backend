import { Controller, Get, Param } from "@nestjs/common";
import { UsersService } from "../services/users.service";
import { UsersEntity } from "../entities/users.entity";
import { UserInfoDto } from "../dto/user-info.dto";

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService
    ) {}

    // TODO: Change to proper route (This is just for testing)
    @Get('info/:lineUserId')
    async getUserByLineUserId(
        @Param('lineUserId') id: string
    ): Promise<UserInfoDto> {
        console.log(id);
        return this.usersService.findByLineUserId(id);
    }
}