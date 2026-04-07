import { MealHistoryEntity } from "src/nutrition/entities/meal-history.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";

type MealHistorySeedType = Omit<MealHistoryEntity, 'updatedAt' | 'user'>

// Helper to produce a Date at noon on a specific calendar day
function day(year: number, month: number, date: number): Date {
    return new Date(year, month - 1, date, 12, 0, 0);
}

// All dates relative to today: 2026-04-08 (Tuesday)
// Daily window  : Apr 8
// Weekly window : Apr 6 (Mon) – Apr 12 (Sun)
// Monthly window: Apr 1 – Apr 30

export class MockMealHistory {

    // -----------------------------------------------------------------------
    // Latif Danai  — moderate plan (2500 cal / 150p / 200c / 90f daily)
    // Logs today only → daily nutrition ~44% adherence → ~22 pts
    // -----------------------------------------------------------------------
    static readonly MEAL_001: MealHistorySeedType = {
        id: 1,
        lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        imageUrl: "https://www.lemon8-app.com/seo/image?item_id=7288567503658238466&index=0&sign=28bed1477283131a0521d9af5cc0ba70",
        foodTitle: 'หมูผัดพริกแกงไข่ดาว',
        calories: 550,
        carbohydrate: 45,
        protein: 30,
        fat: 25,
        createdAt: day(2026, 4, 8),
        ingredients: [
            { name: "หมู", quantity: 150, quantityUnit: "กรัม" },
            { name: "พริกแกงแดง", quantity: 2, quantityUnit: "ช้อนโต๊ะ" },
            { name: "ไข่ไก่", quantity: 1, quantityUnit: "ฟอง" },
        ],
        confirmAt: null,
    };

    static readonly MEAL_002: MealHistorySeedType = {
        id: 2,
        lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        imageUrl: "https://fit-d.com/uploads/food/afb2ccb7050c6a64d52b7e3736d3a6f8.jpg",
        foodTitle: 'กระเพราไก่ไข่ดาว',
        calories: 650,
        carbohydrate: 37,
        protein: 30,
        fat: 15,
        createdAt: day(2026, 4, 8),
        ingredients: [
            { name: "ไก่", quantity: 150, quantityUnit: "กรัม" },
            { name: "ไข่", quantity: 1, quantityUnit: "ฟอง" },
            { name: "ข้าว", quantity: 250, quantityUnit: "กรัม" },
        ],
        confirmAt: null,
    };

    // -----------------------------------------------------------------------
    // Arisa Natcha — plan (2000 cal / 120p / 200c / 65f daily)
    // HIGH performer: logs every day Apr 1-8 (~90% adherence each day)
    // One summary meal per day: ~1800 cal, 108p, 180c, 58f
    // Expected daily nutrition: ~90% avg → 45 pts
    // -----------------------------------------------------------------------
    static readonly MEAL_A01: MealHistorySeedType = { id: 10, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1800, protein: 108, carbohydrate: 180, fat: 58, createdAt: day(2026, 4, 1), ingredients: [], confirmAt: null };
    static readonly MEAL_A02: MealHistorySeedType = { id: 11, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1820, protein: 110, carbohydrate: 182, fat: 59, createdAt: day(2026, 4, 2), ingredients: [], confirmAt: null };
    static readonly MEAL_A03: MealHistorySeedType = { id: 12, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1780, protein: 107, carbohydrate: 178, fat: 57, createdAt: day(2026, 4, 3), ingredients: [], confirmAt: null };
    static readonly MEAL_A04: MealHistorySeedType = { id: 13, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1800, protein: 108, carbohydrate: 180, fat: 58, createdAt: day(2026, 4, 4), ingredients: [], confirmAt: null };
    static readonly MEAL_A05: MealHistorySeedType = { id: 14, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1850, protein: 112, carbohydrate: 185, fat: 60, createdAt: day(2026, 4, 5), ingredients: [], confirmAt: null };
    static readonly MEAL_A06: MealHistorySeedType = { id: 15, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1800, protein: 108, carbohydrate: 180, fat: 58, createdAt: day(2026, 4, 6), ingredients: [], confirmAt: null };
    static readonly MEAL_A07: MealHistorySeedType = { id: 16, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1820, protein: 109, carbohydrate: 182, fat: 59, createdAt: day(2026, 4, 7), ingredients: [], confirmAt: null };
    static readonly MEAL_A08: MealHistorySeedType = { id: 17, lineUserId: MockUsers.TRAINEE_USER_004.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1800, protein: 108, carbohydrate: 180, fat: 58, createdAt: day(2026, 4, 8), ingredients: [], confirmAt: null };

    // -----------------------------------------------------------------------
    // Tawan Kraiwit — plan (2200 cal / 140p / 220c / 70f daily)
    // MEDIUM performer: logs 3 of the 8 days (~55% adherence per logged day)
    // Days logged: Apr 6, 7, 8  — ~1200 cal each
    // -----------------------------------------------------------------------
    static readonly MEAL_T01: MealHistorySeedType = { id: 20, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1200, protein: 72, carbohydrate: 121, fat: 38, createdAt: day(2026, 4, 6), ingredients: [], confirmAt: null };
    static readonly MEAL_T02: MealHistorySeedType = { id: 21, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1180, protein: 70, carbohydrate: 118, fat: 37, createdAt: day(2026, 4, 7), ingredients: [], confirmAt: null };
    static readonly MEAL_T03: MealHistorySeedType = { id: 22, lineUserId: MockUsers.TRAINEE_USER_005.lineUserId, foodTitle: 'อาหารรวม', imageUrl: '', calories: 1220, protein: 73, carbohydrate: 122, fat: 39, createdAt: day(2026, 4, 8), ingredients: [], confirmAt: null };

    // -----------------------------------------------------------------------
    // Nuch Piyanat — plan (1800 cal / 100p / 180c / 55f daily)
    // LOW performer: only logs today, very small meal (~22% adherence)
    // -----------------------------------------------------------------------
    static readonly MEAL_N01: MealHistorySeedType = { id: 30, lineUserId: MockUsers.TRAINEE_USER_006.lineUserId, foodTitle: 'ขนมปัง', imageUrl: '', calories: 400, protein: 22, carbohydrate: 40, fat: 12, createdAt: day(2026, 4, 8), ingredients: [], confirmAt: null };

    static readonly MealHistories = [
        this.MEAL_001,
        this.MEAL_002,
        this.MEAL_A01, this.MEAL_A02, this.MEAL_A03, this.MEAL_A04,
        this.MEAL_A05, this.MEAL_A06, this.MEAL_A07, this.MEAL_A08,
        this.MEAL_T01, this.MEAL_T02, this.MEAL_T03,
        this.MEAL_N01,
    ]
}

export default class MockMealHistorySeed implements Seeder {
    async run(dataSource: DataSource): Promise<void> {
        const repository = dataSource.getRepository(MealHistoryEntity);
        await repository.query(
            `TRUNCATE "${repository.metadata.tableName}" RESTART IDENTITY CASCADE;`
        )
        await repository.save(MockMealHistory.MealHistories);
    }
}
