import { messagingApi } from "@line/bot-sdk";

export const JoinEventInvalidMemberCountMessages: messagingApi.Message[] = [
    {
        type: 'text',
        text: 'ขอโทษครับ กลุ่มนี้ไม่สามารถใช้งานบอทได้ เนื่องจากมีสมาชิกเกินจำนวนที่กำหนดไว้',
    },
    {
        type: 'text',
        text: 'เงื่อนไขการใช้งานบอท: กลุ่มนี้ต้องสร้างขึ้นมาใหม่โดยมีเทรนเนอร์เพียงคนเดียว และเพิ่มลูกเทรนเข้ามาหลังจากเพิ่มบอทแล้วเท่านั้นครับ',
    }
]