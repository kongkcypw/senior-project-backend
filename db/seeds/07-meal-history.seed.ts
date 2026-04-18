import { MealHistoryEntity } from "src/nutrition/entities/meal-history.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";

type MealHistorySeedType = Omit<MealHistoryEntity, 'updatedAt' | 'user'>

function meal(year: number, month: number, date: number, hour = 12): Date {
    return new Date(year, month - 1, date, hour, 0, 0);
}

// All dates relative to today: 2026-04-18 (Friday)
// Daily window  : Apr 18
// Weekly window : Apr 14 (Mon) – Apr 20 (Sun)
// Monthly window: Apr 1 – Apr 30

export class MockMealHistory {

    // -----------------------------------------------------------------------
    // Latif Danai — plan (2500 cal / 150p / 200c / 90f daily)
    // Logs Apr 14 & Apr 18 only — ~3 meals/day, ~1050–1200 cal/day (~46% adherence)
    // -----------------------------------------------------------------------

    // Apr 14 – Monday
    static readonly MEAL_L01: MealHistorySeedType = {
        id: 1, lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        foodTitle: 'โอ๊ตมีลกล้วยหอม',
        imageUrl: '',
        calories: 320, protein: 10, carbohydrate: 60, fat: 5,
        createdAt: meal(2026, 4, 14, 7),
        ingredients: [
            { name: 'ข้าวโอ๊ต', quantity: 80, quantityUnit: 'กรัม' },
            { name: 'กล้วยหอม', quantity: 1, quantityUnit: 'ผล' },
            { name: 'นมไขมันต่ำ', quantity: 150, quantityUnit: 'มล.' },
        ],
        confirmAt: null,
    };
    static readonly MEAL_L02: MealHistorySeedType = {
        id: 2, lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        foodTitle: 'ข้าวกล้องอกไก่ต้มน้ำสมุนไพร',
        imageUrl: '',
        calories: 380, protein: 38, carbohydrate: 40, fat: 5,
        createdAt: meal(2026, 4, 14, 12),
        ingredients: [
            { name: 'ข้าวกล้อง', quantity: 150, quantityUnit: 'กรัม' },
            { name: 'อกไก่', quantity: 150, quantityUnit: 'กรัม' },
            { name: 'ตะไคร้', quantity: 1, quantityUnit: 'ต้น' },
        ],
        confirmAt: null,
    };
    static readonly MEAL_L03: MealHistorySeedType = {
        id: 3, lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        foodTitle: 'หมูผัดพริกแกงไข่ดาว',
        imageUrl: 'https://www.lemon8-app.com/seo/image?item_id=7288567503658238466&index=0&sign=28bed1477283131a0521d9af5cc0ba70',
        calories: 550, protein: 30, carbohydrate: 45, fat: 25,
        createdAt: meal(2026, 4, 14, 19),
        ingredients: [
            { name: 'หมู', quantity: 150, quantityUnit: 'กรัม' },
            { name: 'พริกแกงแดง', quantity: 2, quantityUnit: 'ช้อนโต๊ะ' },
            { name: 'ไข่ไก่', quantity: 1, quantityUnit: 'ฟอง' },
            { name: 'ข้าวกล้อง', quantity: 150, quantityUnit: 'กรัม' },
        ],
        confirmAt: null,
    };

    // Apr 18 – Friday
    static readonly MEAL_L04: MealHistorySeedType = {
        id: 4, lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        foodTitle: 'ไข่ต้ม 2 ฟอง + ขนมปังโฮลวีท',
        imageUrl: '',
        calories: 290, protein: 15, carbohydrate: 32, fat: 12,
        createdAt: meal(2026, 4, 18, 7),
        ingredients: [
            { name: 'ไข่ไก่', quantity: 2, quantityUnit: 'ฟอง' },
            { name: 'ขนมปังโฮลวีท', quantity: 2, quantityUnit: 'แผ่น' },
        ],
        confirmAt: null,
    };
    static readonly MEAL_L05: MealHistorySeedType = {
        id: 5, lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        foodTitle: 'ข้าวกล้องปลาทูนึ่งผัก',
        imageUrl: '',
        calories: 360, protein: 28, carbohydrate: 40, fat: 9,
        createdAt: meal(2026, 4, 18, 12),
        ingredients: [
            { name: 'ข้าวกล้อง', quantity: 150, quantityUnit: 'กรัม' },
            { name: 'ปลาทู', quantity: 100, quantityUnit: 'กรัม' },
            { name: 'ผักต้ม', quantity: 100, quantityUnit: 'กรัม' },
        ],
        confirmAt: null,
    };
    static readonly MEAL_L06: MealHistorySeedType = {
        id: 6, lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        foodTitle: 'กระเพราไก่ไข่ดาวข้าวกล้อง',
        imageUrl: 'https://fit-d.com/uploads/food/afb2ccb7050c6a64d52b7e3736d3a6f8.jpg',
        calories: 480, protein: 30, carbohydrate: 42, fat: 18,
        createdAt: meal(2026, 4, 18, 19),
        ingredients: [
            { name: 'อกไก่', quantity: 150, quantityUnit: 'กรัม' },
            { name: 'ไข่ไก่', quantity: 1, quantityUnit: 'ฟอง' },
            { name: 'ข้าวกล้อง', quantity: 150, quantityUnit: 'กรัม' },
            { name: 'กระเพรา', quantity: 1, quantityUnit: 'กำ' },
        ],
        confirmAt: null,
    };

    // -----------------------------------------------------------------------
    // Arisa Natcha — plan (2000 cal / 120p / 200c / 65f daily)
    // HIGH performer: 3 meals/day every day Apr 11–18 (~90% adherence, ~1800 cal/day)
    // -----------------------------------------------------------------------

    // Apr 11 – Saturday
    static readonly MEAL_A01: MealHistorySeedType = { id: 10, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'โอ๊ตมีลกล้วยหอมนมโปรตีน', imageUrl: '', calories: 390, protein: 22, carbohydrate: 62, fat: 6, createdAt: meal(2026, 4, 11, 7), ingredients: [{ name: 'ข้าวโอ๊ต', quantity: 80, quantityUnit: 'กรัม' }, { name: 'กล้วยหอม', quantity: 1, quantityUnit: 'ผล' }, { name: 'เวย์โปรตีน', quantity: 30, quantityUnit: 'กรัม' }], confirmAt: null };
    static readonly MEAL_A02: MealHistorySeedType = { id: 11, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ข้าวกล้องอกไก่ย่าง', imageUrl: '', calories: 680, protein: 52, carbohydrate: 70, fat: 18, createdAt: meal(2026, 4, 11, 12), ingredients: [{ name: 'ข้าวกล้อง', quantity: 200, quantityUnit: 'กรัม' }, { name: 'อกไก่ย่าง', quantity: 150, quantityUnit: 'กรัม' }], confirmAt: null };
    static readonly MEAL_A03: MealHistorySeedType = { id: 12, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ผัดผักรวมอกไก่ข้าวกล้อง', imageUrl: '', calories: 730, protein: 34, carbohydrate: 48, fat: 34, createdAt: meal(2026, 4, 11, 19), ingredients: [], confirmAt: null };

    // Apr 12 – Sunday
    static readonly MEAL_A04: MealHistorySeedType = { id: 13, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ไข่ต้ม 2 ฟอง + ขนมปังโฮลวีท', imageUrl: '', calories: 390, protein: 18, carbohydrate: 50, fat: 14, createdAt: meal(2026, 4, 12, 7), ingredients: [{ name: 'ไข่ไก่', quantity: 2, quantityUnit: 'ฟอง' }, { name: 'ขนมปังโฮลวีท', quantity: 2, quantityUnit: 'แผ่น' }], confirmAt: null };
    static readonly MEAL_A05: MealHistorySeedType = { id: 14, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ข้าวกล้องปลาทูนึ่ง + ผัก', imageUrl: '', calories: 680, protein: 40, carbohydrate: 72, fat: 22, createdAt: meal(2026, 4, 12, 12), ingredients: [], confirmAt: null };
    static readonly MEAL_A06: MealHistorySeedType = { id: 15, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ต้มยำไก่ข้าวกล้อง', imageUrl: '', calories: 750, protein: 50, carbohydrate: 58, fat: 22, createdAt: meal(2026, 4, 12, 19), ingredients: [], confirmAt: null };

    // Apr 13 – Monday
    static readonly MEAL_A07: MealHistorySeedType = { id: 16, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'โปรตีนเชค + กล้วย 2 ผล', imageUrl: '', calories: 390, protein: 26, carbohydrate: 70, fat: 2, createdAt: meal(2026, 4, 13, 7), ingredients: [{ name: 'เวย์โปรตีน', quantity: 30, quantityUnit: 'กรัม' }, { name: 'กล้วยหอม', quantity: 2, quantityUnit: 'ผล' }, { name: 'นมไขมันต่ำ', quantity: 200, quantityUnit: 'มล.' }], confirmAt: null };
    static readonly MEAL_A08: MealHistorySeedType = { id: 17, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'สลัดไก่กรีลล์ข้าวกล้อง', imageUrl: '', calories: 680, protein: 50, carbohydrate: 52, fat: 22, createdAt: meal(2026, 4, 13, 12), ingredients: [], confirmAt: null };
    static readonly MEAL_A09: MealHistorySeedType = { id: 18, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ไก่ย่างส้มตำข้าวกล้อง', imageUrl: '', calories: 730, protein: 32, carbohydrate: 58, fat: 34, createdAt: meal(2026, 4, 13, 19), ingredients: [], confirmAt: null };

    // Apr 14 – Tuesday
    static readonly MEAL_A10: MealHistorySeedType = { id: 19, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'โยเกิร์ตกรีก + กล้วย + กราโนลา', imageUrl: '', calories: 390, protein: 20, carbohydrate: 60, fat: 8, createdAt: meal(2026, 4, 14, 7), ingredients: [{ name: 'โยเกิร์ตกรีก', quantity: 150, quantityUnit: 'กรัม' }, { name: 'กล้วยหอม', quantity: 1, quantityUnit: 'ผล' }, { name: 'กราโนลา', quantity: 40, quantityUnit: 'กรัม' }], confirmAt: null };
    static readonly MEAL_A11: MealHistorySeedType = { id: 20, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ข้าวกล้องอกไก่ต้มน้ำสมุนไพร', imageUrl: '', calories: 680, protein: 56, carbohydrate: 60, fat: 14, createdAt: meal(2026, 4, 14, 12), ingredients: [{ name: 'ข้าวกล้อง', quantity: 200, quantityUnit: 'กรัม' }, { name: 'อกไก่', quantity: 150, quantityUnit: 'กรัม' }], confirmAt: null };
    static readonly MEAL_A12: MealHistorySeedType = { id: 21, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'กะเพราไก่ไข่ดาวข้าวกล้อง', imageUrl: '', calories: 730, protein: 32, carbohydrate: 60, fat: 36, createdAt: meal(2026, 4, 14, 19), ingredients: [], confirmAt: null };

    // Apr 15 – Wednesday
    static readonly MEAL_A13: MealHistorySeedType = { id: 22, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'โอ๊ตมีลไข่ขาว + สตรอเบอร์รี่', imageUrl: '', calories: 390, protein: 20, carbohydrate: 58, fat: 6, createdAt: meal(2026, 4, 15, 7), ingredients: [], confirmAt: null };
    static readonly MEAL_A14: MealHistorySeedType = { id: 23, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ข้าวกล้องอกไก่ย่างมะนาว', imageUrl: '', calories: 680, protein: 52, carbohydrate: 70, fat: 18, createdAt: meal(2026, 4, 15, 12), ingredients: [], confirmAt: null };
    static readonly MEAL_A15: MealHistorySeedType = { id: 24, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ต้มข่าไก่ข้าวกล้อง', imageUrl: '', calories: 730, protein: 36, carbohydrate: 52, fat: 34, createdAt: meal(2026, 4, 15, 19), ingredients: [], confirmAt: null };

    // Apr 16 – Thursday
    static readonly MEAL_A16: MealHistorySeedType = { id: 25, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ไข่ต้ม 2 ฟอง + กล้วย + นมไขมันต่ำ', imageUrl: '', calories: 390, protein: 18, carbohydrate: 56, fat: 10, createdAt: meal(2026, 4, 16, 7), ingredients: [{ name: 'ไข่ไก่', quantity: 2, quantityUnit: 'ฟอง' }, { name: 'กล้วยหอม', quantity: 1, quantityUnit: 'ผล' }, { name: 'นมไขมันต่ำ', quantity: 200, quantityUnit: 'มล.' }], confirmAt: null };
    static readonly MEAL_A17: MealHistorySeedType = { id: 26, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ข้าวกล้องปลาทูนึ่งผัก', imageUrl: '', calories: 680, protein: 40, carbohydrate: 72, fat: 22, createdAt: meal(2026, 4, 16, 12), ingredients: [], confirmAt: null };
    static readonly MEAL_A18: MealHistorySeedType = { id: 27, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ผัดกะหล่ำปลีอกไก่ข้าวกล้อง', imageUrl: '', calories: 730, protein: 50, carbohydrate: 52, fat: 26, createdAt: meal(2026, 4, 16, 19), ingredients: [], confirmAt: null };

    // Apr 17 – Friday
    static readonly MEAL_A19: MealHistorySeedType = { id: 28, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'โปรตีนเชค + กล้วย', imageUrl: '', calories: 390, protein: 26, carbohydrate: 70, fat: 2, createdAt: meal(2026, 4, 17, 7), ingredients: [], confirmAt: null };
    static readonly MEAL_A20: MealHistorySeedType = { id: 29, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'สลัดไก่กรีลล์ข้าวกล้อง', imageUrl: '', calories: 680, protein: 50, carbohydrate: 52, fat: 22, createdAt: meal(2026, 4, 17, 12), ingredients: [], confirmAt: null };
    static readonly MEAL_A21: MealHistorySeedType = { id: 30, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'อกไก่อบเครื่องเทศ + มันเทศ + ผักสด', imageUrl: '', calories: 730, protein: 32, carbohydrate: 58, fat: 34, createdAt: meal(2026, 4, 17, 19), ingredients: [], confirmAt: null };

    // Apr 18 – Saturday (today)
    static readonly MEAL_A22: MealHistorySeedType = { id: 31, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'โอ๊ตมีลกล้วยหอม', imageUrl: '', calories: 390, protein: 12, carbohydrate: 74, fat: 8, createdAt: meal(2026, 4, 18, 7), ingredients: [{ name: 'ข้าวโอ๊ต', quantity: 80, quantityUnit: 'กรัม' }, { name: 'กล้วยหอม', quantity: 1, quantityUnit: 'ผล' }], confirmAt: null };
    static readonly MEAL_A23: MealHistorySeedType = { id: 32, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ข้าวกล้องอกไก่ต้ม', imageUrl: '', calories: 680, protein: 56, carbohydrate: 60, fat: 14, createdAt: meal(2026, 4, 18, 12), ingredients: [{ name: 'ข้าวกล้อง', quantity: 200, quantityUnit: 'กรัม' }, { name: 'อกไก่', quantity: 150, quantityUnit: 'กรัม' }], confirmAt: null };
    static readonly MEAL_A24: MealHistorySeedType = { id: 33, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'ไก่ย่างหมักสมุนไพรข้าวกล้อง', imageUrl: '', calories: 730, protein: 40, carbohydrate: 46, fat: 36, createdAt: meal(2026, 4, 18, 19), ingredients: [], confirmAt: null };

    // -----------------------------------------------------------------------
    // Tawan Kraiwit — plan (2200 cal / 140p / 220c / 70f daily)
    // MEDIUM: logs Apr 14, 16, 18 — 3 meals/day, ~1200 cal/day (~55% adherence)
    // -----------------------------------------------------------------------

    // Apr 14
    static readonly MEAL_T01: MealHistorySeedType = { id: 40, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'ข้าวต้มไก่', imageUrl: '', calories: 300, protein: 18, carbohydrate: 42, fat: 5, createdAt: meal(2026, 4, 14, 8), ingredients: [{ name: 'ข้าว', quantity: 100, quantityUnit: 'กรัม' }, { name: 'ไก่', quantity: 80, quantityUnit: 'กรัม' }], confirmAt: null };
    static readonly MEAL_T02: MealHistorySeedType = { id: 41, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'ข้าวกล้องไก่ต้ม', imageUrl: '', calories: 490, protein: 42, carbohydrate: 52, fat: 10, createdAt: meal(2026, 4, 14, 13), ingredients: [], confirmAt: null };
    static readonly MEAL_T03: MealHistorySeedType = { id: 42, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'ผัดผักรวมข้าว', imageUrl: '', calories: 410, protein: 12, carbohydrate: 58, fat: 12, createdAt: meal(2026, 4, 14, 19), ingredients: [], confirmAt: null };

    // Apr 16
    static readonly MEAL_T04: MealHistorySeedType = { id: 43, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'โจ๊กหมู', imageUrl: '', calories: 310, protein: 20, carbohydrate: 48, fat: 5, createdAt: meal(2026, 4, 16, 7), ingredients: [{ name: 'ข้าว', quantity: 80, quantityUnit: 'กรัม' }, { name: 'หมูสับ', quantity: 80, quantityUnit: 'กรัม' }], confirmAt: null };
    static readonly MEAL_T05: MealHistorySeedType = { id: 44, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'ข้าวกะเพราหมูไข่ดาว', imageUrl: '', calories: 510, protein: 26, carbohydrate: 60, fat: 20, createdAt: meal(2026, 4, 16, 12), ingredients: [], confirmAt: null };
    static readonly MEAL_T06: MealHistorySeedType = { id: 45, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'ต้มยำปลา + ข้าว', imageUrl: '', calories: 380, protein: 24, carbohydrate: 48, fat: 8, createdAt: meal(2026, 4, 16, 19), ingredients: [], confirmAt: null };

    // Apr 18 (today)
    static readonly MEAL_T07: MealHistorySeedType = { id: 46, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'ไข่ต้ม 2 ฟอง + ขนมปัง', imageUrl: '', calories: 340, protein: 16, carbohydrate: 38, fat: 12, createdAt: meal(2026, 4, 18, 8), ingredients: [{ name: 'ไข่ไก่', quantity: 2, quantityUnit: 'ฟอง' }, { name: 'ขนมปัง', quantity: 2, quantityUnit: 'แผ่น' }], confirmAt: null };
    static readonly MEAL_T08: MealHistorySeedType = { id: 47, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'ข้าวกล้องปลาทู', imageUrl: '', calories: 480, protein: 30, carbohydrate: 55, fat: 14, createdAt: meal(2026, 4, 18, 13), ingredients: [], confirmAt: null };
    static readonly MEAL_T09: MealHistorySeedType = { id: 48, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'กะเพราไก่ข้าวกล้อง', imageUrl: '', calories: 380, protein: 27, carbohydrate: 40, fat: 12, createdAt: meal(2026, 4, 18, 19), ingredients: [], confirmAt: null };

    // -----------------------------------------------------------------------
    // Nuch Piyanat — plan (1800 cal / 100p / 180c / 55f daily)
    // LOW performer: logs Apr 18 only, 2 small meals (~22% adherence)
    // -----------------------------------------------------------------------
    static readonly MEAL_N01: MealHistorySeedType = { id: 50, lineUserId: MockUsers.TRAINEE_USER_006.lineUserId, foodTitle: 'ขนมปังปิ้งไข่ดาว', imageUrl: '', calories: 240, protein: 10, carbohydrate: 30, fat: 8, createdAt: meal(2026, 4, 18, 9), ingredients: [{ name: 'ขนมปัง', quantity: 2, quantityUnit: 'แผ่น' }, { name: 'ไข่ไก่', quantity: 1, quantityUnit: 'ฟอง' }], confirmAt: null };
    static readonly MEAL_N02: MealHistorySeedType = { id: 51, lineUserId: MockUsers.TRAINEE_USER_006.lineUserId, foodTitle: 'ข้าวต้มน้ำ', imageUrl: '', calories: 160, protein: 5, carbohydrate: 34, fat: 1, createdAt: meal(2026, 4, 18, 14), ingredients: [{ name: 'ข้าว', quantity: 100, quantityUnit: 'กรัม' }], confirmAt: null };

    static readonly MealHistories = [
        this.MEAL_L01, this.MEAL_L02, this.MEAL_L03,
        this.MEAL_L04, this.MEAL_L05, this.MEAL_L06,
        this.MEAL_A01, this.MEAL_A02, this.MEAL_A03,
        this.MEAL_A04, this.MEAL_A05, this.MEAL_A06,
        this.MEAL_A07, this.MEAL_A08, this.MEAL_A09,
        this.MEAL_A10, this.MEAL_A11, this.MEAL_A12,
        this.MEAL_A13, this.MEAL_A14, this.MEAL_A15,
        this.MEAL_A16, this.MEAL_A17, this.MEAL_A18,
        this.MEAL_A19, this.MEAL_A20, this.MEAL_A21,
        this.MEAL_A22, this.MEAL_A23, this.MEAL_A24,
        this.MEAL_T01, this.MEAL_T02, this.MEAL_T03,
        this.MEAL_T04, this.MEAL_T05, this.MEAL_T06,
        this.MEAL_T07, this.MEAL_T08, this.MEAL_T09,
        this.MEAL_N01, this.MEAL_N02,
    ];
}

export default class MockMealHistorySeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(MealHistoryEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        );
        await repository.save(MockMealHistory.MealHistories);
    }
}
