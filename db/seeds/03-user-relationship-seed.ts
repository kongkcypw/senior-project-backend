import { UserRelationshipEntity } from "src/users/entities/user-relationships.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";

type UserRelationshipSeedType = Omit<UserRelationshipEntity, 'createdAt' | 'updatedAt' | 'trainer' | 'trainee'>;

export class MockUserRelationships {
    static readonly USER_RELATIONSHIP_001: UserRelationshipSeedType = {
        id: 1,
        trainerLineUserId: MockUsers.TRAINER_USER_001.lineUserId,
        traineeLineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        assignedAt: new Date(),
        unassignedAt: null,
        isActive: true,
    };

    static readonly UserRelationships = [
        this.USER_RELATIONSHIP_001,
    ]
}

export default class MockUserRelationshipSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(UserRelationshipEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockUserRelationships.UserRelationships);
    }
}