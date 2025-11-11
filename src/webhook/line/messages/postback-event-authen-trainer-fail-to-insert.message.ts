import { messagingApi } from "@line/bot-sdk";

export const PostbackEventAuthenTrainerFailToInsertMessages: messagingApi.Message[] = [
    {   type: 'text', 
        text: 'ขออภัยครับ เกิดข้อผิดพลาดในการประมวลผลคำขอยืนยันตัวตนของคุณ กรุณากดปุ่มยืนยันตัวตนอีกครั้งในภายหลังครับ' 
    }
]