export type GeminiAnalyzeFoodImageResponse = {
    is_food: boolean; 
    foodTitle: string;
    ingredients: { name: string; quantity: number; quantityUnit: string }[];
    nutritionFacts: {
        calories: number;
        carbohydrates: number;
        protein: number;
        fat: number;
    };
};

export type AnalyzeFoodImageResponse = {
    message: string;
    data: GeminiAnalyzeFoodImageResponse;
};