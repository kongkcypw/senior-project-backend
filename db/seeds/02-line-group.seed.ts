import { LineGroupEntity } from "src/line-group/entities/line-groups.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

type LineGroupSeedType = Omit<LineGroupEntity, 'createdAt' | 'updatedAt'>;

export class MockLineGroups {
    static readonly LINE_GROUP_001: LineGroupSeedType = {
        id: 1,
        lineGroupId: 'Cddd814b28290b46e3e14c84562434f62',
        name: 'Test ขุนพันธ์ในกลุ่มมม',
        pictureUrl: 'https://sprofile.line-scdn.net/0hKS7hJghNFHwaEQsJ88lqA2pBFxY5d014MHNZHysQS0QidAMvMyAIGXsSGh9zcgF9PycIEy8YGkwWAmMaBEfoSB0hSU0mKFMiNXRckw',
        joinGroupAt: new Date(),
        leaveGroupAt: null,
    };

    static readonly LineGroups = [
        this.LINE_GROUP_001,
    ]
}

export default class MockLineGroupsSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(LineGroupEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockLineGroups.LineGroups);
    }
}