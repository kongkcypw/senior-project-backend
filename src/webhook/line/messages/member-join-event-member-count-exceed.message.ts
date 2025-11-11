import { messagingApi } from "@line/bot-sdk";
import { ALLOW_TRAINEE_PER_GROUP, ALLOW_TRAINER_PER_GROUP } from "../constants/allow-trainer-and-trainee-per-group.constant";

export const MemberJoinEventMemberCountExceedMessages: messagingApi.Message[] = [
    {
        type: 'text',
        text: 'ขออภัยครับ ระบบไม่สามารถเพิ่มสมาชิกใหม่ได้เนื่องจากจำนวนสมาชิกในกลุ่มเกินขีดจำกัดที่กำหนดไว้ กรุณาลบสมาชิกออกก่อนแล้วเพิ่มสมาชิกใหม่อีกครั้งครับ',
    },
    {
        type: 'text',
        text: `เงื่อนไขในการใช้งาน: ในกลุ่มสามารถมีสมาชิกที่เป็นเทรนเนอร์ ${ALLOW_TRAINER_PER_GROUP} คน และสมาชิกที่เป็นลูกเทรน ${ALLOW_TRAINEE_PER_GROUP} คนเท่านั้นครับ`,
    }
]