import { messagingApi } from "@line/bot-sdk";

export const JoinEventFailToInsertMessages: messagingApi.Message[] = [
    {
        type: 'text',
        text: 'ขออภัยครับ เกิดข้อผิดพลาดในการบันทึกข้อมูลกลุ่ม กรุณาลบบอทออกจากกลุ่มแล้วเพิ่มเข้ากลุ่มใหม่อีกครั้งครับ',
    }
]