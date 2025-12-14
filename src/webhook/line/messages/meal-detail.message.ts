import { messagingApi } from "@line/bot-sdk";
import { GeminiAnalyzeFoodImageResponse } from "src/external/gemini/types/gemini-analyze-food-image-response.type";

export const MealDetailMessage = (
    detail: GeminiAnalyzeFoodImageResponse,
    date: string,
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
                            text: "คำนวณแคลอรี่",
                            weight: "bold",
                            size: "xl",
                            color: "#000000"
                        },
                        {
                            type: "text",
                            text: `${detail.foodTitle}`,
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
                                    text: "แคลอรี่ในมื้อนี้",
                                    size: "md",
                                    color: "#000000",
                                    weight: "bold",
                                    flex: 1
                                },
                                {
                                    type: "text",
                                    text: `${detail.nutritionFacts.calories} แคลอรี่`,
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