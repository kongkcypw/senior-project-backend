import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { UserInfoDto } from "../dto/user-info.dto";
import { UserRole } from "../enums/user-role.enum";

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

    /**
     * Create a new user by Line User ID, return true if created, false if already exists
     * @param userId - The Line User ID
     * @param role - The role of the user
     */
    async insertUserIfNotExist(userId: string, role: UserRole): Promise<boolean> {
        const existingUser = await this.usersRepository.findByLineUserId(userId);
        if(existingUser) {
            return false;
        }

        const newUser = this.usersRepository.create({ 
            lineUserId: userId, 
            displayName: null, 
            role: role
        });
        const result = await this.usersRepository.save(newUser);
        console.log(result);

        return true;
    }

    async isUserTrainer(lineUserId: string): Promise<boolean> {
        const user = await this.usersRepository.findByLineUserIdAndRole(lineUserId, UserRole.TRAINER);
        if (!user) {
            return false;
        }
        return true;
    }
}