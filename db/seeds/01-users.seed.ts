import { UsersEntity } from "src/users/entities/users.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export class MockUsers {
    static readonly USERS_001: UsersEntity = {
        id: 1,
        lineUserId: 'USER_LINE_ID_001',
        displayName: 'User One',
        role: 'user',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    static readonly Users = [
        this.USERS_001,
    ]
}

export default class MockUsersSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(UsersEntity);

        await repository.query(
            `TRUNCATE ${repository.metadata.tableName} RESTART IDENTITY CASCADE;`
        )

        await repository.save(MockUsers.Users);
    }
}