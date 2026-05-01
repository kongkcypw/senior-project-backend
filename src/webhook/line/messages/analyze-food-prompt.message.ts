import { messagingApi } from "@line/bot-sdk";

export const AnalyzeFoodPromptMessage = (): messagingApi.Message[] => {
    return [
        {
            type: "flex",
            altText: "วิเคราะห์รูปอาหาร — กดถ่ายรูปเพื่อเริ่มต้น",
            contents: {
                type: "bubble",
                size: "mega",
                body: {
                    type: "box",
                    layout: "vertical",
                    paddingAll: "20px",
                    contents: [
                        {
                            type: "text",
                            text: "วิเคราะห์รูปอาหาร",
                            weight: "bold",
                            size: "xl",
                            color: "#000000",
                        },
                        {
                            type: "text",
                            text: "ถ่ายรูปหรือเลือกรูปอาหารจากคลัง เพื่อให้ระบบคำนวณแคลอรี่และสารอาหารอัตโนมัติ",
                            size: "sm",
                            color: "#555555",
                            wrap: true,
                            margin: "md",
                        },
                    ],
                },
                styles: {
                    body: { backgroundColor: "#F9F9F9" },
                },
            },
            // camera/cameraRoll actions are only supported in quickReply, not in flex buttons
            quickReply: {
                items: [
                    {
                        type: "action",
                        action: {
                            type: "camera",
                            label: "ถ่ายรูปอาหาร",
                        },
                    },
                    {
                        type: "action",
                        action: {
                            type: "cameraRoll",
                            label: "เลือกรูปจากคลัง",
                        },
                    },
                ],
            },
        },
    ];
};
