import { Injectable, NotFoundException } from "@nestjs/common";
import { UsersRepository } from "../repositories/users.repository";
import { UserInfoDto } from "../dto/user-info.dto";

@Injectable()
export class UsersService {
    constructor(
        private readonly usersRepository: UsersRepository
    ) {}
    
    async findByLineUserId(id: string | null): Promise<UserInfoDto> {

        if (!id) {
            throw new Error('Line User ID is required');
        }

        const user = await this.usersRepository.findByLineUserId(id);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return {
            id: user.id,
            lineUserId: user.lineUserId,
            displayName: user.displayName,
            role: user.role,
        };

    }
}