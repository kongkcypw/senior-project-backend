import { messagingApi } from "@line/bot-sdk";

export const welcomeMemberJoinGroupMessage: messagingApi.Message[] = [
    {
        type: 'text',
        text: 'ยินดีต้อนรับไอ้กล้ามเล็กเข้ากลุ่มครับ! 🎉',
    }
]