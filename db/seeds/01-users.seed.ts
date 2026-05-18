import { UserEntity } from "src/users/entities/user.entity";
import { UserRole } from "src/users/enums/user-role.enum";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

export class MockUsers {

    // Note: We can provide actual lineUserId (it will be different with different LINE OA provider)

    static readonly TRAINER_USER_001: UserEntity = {
        id: 1,
        lineUserId: 'U9254489272e28fd617b3d43a22c01d71',
        displayName: 'Kong Chayapol',
        role: UserRole.TRAINER,
        pictureUrl: 'https://sprofile.line-scdn.net/0h54lOtxNTahtBNnt3xLAUZDFmaXFiRzMJaAByLycwMCx1ASQabwQsKnwzNC19USsdPVIte30wMS9NJR19X2CWL0YGNyp9Dy1FblMi9A',
        hasSeenOnboarding: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    static readonly TRAINEE_USER_002: UserEntity = {
        id: 2,
        lineUserId: 'U2201192bbe85b768b35cf892b8325443',
        displayName: 'Witcha',
        role: UserRole.TRAINEE,
        pictureUrl: 'https://sprofile.line-scdn.net/0hUUVEVAPOCnp7PBv_K-10RAtsCRBYTVNoV1kXHUhpV0lHDxklBF1GGU5rAU1DXx1-A1oRT0s7XE5ZZQVbFCMYYzVvIUsfcxJXD18ifRY8UkkZdUotFhIWdxB0Iw0_Dx1yI0YkYTZVE0kgRS0kDVokbDNbIjEjSxpwKWtmLH4OZPkUPn0vVltMHEY_V03P',
        hasSeenOnboarding: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    static readonly TRAINEE_USER_003: UserEntity = {
        id: 3,
        lineUserId: 'Ue2589f779cb7eb3107afcb35b9921bc2',
        displayName: 'Latif Danai',
        role: UserRole.TRAINEE,
        pictureUrl: 'https://sprofile.line-scdn.net/0hxxN63ENiJ1djTze5Gd1ZKBMfJD1APn5FRis9NlcfcTJXKDUIT3puYgJLfWdXLzIGGi1hNVZOeTNvXFAxfRnbY2R_emZfdmAJTCpvuA',
        hasSeenOnboarding: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // High performer — good macro adherence + consistent workout
    static readonly TRAINEE_USER_004: UserEntity = {
        id: 4,
        lineUserId: 'Uf1234567890abcdef1234567890abcde',
        displayName: 'Arisa Natcha',
        role: UserRole.TRAINEE,
        pictureUrl: null,
        hasSeenOnboarding: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // Medium performer — partial adherence
    static readonly TRAINEE_USER_005: UserEntity = {
        id: 5,
        lineUserId: 'Ua9876543210fedcba9876543210fedcb',
        displayName: 'Tawan Kraiwit',
        role: UserRole.TRAINEE,
        pictureUrl: null,
        hasSeenOnboarding: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // Low performer — minimal logs
    static readonly TRAINEE_USER_006: UserEntity = {
        id: 6,
        lineUserId: 'Ub1122334455667788990011223344556',
        displayName: 'Nuch Piyanat',
        role: UserRole.TRAINEE,
        pictureUrl: null,
        hasSeenOnboarding: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    // Personal user
    static readonly PERSONAL_USER_007: UserEntity = {
        id: 7,
        lineUserId: 'Upersonaluser00000000000000000000000',
        displayName: 'Prem',
        role: UserRole.TRAINEE,
        pictureUrl: 'https://profile.line-scdn.net/0hY8D-sFuABhd5VBnIPmN5QAQRCHoOegBfAWBNeFhcXXRXYRNHQTZOIVpQCCRRbBUSRWJOcVhRWCFVe0MDOGwvBT0gG0QCDxwRBTANMhQsMSEyABE8AE4LDhwVA3UWMycmQjEKCiYNCCUMeB4pHEoBJCAnXnoTDBU3Pm0',
        hasSeenOnboarding: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    static readonly Users = [
        this.TRAINER_USER_001,
        this.TRAINEE_USER_002,
        this.TRAINEE_USER_003,
        this.TRAINEE_USER_004,
        this.TRAINEE_USER_005,
        this.TRAINEE_USER_006,
        this.PERSONAL_USER_007,
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
