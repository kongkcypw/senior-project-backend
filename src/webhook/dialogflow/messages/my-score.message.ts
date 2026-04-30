import { messagingApi } from "@line/bot-sdk";

export interface MyScoreMessageData {
    totalScore: number;
    workoutScore: number;
    nutritionScore: number;
    periodPrefix: string;
    periodLabel: string;
    detailUrl: string;
}

const buildMyScoreBubble = (data: MyScoreMessageData): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "mega",
    body: {
        type: "box",
        layout: "vertical",
        paddingAll: "18px",
        backgroundColor: "#4E7FFF",
        contents: [
            {
                type: "text",
                text: "คะแนนรวมของคุณ",
                size: "xl",
                weight: "bold",
                color: "#FFFFFF",
                wrap: true,
            },
            {
                type: "box",
                layout: "horizontal",
                margin: "md",
                contents: [
                    {
                        type: "text",
                        text: "★",
                        size: "4xl",
                        color: "#FFFFFF",
                        flex: 0,
                    },
                    {
                        type: "text",
                        text: `${Math.round(data.totalScore)}`,
                        size: "4xl",
                        weight: "bold",
                        color: "#FFFFFF",
                        margin: "xs",
                        flex: 0,
                    },
                ],
            },
            {
                type: "box",
                layout: "horizontal",
                margin: "md",
                contents: [
                    {
                        type: "text",
                        text: "คะแนนโภชนาการ",
                        size: "md",
                        color: "#FFFFFF",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${Math.round(data.nutritionScore)}`,
                        size: "md",
                        weight: "bold",
                        color: "#FFFFFF",
                        align: "end",
                        flex: 0,
                    },
                ],
            },
            {
                type: "box",
                layout: "horizontal",
                margin: "xs",
                contents: [
                    {
                        type: "text",
                        text: "คะแนนออกกำลังกาย",
                        size: "md",
                        color: "#FFFFFF",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${Math.round(data.workoutScore)}`,
                        size: "md",
                        weight: "bold",
                        color: "#FFFFFF",
                        align: "end",
                        flex: 0,
                    },
                ],
            },
        ],
    },
    footer: {
        type: "box",
        layout: "horizontal",
        backgroundColor: "#A9BEFF",
        paddingAll: "12px",
        contents: [
            {
                type: "text",
                text: `${data.periodPrefix} ${data.periodLabel}`,
                size: "md",
                color: "#FFFFFF",
                align: "center",
                flex: 1,
                wrap: true,
            },
            {
                type: "box",
                layout: "vertical",
                width: "1px",
                height: "24px",
                backgroundColor: "#FFFFFF",
                margin: "sm",
                flex: 0,
                contents: [],
            },
            {
                type: "box",
                layout: "vertical",
                flex: 1,
                contents: [
                    {
                        type: "text",
                        text: "รายละเอียด",
                        size: "md",
                        color: "#FFFFFF",
                        align: "center",
                        wrap: true,
                    },
                ],
                action: {
                    type: "uri",
                    label: "รายละเอียด",
                    uri: data.detailUrl,
                },
            },
        ],
    },
});

export const MyScoreMessage = (data: MyScoreMessageData): messagingApi.Message[] => [
    {
        type: "flex",
        altText: "คะแนนรวมของคุณ",
        contents: buildMyScoreBubble(data),
    },
];
