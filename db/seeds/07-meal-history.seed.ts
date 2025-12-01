import { MealHistoryEntity } from "src/nutrition/entities/meal-history.entity";
import { DataSource } from "typeorm";
import { Seeder } from "typeorm-extension";

type MealHistorySeedType = Omit<MealHistoryEntity, 'updatedAt' | 'user'>

export class MockMealHistory {
    static readonly MEAL_HISTORY_001: MealHistorySeedType = {
        id: 1,
        lineUserId: 'U2201192bbe85b768b35cf892b8325443',
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

    static readonly MealHistories = [
        this.MEAL_HISTORY_001,
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