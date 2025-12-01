import { LineGroupMemberEntity } from "src/line-group/entities/line-group-member.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockLineGroups } from "./02-line-group.seed";
import { MockUsers } from "./01-users.seed";

type LineGroupMemberType = Omit<LineGroupMemberEntity, 'createdAt' | 'updatedAt' | 'lineGroup' | 'user' | 'group'>;

export class MockLineGroupMembers {

    static readonly LINE_GROUP_MEMBER_001: LineGroupMemberType = {
        id: 1,
        lineGroupId: MockLineGroups.LINE_GROUP_001.lineGroupId,
        lineUserId: MockUsers.TRAINER_USER_001.lineUserId,
        joinGroupAt: new Date(),
        leaveGroupAt: null,
    };

    static readonly LINE_GROUP_MEMBER_002: LineGroupMemberType = {
        id: 1,
        lineGroupId: MockLineGroups.LINE_GROUP_001.lineGroupId,
        lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        joinGroupAt: new Date(),
        leaveGroupAt: null,
    };

    static readonly LineGroupMembers = [
        this.LINE_GROUP_MEMBER_001,
        this.LINE_GROUP_MEMBER_002,
    ]
}

export default class MockLineGroupMemberSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(LineGroupMemberEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockLineGroupMembers.LineGroupMembers);
    }
}