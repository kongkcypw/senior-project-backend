import { messagingApi } from "@line/bot-sdk";

export const GreetingMessagePersonalChat = (): messagingApi.Message[] => [
    {
        type: "text",
        text: "สวัสดีครับ! 😊\n\nวันนี้จะเริ่มต้นจากตรงไหนดีครับ?\nแตะปุ่มด้านล่าง หรือพิมพ์ถามผมได้เลยครับ 👇",
        quickReply: {
            items: [
                {
                    type: "action",
                    action: {
                        type: "message",
                        label: "📊 แคลอรี่วันนี้",
                        text: "แคลอรี่วันนี้กินไปเท่าไหร่",
                    },
                },
                {
                    type: "action",
                    action: {
                        type: "message",
                        label: "🍽️ สรุปอาหารวันนี้",
                        text: "สรุปการกินอาหารวันนี้",
                    },
                },
                {
                    type: "action",
                    action: {
                        type: "message",
                        label: "🏋️ โปรแกรมฉัน",
                        text: "โปรแกรมออกกำลังกายของฉัน",
                    },
                },
                {
                    type: "action",
                    action: {
                        type: "message",
                        label: "⭐ คะแนนสัปดาห์นี้",
                        text: "คะแนนของฉันสัปดาห์นี้",
                    },
                },
                {
                    type: "action",
                    action: {
                        type: "message",
                        label: "🆘 ดูคำสั่งทั้งหมด",
                        text: "ช่วยเหลือ",
                    },
                },
            ],
        },
    } as messagingApi.TextMessage,
];

export const GreetingMessageGroupChat = (): messagingApi.Message[] => [
    {
        type: "text",
        text: "สวัสดีครับ! 👋 นี่คือคำสั่งที่ใช้ได้ในกลุ่ม\n\nทุกคำสั่งจะเป็นการดึงข้อมูลของลูกเทรนหรือผู้ฝึกเท่านั้น ข้อมูลของเทรนเนอร์จะไม่ถูกแสดงในแชทกลุ่ม\n\nพิมพ์ @ขุนพันธ์ (แท็กบอทขุนพันธ์) ตามด้วยคำสั่งด้านล่างครับ\n\n🍽️ โภชนาการ\n「แผนโภชนาการ」\n「สรุปการกินอาหารวันนี้」\n\n🏋️ การออกกำลังกาย\n「โปรแกรมออกกำลังกายของฉัน」\n「ประวัติออกกำลังกายล่าสุด」\n\n📊 สถิติ\n「คะแนนของฉันสัปดาห์นี้」\n「ข้อมูลร่างกายของฉัน」\n\n🤖 ถามอะไรก็ได้เกี่ยวกับ Fitness\nพิมพ์คำถามได้เลย เช่น\n「@ขุนพันธ์ ฉันควรกินอะไรก่อนออกกำลังกาย」\n「@ขุนพันธ์ วิธีเพิ่มกล้ามเนื้อสำหรับมือใหม่」\n\n💡 ส่งรูปอาหารในกลุ่มได้เลย ไม่ต้อง @ขุนพันธ์ ครับ",
    } as messagingApi.TextMessage,
];
