import { Injectable } from "@nestjs/common";
import { UserPhysiqueHistoryEntity } from "../entities/user-physique-history.entity";
import { UserPhysiqueHistoryRepository } from "../repositories/user-physique-history.repository";
import { UserPhysiqueDto } from "../dto/user-physique.dto";

@Injectable()
export class UserPhysiqueHistoryService {
    constructor(
        private readonly userPhysiqueHistoryRepository: UserPhysiqueHistoryRepository,
    ) { }

    async getPhysiqueHistoryByLineUserId(lineUserId: string): Promise<UserPhysiqueDto[]> {
        const entities = await this.userPhysiqueHistoryRepository.findByLineUserId(lineUserId);
        return entities.map(entity => UserPhysiqueDto.fromEntity(entity));
    }

    async insertPhysiqueHistoryForTrainee(
        params: {lineUserId: string,
        age: number,
        weight: number,
        height: number,
        bodyFatPercentage: number | null,
        goal: string,}
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
    }
}