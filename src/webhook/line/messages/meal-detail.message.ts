import { messagingApi } from "@line/bot-sdk";
import { GeminiAnalyzeFoodImageResponse } from "src/external/gemini/types/gemini-analyze-food-image-response.type";

export const MealDetailMessage = (detail: GeminiAnalyzeFoodImageResponse): messagingApi.Message[] => {
    
    return [
        {
            type: 'text',
            text: `เมนู: ${detail.foodTitle}
                   \n
                   \nสารอาหารและพลังงาน:
                   \n- คาร์โบไฮเดรต: ${detail.nutritionFacts.carbohydrates} กรัม
                   \n- โปรตีน: ${detail.nutritionFacts.protein} กรัม
                   \n- ไขมัน: ${detail.nutritionFacts.fat} กรัม
                   \n- พลังงาน: ${detail.nutritionFacts.calories} แคลอรี่
                   \n
                   \nวัตถุดิบ:
                   \n${detail.ingredients.map(ingredient => `- ${ingredient.name}: ${ingredient.quantity} ${ingredient.quantityUnit}`).join('\n')}`,
        }
    ];
}