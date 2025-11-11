import { messagingApi } from "@line/bot-sdk";

export const MemberJoinEventFailToInsertMessages: messagingApi.Message[] = [
    {   type: 'text', 
        text: 'ขออภัยครับ เกิดข้อผิดพลาดในการบันทึกข้อมูลสมาชิกกลุ่ม กรุณาลบสมาชิกออกจากกลุ่มแล้วเพิ่มเข้ากลุ่มใหม่อีกครั้งครับ' 
    }
]