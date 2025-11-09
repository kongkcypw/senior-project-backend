import { messagingApi } from "@line/bot-sdk";

export const PostbackEventAuthenTrainerFalseMessages: messagingApi.Message[] = [
    {   type: 'text', 
        text: 'ขออภัยครับ การยืนยันตัวตนล้มเหลว คุณไม่ได้เป็นเทรนเนอร์ที่ได้รับอนุญาตให้ใช้บอทนี้ครับ' 
    }
]