import { Controller, Get, Param } from "@nestjs/common";
import { UserService } from "../services/users.service";
import { UserInfoDto } from "../dto/user-info.dto";

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
}