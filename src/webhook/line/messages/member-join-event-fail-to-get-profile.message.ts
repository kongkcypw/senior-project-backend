import { messagingApi } from "@line/bot-sdk";

export const MemberJoinEventFailToGetProfileMessages: messagingApi.Message[] = [
    {
        type: 'text',
        text: 'ขออภัยครับ ผมไม่สามารถดึงข้อมูลโปรไฟล์ของสมาชิกใหม่ได้ กรุณาลบลูกเทรนออกจากกลุ่มแล้วลองเชิญเข้ากลุ่มอีกครั้งครับ',
    }
]