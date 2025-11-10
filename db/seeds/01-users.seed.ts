import { UserEntity } from "src/users/entities/user.entity";
import { UserRole } from "src/users/enums/user-role.enum";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export class MockUsers {

    static readonly TRAINER_USER_001: UserEntity = {
        id: 1,
        lineUserId: 'U9254489272e28fd617b3d43a22c01d71',
        displayName: 'Kong Chayapol',
        role: UserRole.TRAINER,
        pictureUrl: 'https://sprofile.line-scdn.net/0h54lOtxNTahtBNnt3xLAUZDFmaXFiRzMJaAByLycwMCx1ASQabwQsKnwzNC19USsdPVIte30wMS9NJR19X2CWL0YGNyp9Dy1FblMi9A',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    static readonly Users = [
        this.TRAINER_USER_001,
    ]
}

export default class MockUsersSeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(UserEntity);

        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )

        await repository.save(MockUsers.Users);
    }
}