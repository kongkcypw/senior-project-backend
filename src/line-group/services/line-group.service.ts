import { Injectable } from "@nestjs/common";
import { LineGroupRepository } from "../repositories/line-group.repository";
import { LineGroupMemberRepository } from "../repositories/line-group-member.entity";
import { LineGroupChatHistoryRepository } from "../repositories/line-group-chat-history.repository";

@Injectable()
export class LineGroupService {
    constructor(
        private readonly lineGroupRepository: LineGroupRepository,
        private readonly lineGroupMemberRepository: LineGroupMemberRepository,
        private readonly lineGroupChatHistoryRepository: LineGroupChatHistoryRepository
    ) {}

    /**
    *  Create a new line group record by group ID
    *  @param groupId: string - The unique identifier for the line group
    *  @param groupName: string | null - The name of the line group
    */
    async insertGroupIfNotExist(groupId: string, groupName: string | null): Promise<void> {
        // We use upsert to avoid duplicate entries when multiple members join at the same time
        const result = await this.lineGroupRepository.upsert(
            { lineGroupId: groupId, name: groupName }, // The data to insert/update
            ['lineGroupId'],             // The unique column to match on
        );
        console.log(result);
    }
}