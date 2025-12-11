import { MealHistoryEntity } from "src/nutrition/entities/meal-history.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";
import { MockUsers } from "./01-users.seed";

type MealHistorySeedType = Omit<MealHistoryEntity, 'updatedAt' | 'user'>

export class MockMealHistory {
    static readonly MEAL_HISTORY_001: MealHistorySeedType = {
        id: 1,
        lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        imageUrl: "https://www.lemon8-app.com/seo/image?item_id=7288567503658238466&index=0&sign=28bed1477283131a0521d9af5cc0ba70",
        foodTitle: 'หมูผัดพริกแกงไข่ดาว',
        calories: 550,
        carbohydrate: 45,
        protein: 30,
        fat: 25,
        createdAt: new Date(),
        ingredients: [
            { name: "หมู", quantity: 150, quantityUnit: "กรัม" },
            { name: "พริกแกงแดง", quantity: 2, quantityUnit: "ช้อนโต๊ะ" },
            { name: "กะทิ", quantity: 100, quantityUnit: "มิลลิลิตร" },
            { name: "ใบโหระพา", quantity: 1, quantityUnit: "กำมือ" },
            { name: "ไข่ไก่", quantity: 1, quantityUnit: "ฟอง" },
        ],
        confirmAt: null,
    };

    static readonly MEAL_HISTORY_002: MealHistorySeedType = {
        id: 2,
        lineUserId: MockUsers.TRAINEE_USER_003.lineUserId,
        imageUrl: "https://fit-d.com/uploads/food/afb2ccb7050c6a64d52b7e3736d3a6f8.jpg",
        foodTitle: 'กระเพราไก่ไข่ดาว',
        calories: 650,
        carbohydrate: 37,
        protein: 30,
        fat: 15,
        createdAt: new Date(),
        ingredients: [
            { name: "ไก่", quantity: 150, quantityUnit: "กรัม" },
            { name: "ไข่", quantity: 1, quantityUnit: "ฟอง" },
            { name: "ข้าว", quantity: 250, quantityUnit: "กรัม" },
        ],
        confirmAt: null,
    };

    static readonly MealHistories = [
        this.MEAL_HISTORY_001,
        this.MEAL_HISTORY_002,
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