import { messagingApi } from "@line/bot-sdk";

export interface TodayNutritionSummaryInput {
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
}

export interface TodayNutritionPlanInput {
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
}

export interface TodayNutritionMealItem {
    mealName: string;
    imageUrl: string;
    detailUrl: string;
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
}

const buildPlanRow = (
    label: string,
    valueText: string,
): messagingApi.FlexBox => ({
    type: "box",
    layout: "horizontal",
    margin: "xs",
    contents: [
        {
            type: "text",
            text: label,
            size: "sm",
            color: "#1F1F1F",
            wrap: true,
            flex: 1,
        },
        {
            type: "text",
            text: valueText,
            size: "sm",
            color: "#1F1F1F",
            align: "end",
            wrap: true,
            flex: 0,
        },
    ],
});

const buildSummaryBubble = (
    planNavigateUrl: string,
    intake: TodayNutritionSummaryInput,
    plan: TodayNutritionPlanInput,
    nutritionScore: number,
): messagingApi.FlexBubble => {
    const scoreText = `${Math.round(nutritionScore)}/50`;

    return {
        type: "bubble",
        size: "kilo",
        body: {
            type: "box",
            layout: "vertical",
            paddingAll: "16px",
            backgroundColor: "#F3F3F3",
            cornerRadius: "xxl",
            contents: [
                {
                    type: "text",
                    text: "ภาพรวมวันนี้",
                    size: "lg",
                    weight: "bold",
                    color: "#4270ED",
                    wrap: true,
                },
                {
                    type: "text",
                    text: "พลังงานที่ได้รับ",
                    margin: "sm",
                    size: "xxl",
                    weight: "bold",
                    color: "#111111",
                    wrap: true,
                },
                {
                    type: "box",
                    layout: "horizontal",
                    margin: "sm",
                    contents: [
                        {
                            type: "text",
                            text: "แคลอรี่",
                            size: "md",
                            color: "#1F1F1F",
                            wrap: true,
                            flex: 1,
                        },
                        {
                            type: "text",
                            text: `${intake.calories} แคลอรี่`,
                            size: "md",
                            color: "#1F1F1F",
                            align: "end",
                            wrap: true,
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
                            text: "คาร์โบไฮเดรต",
                            size: "md",
                            color: "#1F1F1F",
                            wrap: true,
                            flex: 1,
                        },
                        {
                            type: "text",
                            text: `${intake.carbohydrate} กรัม`,
                            size: "md",
                            color: "#1F1F1F",
                            align: "end",
                            wrap: true,
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
                            text: "โปรตีน",
                            size: "md",
                            color: "#1F1F1F",
                            wrap: true,
                            flex: 1,
                        },
                        {
                            type: "text",
                            text: `${intake.protein} กรัม`,
                            size: "md",
                            color: "#1F1F1F",
                            align: "end",
                            wrap: true,
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
                            text: "ไขมัน",
                            size: "md",
                            color: "#1F1F1F",
                            wrap: true,
                            flex: 1,
                        },
                        {
                            type: "text",
                            text: `${intake.fat} กรัม`,
                            size: "md",
                            color: "#1F1F1F",
                            align: "end",
                            wrap: true,
                            flex: 0,
                        },
                    ],
                },
                {
                    type: "separator",
                    margin: "md",
                    color: "#D0D0D0",
                },
                {
                    type: "text",
                    text: "แผนโภชนาการ",
                    margin: "md",
                    size: "xxl",
                    weight: "bold",
                    color: "#111111",
                    wrap: true,
                },
                {
                    type: "box",
                    layout: "horizontal",
                    margin: "xs",
                    contents: [
                        {
                            type: "text",
                            text: "รายละเอียด",
                            size: "xs",
                            color: "#888888",
                            wrap: true,
                            flex: 1,
                        },
                        {
                            type: "text",
                            text: "ได้รับ/แผน",
                            size: "xs",
                            color: "#888888",
                            align: "end",
                            wrap: true,
                            flex: 0,
                        },
                    ],
                },
                buildPlanRow(
                    "แคลอรี่",
                    `${intake.calories}/${plan.calories} แคลอรี่`,
                ),
                buildPlanRow(
                    "คาร์โบไฮเดรต",
                    `${intake.carbohydrate}/${plan.carbohydrate} กรัม`,
                ),
                buildPlanRow(
                    "โปรตีน",
                    `${intake.protein}/${plan.protein} กรัม`,
                ),
                buildPlanRow(
                    "ไขมัน",
                    `${intake.fat}/${plan.fat} กรัม`,
                ),
                {
                    type: "box",
                    layout: "horizontal",
                    margin: "md",
                    contents: [
                        {
                            type: "text",
                            text: "คะแนนโภชนาการ:",
                            size: "sm",
                            weight: "bold",
                            color: "#111111",
                            wrap: true,
                            flex: 1,
                        },
                        {
                            type: "text",
                            text: scoreText,
                            size: "sm",
                            weight: "bold",
                            color: "#111111",
                            align: "end",
                            wrap: true,
                            flex: 0,
                        },
                    ],
                },
            ],
        },
        footer: {
            type: "box",
            layout: "vertical",
            paddingAll: "12px",
            backgroundColor: "#F3F3F3",
            contents: [
                {
                    type: "button",
                    style: "primary",
                    color: "#4270ED",
                    height: "sm",
                    action: {
                        type: "uri",
                        label: "แผนโภชนาการ",
                        uri: planNavigateUrl,
                    },
                },
            ],
        },
    };
};

const DEFAULT_MEAL_IMAGE_URL = "https://khunphan.dpdns.org/flex-message/meal_placeholder.png";

const buildMealBubble = (meal: TodayNutritionMealItem): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "kilo",
    hero: {
        type: "image",
        url: meal.imageUrl?.trim() ? meal.imageUrl : DEFAULT_MEAL_IMAGE_URL,
        size: "full",
        aspectRatio: "20:13",
        aspectMode: "cover",
    },
    body: {
        type: "box",
        layout: "vertical",
        paddingAll: "12px",
        backgroundColor: "#F3F3F3",
        contents: [
            {
                type: "text",
                text: meal.mealName,
                size: "xl",
                weight: "bold",
                color: "#111111",
                wrap: true,
            },
            {
                type: "box",
                layout: "horizontal",
                margin: "sm",
                contents: [
                    {
                        type: "text",
                        text: "คาร์โบไฮเดรต",
                        size: "md",
                        color: "#1F1F1F",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${meal.carbohydrate} กรัม`,
                        size: "md",
                        color: "#1F1F1F",
                        align: "end",
                        wrap: true,
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
                        text: "โปรตีน",
                        size: "md",
                        color: "#1F1F1F",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${meal.protein} กรัม`,
                        size: "md",
                        color: "#1F1F1F",
                        align: "end",
                        wrap: true,
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
                        text: "ไขมัน",
                        size: "md",
                        color: "#1F1F1F",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${meal.fat} กรัม`,
                        size: "md",
                        color: "#1F1F1F",
                        align: "end",
                        wrap: true,
                        flex: 0,
                    },
                ],
            },
            {
                type: "separator",
                margin: "md",
                color: "#D0D0D0",
            },
            {
                type: "box",
                layout: "horizontal",
                margin: "md",
                contents: [
                    {
                        type: "text",
                        text: "ปริมาณแคลอรี่",
                        size: "lg",
                        color: "#1F1F1F",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${meal.calories} แคลอรี่`,
                        size: "lg",
                        color: "#1F1F1F",
                        align: "end",
                        wrap: true,
                        flex: 0,
                    },
                ],
            },
        ],
    },
    footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "12px",
        backgroundColor: "#F3F3F3",
        contents: [
            {
                type: "box",
                layout: "vertical",
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
                            uri: meal.detailUrl,
                        },
                    },
                ],
            },
        ],
    },
});

export const TodayNutritionSummaryMessage = (
    planNavigateUrl: string,
    intake: TodayNutritionSummaryInput,
    plan: TodayNutritionPlanInput,
    meals: TodayNutritionMealItem[],
    nutritionScore: number,
): messagingApi.Message[] => {
    const shownMeals = meals.slice(0, 11);

    const bubbles: messagingApi.FlexBubble[] = [
        buildSummaryBubble(planNavigateUrl, intake, plan, nutritionScore),
        ...shownMeals.map(buildMealBubble),
    ];

    return [
        {
            type: "flex",
            altText: `สรุปโภชนาการวันนี้ ${shownMeals.length} มื้อ`,
            contents: {
                type: "carousel",
                contents: bubbles,
            },
        },
    ];
};
