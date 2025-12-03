import { messagingApi } from "@line/bot-sdk";

export const TraineeInfoMessage = (displayName: string | null, age: number, weight: number, height: number, fat: number | null): messagingApi.Message[] => {
    return [
        {
            type: "flex",
            altText: "Flex Message",
            contents: {
                type: "bubble",
                header: {
                    type: "box",
                    layout: "vertical",
                    contents: []
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "ข้อมูลเทรนนี",
                            weight: "bold",
                            size: "xl"
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            margin: "lg",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: `@${displayName ?? 'ไม่ระบุ'}`,
                                    weight: "bold"
                                },
                                {
                                    type: "box",
                                    layout: "baseline",
                                    spacing: "none",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "อายุ:",
                                            color: "#000000",
                                            size: "sm",
                                            flex: 0,
                                            weight: "bold"
                                        },
                                        {
                                            type: "text",
                                            text: `${age}`,
                                            wrap: true,
                                            color: "#666666",
                                            size: "sm",
                                            margin: "xs",
                                            flex: 0
                                        }
                                    ]
                                },
                                {
                                    type: "box",
                                    layout: "baseline",
                                    spacing: "none",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "น้ำหนัก:",
                                            color: "#000000",
                                            size: "sm",
                                            flex: 0,
                                            weight: "bold"
                                        },
                                        {
                                            type: "text",
                                            text: `${weight}`,
                                            wrap: true,
                                            color: "#666666",
                                            size: "sm",
                                            margin: "xs",
                                            flex: 0
                                        }
                                    ]
                                },
                                {
                                    type: "box",
                                    layout: "baseline",
                                    spacing: "none",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "ส่วนสูง:",
                                            color: "#000000",
                                            size: "sm",
                                            flex: 0,
                                            weight: "bold"
                                        },
                                        {
                                            type: "text",
                                            text: `${height}`,
                                            wrap: true,
                                            color: "#666666",
                                            size: "sm",
                                            margin: "xs",
                                            flex: 0
                                        }
                                    ]
                                },
                                {
                                    type: "box",
                                    layout: "baseline",
                                    spacing: "none",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "เปอร์เซ็นไขมัน:",
                                            color: "#000000",
                                            size: "sm",
                                            flex: 0,
                                            weight: "bold"
                                        },
                                        {
                                            type: "text",
                                            text: `${fat || "ยังไม่ระบุ"}`,
                                            wrap: true,
                                            color: "#666666",
                                            size: "sm",
                                            margin: "xs",
                                            flex: 0
                                        }
                                    ]
                                }
                            ]
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
                            action: {
                                type: "uri",
                                label: "รายละเอียด",
                                uri: "https://line.me/"
                            }
                        }
                    ],
                    flex: 0
                },
                styles: {
                    header: {
                        backgroundColor: "#4270ED"
                    }
                }
            }
        }
    ]
}