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
                        label: "✅ ซ้อมวันนี้ไหม",
                        text: "วันนี้ออกกำลังกายแล้วไหม",
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
        text: "สวัสดีครับ! 😊 มีอะไรให้ช่วยไหมครับ?\nพิมพ์ @ขุนพันธ์ ช่วยเหลือ เพื่อดูรายการคำสั่งทั้งหมดได้เลยครับ",
    } as messagingApi.TextMessage,
];
