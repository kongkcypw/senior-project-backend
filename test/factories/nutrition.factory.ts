export const MealHistoryFactory = {
    create(override: Record<string, any> = {}) {
        return {
            id: 1,
            lineUserId: 'U_TRAINEE_001',
            foodTitle: 'Test Food',
            imageUrl: '',
            calories: 500,
            protein: 30,
            carbohydrate: 50,
            fat: 15,
            ingredients: [{ name: 'rice', quantity: 100, quantityUnit: 'g' }],
            confirmAt: null,
            createdAt: new Date('2024-01-01T08:00:00.000Z'),
            ...override,
        };
    },
};

export const NutritionPlanFactory = {
    create(override: Record<string, any> = {}) {
        return {
            id: 1,
            lineUserId: 'U_TRAINEE_001',
            totalCalories: 2000,
            protein: 150,
            carbohydrate: 200,
            fat: 70,
            needNotification: false,
            notificationTimes: [],
            meals: [],
            ...override,
        };
    },
};
