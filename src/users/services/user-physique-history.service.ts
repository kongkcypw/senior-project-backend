import { Injectable } from "@nestjs/common";
import { UserPhysiqueHistoryRepository } from "../repositories/user-physique-history.repository";
import { UserPhysiqueDto } from "../dto/user-physique.dto";
import { UserRepository } from "../repositories/user.repository";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { LineGroupMemberService } from "src/line-group/services/line-group-member.service";
import { LineLiffNavigatePathService } from "src/external/line-liff/services/line-liff-navigate-path.service";
import { PhysiqueInfoData, PhysiqueInfoMessage } from "src/webhook/dialogflow/messages/physique-info.message";
import { FeatureFlagService } from "src/feature-flag/services/feature-flag.service";
import { FeatureFlagKey } from "src/feature-flag/enums/feature-flag.constant";

@Injectable()
export class UserPhysiqueHistoryService {
    constructor(
        private readonly userPhysiqueHistoryRepository: UserPhysiqueHistoryRepository,
        private readonly userRepository: UserRepository,
        private readonly lineMessagingApiService: LineMessagingApiClientService,
        private readonly lineGroupMemberService: LineGroupMemberService,
        private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
        private readonly featureFlagService: FeatureFlagService,
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

        const isPushEnabled = await this.featureFlagService.isEnabled(FeatureFlagKey.PUSH_MESSAGE_FOR_LIFF_ACTION);
        if (!isPushEnabled) return;

        const groupId = await this.lineGroupMemberService.findGroupIdByMemberLineUserId(params.lineUserId);
        if (!groupId) return;

        const user = await this.userRepository.findOneBy({ lineUserId: params.lineUserId });

        const bkd = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const updatedAtText = `${bkd.getUTCDate().toString().padStart(2, '0')}/${(bkd.getUTCMonth() + 1).toString().padStart(2, '0')}/${bkd.getUTCFullYear()}`;

        const data: PhysiqueInfoData = {
            heightCm: params.height,
            weightKg: params.weight,
            bodyFatPercentage: params.bodyFatPercentage,
            goal: params.goal,
            updatedAtText,
        };
        const navigateUrl = this.lineLiffNavigatePathService.getBodyInformationPage(params.lineUserId);
        const messages = PhysiqueInfoMessage(data, user?.pictureUrl ?? null, navigateUrl);
        await this.lineMessagingApiService.sendPushMessages(groupId, messages);
    }
}
