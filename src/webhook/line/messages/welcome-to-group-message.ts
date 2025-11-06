import { messagingApi } from "@line/bot-sdk";

export const welcomeToGroupMessage: messagingApi.Message[] = [
    {
        type: 'text',
        text: 'สวัสดีครับ! ขอบคุณที่เพิ่มบอทของเราเข้ากลุ่มนี้ครับ 😊',
    }
]