import { messagingApi } from "@line/bot-sdk";

export interface NutritionPlanInput {
    totalCalories: number;
    carbohydrateGrams: number;
    carbohydrateCalories: number;
    carbohydratePercent: number;
    proteinGrams: number;
    proteinCalories: number;
    proteinPercent: number;
    fatGrams: number;
    fatCalories: number;
    fatPercent: number;
}

interface MacroCardConfig {
    label: string;
    grams: number;
    calories: number;
    percent: number;
    color: string;
    progressBar: string;
}

const clampPercent = (value: number): number => {
    if (Number.isNaN(value)) return 0;
    if (value < 0) return 0;
    if (value > 100) return 100;
    return Math.round(value);
};

const buildMacroBubble = (card: MacroCardConfig): messagingApi.FlexBubble => {
    const safePercent = clampPercent(card.percent);

    return {
        type: "bubble",
        size: "deca",
        styles: {
            body: { backgroundColor: card.color },
        },
        body: {
            type: "box",
            layout: "vertical",
            paddingAll: "16px",
            contents: [
                {
                    type: "text",
                    text: card.label,
                    size: "lg",
                    weight: "bold",
                    color: "#FFFFFF",
                    wrap: true,
                },
                {
                    type: "text",
                    text: `${card.grams} กรัม - ${card.calories} แคลอรี่`,
                    margin: "xs",
                    size: "md",
                    color: "#FFFFFF",
                    wrap: true,
                },
                {
                    type: "text",
                    text: `${safePercent}%`,
                    margin: "md",
                    size: "lg",
                    weight: "bold",
                    color: "#FFFFFF",
                    wrap: true,
                },
                {
                    type: "box",
                    layout: "vertical",
                    margin: "sm",
                    backgroundColor: "#FFFFFF99",
                    cornerRadius: "md",
                    height: "8px",
                    contents: [
                        {
                            type: "box",
                            layout: "vertical",
                            width: `${safePercent}%`,
                            height: "8px",
                            backgroundColor: card.progressBar,
                            cornerRadius: "md",
                            contents: [
                                {
                                    type: "filler",
                                },
                            ],
                        },
                    ],
                },
            ],
        },
    };
};

const buildTotalEnergyBubble = (
    totalCalories: number,
    navigateUrl: string,
): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "deca",
    styles: {
        body: { backgroundColor: "#F3F3F3" },
    },
    body: {
        type: "box",
        layout: "vertical",
        paddingAll: "16px",
        contents: [
            {
                type: "text",
                text: "พลังงานรวม",
                size: "lg",
                weight: "bold",
                color: "#4270ED",
                wrap: true,
            },
            {
                type: "text",
                text: `${totalCalories} แคลอรี่`,
                margin: "xs",
                size: "lg",
                weight: "bold",
                color: "#000000",
                wrap: true,
            },
            {
                type: "box",
                layout: "vertical",
                margin: "xl",
                borderColor: "#4270ED",
                borderWidth: "normal",
                cornerRadius: "md",
                contents: [
                    {
                        type: "button",
                        style: "link",
                        color: "#4270ED",
                        height: "sm",
                        action: {
                            type: "uri",
                            label: "รายละเอียด",
                            uri: navigateUrl,
                        },
                    },
                ],
            },
        ],
    },
});

export const NutritionPlanMessage = (
    navigateUrl: string,
    input: NutritionPlanInput,
): messagingApi.Message[] => {
    const cards: MacroCardConfig[] = [
        {
            label: "คาร์โบไฮเดรต",
            grams: input.carbohydrateGrams,
            calories: input.carbohydrateCalories,
            percent: input.carbohydratePercent,
            color: "#34D399",
            progressBar: "#00794D",
        },
        {
            label: "โปรตีน",
            grams: input.proteinGrams,
            calories: input.proteinCalories,
            percent: input.proteinPercent,
            color: "#818CF8",
            progressBar: "#2e39a1",
        },
        {
            label: "ไขมัน",
            grams: input.fatGrams,
            calories: input.fatCalories,
            percent: input.fatPercent,
            color: "#FB923C",
            progressBar: "#a85009",
        },
    ];

    const bubbles: messagingApi.FlexBubble[] = [
        buildTotalEnergyBubble(input.totalCalories, navigateUrl),
        ...cards.map(buildMacroBubble),
    ];

    return [
        {
            type: "flex",
            altText: "เป้าหมายโภชนาการ",
            contents: {
                type: "carousel",
                contents: bubbles,
            },
        },
    ];
};
