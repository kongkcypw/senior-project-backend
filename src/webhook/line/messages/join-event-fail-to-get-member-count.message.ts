import { messagingApi } from "@line/bot-sdk";

export const JoinEventFailToGetMemberCount: messagingApi.Message[] = [
    {
        type: 'text',
        text: 'ขอโทษครับ เกิดข้อผิดพลาดในการตรวจสอบจำนวนสมาชิกในกลุ่ม กรุณาลองใหม่อีกครั้ง',
    }
]