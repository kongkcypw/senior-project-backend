import { messagingApi } from "@line/bot-sdk";

export const ManageProgramMessages = (
    navigateUrl: string
): messagingApi.Message[] => {
    return [
        {
            type: "text",
            text: navigateUrl
        },
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
                            text: "จัดการโปรแกรม",
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
                            text: "คลิกปุ่มด้านล่างเพื่อเปิดแอปพลิเคชัน LIFF สำหรับจัดการโปรแกรม",
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
                                label: "เปิด",
                                uri: navigateUrl
                            },
                            color: "#1DB446"
                        }
                    ]
                }
            }
        }
    ]
}