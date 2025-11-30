import { messagingApi } from "@line/bot-sdk";

export const TestProfileMessages = (profileUrl: string): messagingApi.Message[] => {
    return [
        {
            type: "flex",
            altText: "โปรไฟล์ของคุณ",
            contents: {
                type: "bubble",
                header: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "ข้อมูลโปรไฟล์",
                            weight: "bold",
                            size: "xl",
                            color: "#1DB446"
                        }
                    ],
                    paddingAll: "20px",
                    backgroundColor: "#ECFEE5"
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "คลิกปุ่มด้านล่างเพื่อเปิดแอปพลิเคชัน LIFF และดู/แก้ไขข้อมูลส่วนตัวของคุณ",
                            wrap: true,
                            color: "#666666",
                            size: "sm"
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
                            style: "primary",
                            height: "sm",
                            action: {
                                type: "uri",
                                label: "เปิดหน้าโปรไฟล์",
                                uri: profileUrl
                            },
                            color: "#1DB446"
                        }
                    ]
                }
            }
        }
    ]
}