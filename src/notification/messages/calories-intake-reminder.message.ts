import { messagingApi } from "@line/bot-sdk";

export const CaloriesIntakeReminderMessages = (
    totalCaloriesTarget: number,
): messagingApi.Message[] => {
    return [
        {
            type: 'text',
            text: `อย่าลืมบันทึกปริมาณแคลอรี่ที่รับประทานในวันนี้นะครับ เป้าหมายแคลอรี่ของคุณวันนี้คือ ${totalCaloriesTarget} แคลอรี่`,
        }
    ]
}