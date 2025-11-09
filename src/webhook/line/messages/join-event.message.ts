import { messagingApi } from "@line/bot-sdk";
import { PostbackData } from "../enums/postback-data.enum";

export const JoinEventMessages: messagingApi.Message[] = [
    {
        type: 'text',
        text: 'สวัสดีครับ! ขอบคุณที่เพิ่มบอทของเราเข้ากลุ่มนี้ครับ 😊',
    },
    {
        type: "flex",
        altText: "Flex Message",
        contents: {
            type: "bubble",
            header: {
                type: "box",
                layout: "baseline",
                contents: [
                    {
                        type: "text",
                        text: "ก่อนเริ่มใช้งานขุนพันธ์ \nเราต้องยืนยันตัวคุณ(ผู้สร้างกลุ่ม)\nเพื่อให้แน่ใจว่าคุณเป็นเทรนเนอร์\nที่ลงทะเบียนกับระบบของเราแล้ว",
                        wrap: true
                    }
                ]
            },
            footer: {
                type: "box",
                layout: "vertical",
                spacing: "sm",
                contents: [
                    {
                        type: "button",
                        style: "link",
                        height: "sm",
                        action: {
                            type: "postback",
                            label: "ยืนยันตัวตน",
                            data: PostbackData.AUTHENTICATE_TRAINER,
                        }
                    },
                    {
                        type: "box",
                        layout: "vertical",
                        contents: [],
                        margin: "sm"
                    }
                ],
                flex: 0
            }
        }
    }
]