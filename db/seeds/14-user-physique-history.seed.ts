import { UserPhysiqueHistoryEntity } from "src/users/entities/user-physique-history.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";

type UserPhysiqueHistorySeedType = Omit<UserPhysiqueHistoryEntity, 'id' | 'createdAt' | 'updatedAt' | 'user'>;

export class MockUserPhysiqueHistory {
    // Kong Chayapol – Trainer, athletic build, strength focus
    static readonly KONG_PHYSIQUE: UserPhysiqueHistorySeedType = {
        lineUserId: MockUsers.TRAINER_USER_001.lineUserId,
        age: 28,
        heightCm: 178,
        weightKg: 82,
        bodyFatPercentage: 12,
        goal: 'รักษ์กล้ามเนื้อและความแข็งแรง',
    };

    // Latif Danai – Trainee, moderate physique, muscle gain focus
    static readonly LATIF_PHYSIQUE: UserPhysiqueHistorySeedType = {
        lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        age: 25,
        heightCm: 172,
        weightKg: 75,
        bodyFatPercentage: 18,
        goal: 'สร้างกล้ามเนื้อและความแข็งแรง',
    };

    // Arisa Natcha – HIGH performer, lean physique, aesthetic goal
    static readonly ARISA_PHYSIQUE: UserPhysiqueHistorySeedType = {
        lineUserId: MockUsers.TRAINEE_USER_004.lineUserId,
        age: 24,
        heightCm: 165,
        weightKg: 58,
        bodyFatPercentage: 22,
        goal: 'ลดไขมันและสร้างรูปร่างที่ดี',
    };

    // Tawan Kraiwit – MEDIUM performer, needs weight loss
    static readonly TAWAN_PHYSIQUE: UserPhysiqueHistorySeedType = {
        lineUserId: MockUsers.TRAINEE_USER_005.lineUserId,
        age: 32,
        heightCm: 170,
        weightKg: 88,
        bodyFatPercentage: 28,
        goal: 'ลดน้ำหนักและการออกกำลังกายเพื่อสุขภาพ',
    };

    // Nuch Piyanat – LOW performer, just starting fitness journey
    static readonly NUCH_PHYSIQUE: UserPhysiqueHistorySeedType = {
        lineUserId: MockUsers.TRAINEE_USER_006.lineUserId,
        age: 29,
        heightCm: 168,
        weightKg: 92,
        bodyFatPercentage: 32,
        goal: 'รักษาสุขภาพและเพิ่มความแข็งแรง',
    };

    static readonly PhysiqueHistories = [
        this.KONG_PHYSIQUE,
        this.LATIF_PHYSIQUE,
        this.ARISA_PHYSIQUE,
        this.TAWAN_PHYSIQUE,
        this.NUCH_PHYSIQUE,
    ];
}

export default class MockUserPhysiqueHistorySeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(UserPhysiqueHistoryEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        );
        await repository.save(MockUserPhysiqueHistory.PhysiqueHistories);
    }
}
