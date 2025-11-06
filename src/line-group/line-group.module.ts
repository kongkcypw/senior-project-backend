import { Module } from "@nestjs/common";
import { LineGroupRepository } from "./repositories/line-group.repository";
import { LineGroupMemberRepository } from "./repositories/line-group-member.entity";
import { LineGroupChatHistoryRepository } from "./repositories/line-group-chat-history.repository";
import { LineGroupService } from "./services/line-group.service";

@Module({
    imports: [],
    providers: [LineGroupRepository, LineGroupMemberRepository, LineGroupChatHistoryRepository, LineGroupService],
    controllers: [],
    exports: [LineGroupService]
})

export class LineGroupModule {}