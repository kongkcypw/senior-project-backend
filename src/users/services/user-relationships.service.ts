import { Injectable } from "@nestjs/common";
import { UserRelationshipsRepository } from "../repositories/user-relationships.repository";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";

@Injectable()
export class UserRelationshipsService {
    constructor(
        private readonly userRelationshipsRepository: UserRelationshipsRepository,
        private readonly lineGroupMemberService: LineGroupMemberService
    ) { }

    async isAssignedTrainerForTrainee(trainerLineUserId: string, traineeLineUserId: string): Promise<boolean> {
        const relationship = await this.userRelationshipsRepository.findActiveRelationshipsByTraineeAndTrainer(trainerLineUserId, traineeLineUserId);
        
        if (!relationship) {
            return false;
        }

        return true;
    }

    async insertTrainerRelationshipIfNotExist(groupId: string, traineeLineUserId: string): Promise<void> {

        const trainer = await this.lineGroupMemberService.findTrainerInGroup(groupId);
        if (!trainer) {
            throw new Error(`No trainer found in group ${groupId}`);
        }

        const existingRelationship = await this.userRelationshipsRepository.findActiveRelationshipsByTraineeAndTrainer(
            traineeLineUserId,
            trainer.lineUserId
        );

        if (existingRelationship) {
            return;
        }

        const newRelationship = this.userRelationshipsRepository.create({
            trainerLineUserId: trainer.lineUserId,
            traineeLineUserId,
        });

        await this.userRelationshipsRepository.save(newRelationship);
    }
}