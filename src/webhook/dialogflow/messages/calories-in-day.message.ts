import { messagingApi } from "@line/bot-sdk";

export const CaloriesInDayMessages = (
    navigateUrl: string,
    targetCalories: number,
    remainingCalories: number,
    date: string,
    displayName: string | null,
): messagingApi.Message[] => {
    return [
        {
            type: "flex",
            altText: "Flex Message",
            contents: {
                type: "bubble",
                size: "mega",
                header: {
                    type: "box",
                    layout: "vertical",
                    contents: [],
                    paddingBottom: "none"
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "แคลอรี่ในวันนี้",
                            weight: "bold",
                            size: "xl",
                            color: "#000000"
                        },
                        {
                            type: "text",
                            text: `@${displayName ?? 'ไม่ระบุ'}`,
                            size: "md",
                            color: "#555555",
                            margin: "md",
                            weight: "bold"
                        },
                        {
                            type: "text",
                            text: date,
                            size: "md",
                            color: "#555555",
                            margin: "md"
                        },
                        {
                            type: "separator",
                            margin: "lg",
                            color: "#FFFFFF00"
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "text",
                                    text: "เป้าหมาย",
                                    size: "md",
                                    color: "#000000",
                                    weight: "bold",
                                    flex: 1
                                },
                                {
                                    type: "text",
                                    text: `${targetCalories} แคลอรี่`,
                                    size: "lg",
                                    color: "#000000",
                                    weight: "bold",
                                    align: "end",
                                    flex: 1
                                }
                            ],
                            margin: "md"
                        },
                        {
                            type: "box",
                            layout: "horizontal",
                            contents: [
                                {
                                    type: "text",
                                    text: "ยังขาดอีก",
                                    size: "md",
                                    color: "#000000",
                                    weight: "bold",
                                    flex: 1
                                },
                                {
                                    type: "text",
                                    text: `${remainingCalories} แคลอรี่`,
                                    size: "lg",
                                    color: "#000000",
                                    weight: "bold",
                                    align: "end",
                                    flex: 1
                                }
                            ],
                            margin: "md"
                        }
                    ]
                },
                footer: {
                    type: "box",
                    layout: "horizontal",
                    contents: [
                        {
                            type: "button",
                            action: {
                                type: "uri",
                                label: "รายละเอียด",
                                uri: navigateUrl
                            },
                            color: "#8C9BAB",
                            style: "link",
                            height: "sm"
                        },
                    ],
                    spacing: "sm"
                },
                styles: {
                    header: {
                        backgroundColor: "#4270ED"
                    },
                    body: {
                        backgroundColor: "#F9F9F9"
                    }
                }
            }
        }
    ]
}