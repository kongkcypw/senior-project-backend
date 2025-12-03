import { Injectable } from "@nestjs/common";
import { UserPhysiqueHistoryEntity } from "../entities/user-physique-history.entity";
import { UserPhysiqueHistoryRepository } from "../repositories/user-physique-history.repository";
import { UserPhysiqueDto } from "../dto/user-physique.dto";
import { UserRepository } from "../repositories/user.repository";
import { LineMessagingApiGroupChatService } from "src/external/line-messaging-api/services/group-chat.service";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { TraineeInfoMessage } from "../messages/trainee-info.message";

@Injectable()
export class UserPhysiqueHistoryService {
    constructor(
        private readonly userPhysiqueHistoryRepository: UserPhysiqueHistoryRepository,
        private readonly userRepository: UserRepository,
        private readonly lineMessagingApiService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService
    ) { }

    async getPhysiqueHistoryByLineUserId(lineUserId: string): Promise<UserPhysiqueDto[]> {
        const entities = await this.userPhysiqueHistoryRepository.findByLineUserId(lineUserId);
        return entities.map(entity => UserPhysiqueDto.fromEntity(entity));
    }

    async insertPhysiqueHistoryForTrainee(
        params: {
            lineUserId: string,
            age: number,
            weight: number,
            height: number,
            bodyFatPercentage: number | null,
            goal: string,
        }
    ): Promise<void> {
        const newRecord = this.userPhysiqueHistoryRepository.create({
            lineUserId: params.lineUserId,
            age: params.age,
            weightKg: params.weight,
            heightCm: params.height,
            bodyFatPercentage: params.bodyFatPercentage,
            goal: params.goal,
        });
        await this.userPhysiqueHistoryRepository.save(newRecord);

        const userPhysiqueHistory = await this.userPhysiqueHistoryRepository.findByLineUserId(params.lineUserId);

        if (userPhysiqueHistory.length > 1) {
            return;
        }

        const user = await this.userRepository.findOneBy({ lineUserId: params.lineUserId });
        if (!user) {
            throw new Error("User not found");
        }

        const groupId = await this.lineGroupMemberService.findGroupIdByMemberLineUserId(user.lineUserId);

        if (!groupId) {
            return;
        }

        const message = TraineeInfoMessage(user.displayName, params.age, params.weight, params.height, params.bodyFatPercentage);
        await this.lineMessagingApiService.sendPushMessages(groupId, message);
    }
}