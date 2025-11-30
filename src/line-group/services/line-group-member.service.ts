import { Injectable } from "@nestjs/common";
import { IsNull } from "typeorm";
import { LineGroupMemberRepository } from "../repositories/line-group-member.repository";
import { UserEntity } from "src/users/entities/user.entity";

@Injectable()
export class LineGroupMemberService {
    constructor(
        private readonly lineGroupMemberRepository: LineGroupMemberRepository,
    ) { }

    async insertGroupMemberIfNotExist(groupId: string, lineUserId: string) {
        const existingMember = await this.lineGroupMemberRepository.findByGroupIdAndLineUserId(groupId, lineUserId);

        // Member already exists, do nothing
        if (existingMember && existingMember.leaveGroupAt === null) {
            return;
        }

        // Member existed but had left before, update leaveGroupAt to null
        if (existingMember && existingMember.leaveGroupAt !== null) {
            existingMember.leaveGroupAt = null;
            await this.lineGroupMemberRepository.save(existingMember);
            return;
        }

        const newMember = this.lineGroupMemberRepository.create({
            lineGroupId: groupId,
            lineUserId: lineUserId,
            joinGroupAt: new Date(),
            leaveGroupAt: null,
        });

        await this.lineGroupMemberRepository.save(newMember);
    }

    async markMemberAsLeft(groupId: string, lineUserId: string): Promise<void> {
        const member = await this.lineGroupMemberRepository.findByGroupIdAndLineUserId(groupId, lineUserId);
        if (member) {
            member.leaveGroupAt = new Date();
            await this.lineGroupMemberRepository.save(member);
        }
    }
    async findGroupIdByMemberLineUserId(lineUserId: string): Promise<string | null> {
        const groupMember = await this.lineGroupMemberRepository.findOne({
            where: { lineUserId: lineUserId, leaveGroupAt: IsNull() },
        });
        return groupMember?.lineGroupId || null;
    }

    async findTrainerInGroup(groupId: string): Promise<UserEntity | null> {
        const trainerMember = await this.lineGroupMemberRepository.findTrainerInGroup(groupId);

        if (!trainerMember) {
            return null;
        }

        return trainerMember.user;
    }
}   