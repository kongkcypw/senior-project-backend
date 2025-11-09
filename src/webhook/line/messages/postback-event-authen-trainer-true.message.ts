import { messagingApi } from "@line/bot-sdk";

export const PostbackEventAuthenTrainerTrueMessages: messagingApi.Message[] = [
    {   type: 'text', 
        text: 'ยืนยันตัวตนสำเร็จ! คุณคือเทรนเนอร์ที่ได้รับอนุญาตให้ใช้บอทนี้ครับ' 
    }
]