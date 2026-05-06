import { messagingApi } from "@line/bot-sdk";

export const PostbackEventAuthenTrainerTrueMessages: messagingApi.Message[] = [
    {   type: 'text', 
        text: 'ยืนยันตัวตนสำเร็จ! คุณคือเทรนเนอร์ที่ได้ลงทะเบียนกับระบบของเราครับ 🎉\nตอนนี้คุณสามารถเชิญลูกเทรนที่อยู่ภายใต้การดูแลของคุณเข้ากลุ่มได้แล้วครับ' 
    }
]