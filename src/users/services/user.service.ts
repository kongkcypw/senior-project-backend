import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRepository } from "../repositories/user.repository";
import { UserInfoDto } from "../dto/user-info.dto";
import { UserRole } from "../enums/user-role.enum";
import { UserEntity } from "../entities/user.entity";
import { UserRelationshipsRepository } from "../repositories/user-relationships.repository";
import { UserStatusDashboardDto } from "../dto/user-status-dashboard.dto";

@Injectable()
export class UserService {
    constructor(
        private readonly usersRepository: UserRepository,
        private readonly userRelationshipsRepository: UserRelationshipsRepository
    ) { }

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
            pictureUrl: user.pictureUrl,
            role: user.role,
        };

    }

    /**
     * Create a new user by Line User ID, return true if created, false if already exists
     * @param userId - The Line User ID
     * @param displayName - The display name of the user
     * @param role - The role of the user
     * @param pictureUrl - The picture URL of the user
     */
    async insertUserIfNotExist(userId: string, displayName: string | null, role: UserRole, pictureUrl: string | null): Promise<void> {
        const existingUser = await this.usersRepository.findByLineUserId(userId);
        if (existingUser) {
            return;
        }

        const newUser = this.usersRepository.create({
            lineUserId: userId,
            displayName,
            role,
            pictureUrl,
        });
        const result = await this.usersRepository.save(newUser);
        console.log(result);
    }

    async findTrainerByLineUserId(lineUserId: string): Promise<UserEntity | null> {
        return await this.usersRepository.findByLineUserIdAndRole(lineUserId, UserRole.TRAINER);
    }

    async updateDisplayName(lineUserId: string, displayName: string): Promise<void> {
        const user = await this.usersRepository.findByLineUserId(lineUserId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.displayName = displayName;
        await this.usersRepository.save(user);
    }

    async updatePictureUrl(lineUserId: string, pictureUrl: string): Promise<void> {
        const user = await this.usersRepository.findByLineUserId(lineUserId);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        user.pictureUrl = pictureUrl;
        await this.usersRepository.save(user);
    }

    /**
     * Find user status for eligible dashboard access
     * @param lineUserId - The Line User ID
     * @returns User status for eligible dashboard access
     */
    async findUserStatusForEligibleDashboardAccess(lineUserId: string): Promise<UserStatusDashboardDto | null> {
        const user = await this.usersRepository.findByLineUserId(lineUserId);

        if (!user) {
            return null
        }

        let isActiveTrainee = false;
        if (user.role === UserRole.TRAINEE) {
            const activeRelationship = await this.userRelationshipsRepository.findActiveRelationshipsByTrainee(lineUserId);
            isActiveTrainee = activeRelationship !== null;
        }

        return {
            id: user.id,
            lineUserId: user.lineUserId,
            displayName: user.displayName,
            pictureUrl: user.pictureUrl,
            role: user.role,
            isTrainer: user.role === UserRole.TRAINER,
            isActiveTrainee: isActiveTrainee
        };
    }
}