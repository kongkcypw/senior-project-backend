import { Injectable } from "@nestjs/common";
import { LineGroupMemberRepository } from "../repositories/line-group-member.entity";

@Injectable()
export class LineGroupMemberService {
    constructor(
        private readonly lineGroupMemberRepository: LineGroupMemberRepository,
    ) {}

    async insertGroupMemberIfNotExist(groupId: string, lineUserId: string) {
        const existingMember = await this.lineGroupMemberRepository.findByGroupIdAndLineUserId(groupId, lineUserId);
        if (existingMember) {
            // Member already exists, do nothing
            return;
        }

        const newMember = this.lineGroupMemberRepository.create({
            lineGroupId: groupId,
            lineUserId: lineUserId,
            joinGroupAt: new Date(),
        });

        await this.lineGroupMemberRepository.save(newMember);
    }
}