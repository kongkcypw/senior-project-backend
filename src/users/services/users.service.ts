import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { UserInfoDto } from "../dto/user-info.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly usersRepository: UserRepository
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
            displayName: user.displayName || '',
            role: user.role || '',
        };

    }
}