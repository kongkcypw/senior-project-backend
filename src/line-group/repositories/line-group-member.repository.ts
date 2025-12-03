import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LineGroupMemberEntity } from "../entities/line-group-member.entity";
import { UserRole } from "src/users/enums/user-role.enum";

@Injectable()
export class LineGroupMemberRepository extends Repository<LineGroupMemberEntity> {
    constructor(private datasource: DataSource) {
        super(LineGroupMemberEntity, datasource.createEntityManager());
    }

    async findByGroupIdAndLineUserId(groupId: string, lineUserId: string): Promise<LineGroupMemberEntity | null> {
        return this.findOne({ where: { lineGroupId: groupId, lineUserId } });
    }

    async findTrainerInGroup(groupId: string): Promise<LineGroupMemberEntity | null> {
        return this.createQueryBuilder('member')
            .where('member.line_group_id = :groupId', { groupId })
            .innerJoinAndSelect('member.user', 'user')
            .andWhere('user.role = :role', { role: UserRole.TRAINER })
            .andWhere('member.leave_group_at IS NULL')
            .getOne();
    }

    async findTraineeInGroup(groupId: string): Promise<LineGroupMemberEntity | null> {
        return this.createQueryBuilder('member')
            .where('member.line_group_id = :groupId', { groupId })
            .innerJoinAndSelect('member.user', 'user')
            .andWhere('user.role = :role', { role: UserRole.TRAINEE })
            .andWhere('member.leave_group_at IS NULL')
            .getOne();
    }
}