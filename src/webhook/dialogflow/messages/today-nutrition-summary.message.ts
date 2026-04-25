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

const getPlanStatus = (
    intake: number,
    target: number,
): { text: string; color: string } => {
    if (intake < target) {
        return { text: "(ต้องการเพิ่ม)", color: "#4270ED" };
    }

    if (intake > target) {
        return { text: "(เกินกำหนด)", color: "#FF3B30" };
    }

    return { text: "(พอดี)", color: "#2E7D32" };
};

const buildPlanRow = (
    label: string,
    statusText: string,
    statusColor: string,
    valueText: string,
): messagingApi.FlexBox => {
    const labelContents: messagingApi.FlexComponent[] = [
        {
            type: "text",
            text: label,
            size: "md",
            color: "#1F1F1F",
            wrap: true,
            flex: 0,
        },
    ];

    if (statusText.trim().length > 0) {
        labelContents.push({
            type: "text",
            text: statusText,
            size: "md",
            color: statusColor,
            wrap: true,
            flex: 0,
            margin: "xs",
        });
    }

    return {
        type: "box",
        layout: "horizontal",
        margin: "xs",
        contents: [
            {
                type: "box",
                layout: "baseline",
                contents: labelContents,
                flex: 1,
            },
            {
                type: "text",
                text: valueText,
                size: "md",
                color: "#1F1F1F",
                align: "end",
                wrap: true,
                flex: 0,
            },
        ],
    };
};

const buildSummaryBubble = (
    planNavigateUrl: string,
    intake: TodayNutritionSummaryInput,
    plan: TodayNutritionPlanInput,
): messagingApi.FlexBubble => {
    const carbStatus = getPlanStatus(intake.carbohydrate, plan.carbohydrate);
    const proteinStatus = getPlanStatus(intake.protein, plan.protein);
    const fatStatus = getPlanStatus(intake.fat, plan.fat);

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
                buildPlanRow(
                    "แคลอรี่",
                    "",
                    "#1F1F1F",
                    `${plan.calories} แคลอรี่`,
                ),
                buildPlanRow(
                    "คาร์โบไฮเดรต",
                    carbStatus.text,
                    carbStatus.color,
                    `${plan.carbohydrate} กรัม`,
                ),
                buildPlanRow(
                    "โปรตีน",
                    proteinStatus.text,
                    proteinStatus.color,
                    `${plan.protein} กรัม`,
                ),
                buildPlanRow(
                    "ไขมัน",
                    fatStatus.text,
                    fatStatus.color,
                    `${plan.fat} กรัม`,
                ),
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

const buildMealBubble = (meal: TodayNutritionMealItem): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "kilo",
    hero: {
        type: "image",
        url: meal.imageUrl,
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
                        text: "คาร์โบไฮเดรต",
                        size: "lg",
                        color: "#1F1F1F",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${meal.carbohydrate} กรัม`,
                        size: "lg",
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
                        size: "lg",
                        color: "#1F1F1F",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${meal.protein} กรัม`,
                        size: "lg",
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
                        size: "lg",
                        color: "#1F1F1F",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${meal.fat} กรัม`,
                        size: "lg",
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
                        size: "xl",
                        color: "#1F1F1F",
                        wrap: true,
                        flex: 1,
                    },
                    {
                        type: "text",
                        text: `${meal.calories} แคลอรี่`,
                        size: "xl",
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
): messagingApi.Message[] => {
    const shownMeals = meals.slice(0, 11);

    const bubbles: messagingApi.FlexBubble[] = [
        buildSummaryBubble(planNavigateUrl, intake, plan),
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
