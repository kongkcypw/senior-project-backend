import { messagingApi } from "@line/bot-sdk";

export const CaloriesIntakeReminderMessages = (
    totalCaloriesTarget: number,
    consumedCalories: number,
    remainingCalories: number,
    navigateUrl: string,
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
                            text: "อย่าลืมทานอาหาร",
                            weight: "bold",
                            size: "xl",
                            color: "#000000"
                        },
                        {
                            type: "text",
                            text: `เป้าหมายวันนี้ ${totalCaloriesTarget} แคลอรี่`,
                            size: "md",
                            color: "#555555",
                            margin: "md",
                            weight: "bold"
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
                                    text: "แคลอรี่ที่ได้รับแล้ว",
                                    size: "md",
                                    color: "#000000",
                                    weight: "bold",
                                    flex: 1
                                },
                                {
                                    type: "text",
                                    text: `${consumedCalories} แคลอรี่`,
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
                        backgroundColor: "#FA9E1E"
                    },
                    body: {
                        backgroundColor: "#F9F9F9"
                    }
                }
            }
        }
    ]
}