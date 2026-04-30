import { messagingApi } from "@line/bot-sdk";

export interface MealHistoryMealItem {
    mealName: string;
    imageUrl: string;
    detailUrl: string;
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
}

export interface MealHistoryIntake {
    calories: number;
    carbohydrate: number;
    protein: number;
    fat: number;
}

// Maximum meal cards shown before replacing the last slot with a "see more" card
const MAX_MEAL_CARDS = 9;

const buildSummaryBubble = (
    dateLabel: string,
    intake: MealHistoryIntake,
    totalMeals: number,
    navigateUrl: string,
): messagingApi.FlexBubble => ({
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
                text: `วันที่ ${dateLabel}`,
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
                    { type: "text", text: "แคลอรี่", size: "md", color: "#1F1F1F", wrap: true, flex: 1 },
                    { type: "text", text: `${intake.calories} แคลอรี่`, size: "md", color: "#1F1F1F", align: "end", wrap: true, flex: 0 },
                ],
            },
            {
                type: "box",
                layout: "horizontal",
                margin: "xs",
                contents: [
                    { type: "text", text: "คาร์โบไฮเดรต", size: "md", color: "#1F1F1F", wrap: true, flex: 1 },
                    { type: "text", text: `${intake.carbohydrate} กรัม`, size: "md", color: "#1F1F1F", align: "end", wrap: true, flex: 0 },
                ],
            },
            {
                type: "box",
                layout: "horizontal",
                margin: "xs",
                contents: [
                    { type: "text", text: "โปรตีน", size: "md", color: "#1F1F1F", wrap: true, flex: 1 },
                    { type: "text", text: `${intake.protein} กรัม`, size: "md", color: "#1F1F1F", align: "end", wrap: true, flex: 0 },
                ],
            },
            {
                type: "box",
                layout: "horizontal",
                margin: "xs",
                contents: [
                    { type: "text", text: "ไขมัน", size: "md", color: "#1F1F1F", wrap: true, flex: 1 },
                    { type: "text", text: `${intake.fat} กรัม`, size: "md", color: "#1F1F1F", align: "end", wrap: true, flex: 0 },
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
                    { type: "text", text: "จำนวนมื้ออาหาร", size: "md", color: "#1F1F1F", wrap: true, flex: 1 },
                    { type: "text", text: `${totalMeals} มื้อ`, size: "md", color: "#4270ED", weight: "bold", align: "end", wrap: true, flex: 0 },
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
                    label: "ดูรายละเอียด",
                    uri: navigateUrl,
                },
            },
        ],
    },
});

const buildMealBubble = (meal: MealHistoryMealItem): messagingApi.FlexBubble => {
    const bubble: messagingApi.FlexBubble = {
        type: "bubble",
        size: "kilo",
        body: {
            type: "box",
            layout: "vertical",
            paddingAll: "12px",
            backgroundColor: "#F3F3F3",
            contents: [
                { type: "text", text: meal.mealName, size: "xl", weight: "bold", color: "#111111", wrap: true },
                {
                    type: "box",
                    layout: "horizontal",
                    margin: "sm",
                    contents: [
                        { type: "text", text: "คาร์โบไฮเดรต", size: "md", color: "#1F1F1F", wrap: true, flex: 1 },
                        { type: "text", text: `${meal.carbohydrate} กรัม`, size: "md", color: "#1F1F1F", align: "end", wrap: true, flex: 0 },
                    ],
                },
                {
                    type: "box",
                    layout: "horizontal",
                    margin: "xs",
                    contents: [
                        { type: "text", text: "โปรตีน", size: "md", color: "#1F1F1F", wrap: true, flex: 1 },
                        { type: "text", text: `${meal.protein} กรัม`, size: "md", color: "#1F1F1F", align: "end", wrap: true, flex: 0 },
                    ],
                },
                {
                    type: "box",
                    layout: "horizontal",
                    margin: "xs",
                    contents: [
                        { type: "text", text: "ไขมัน", size: "md", color: "#1F1F1F", wrap: true, flex: 1 },
                        { type: "text", text: `${meal.fat} กรัม`, size: "md", color: "#1F1F1F", align: "end", wrap: true, flex: 0 },
                    ],
                },
                { type: "separator", margin: "md", color: "#D0D0D0" },
                {
                    type: "box",
                    layout: "horizontal",
                    margin: "md",
                    contents: [
                        { type: "text", text: "ปริมาณแคลอรี่", size: "lg", color: "#1F1F1F", wrap: true, flex: 1 },
                        { type: "text", text: `${meal.calories} แคลอรี่`, size: "lg", color: "#1F1F1F", align: "end", wrap: true, flex: 0 },
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
                            action: { type: "uri", label: "รายละเอียด", uri: meal.detailUrl },
                        },
                    ],
                },
            ],
        },
    };

    if (meal.imageUrl) {
        bubble.hero = {
            type: "image",
            url: meal.imageUrl,
            size: "full",
            aspectRatio: "20:13",
            aspectMode: "cover",
        };
    }

    return bubble;
};

const buildSeeMoreBubble = (remaining: number, seeMoreUrl: string): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "kilo",
    body: {
        type: "box",
        layout: "vertical",
        paddingAll: "16px",
        backgroundColor: "#F3F3F3",
        cornerRadius: "xxl",
        justifyContent: "center",
        contents: [
            {
                type: "text",
                text: `ยังมีอาหารอีก ${remaining} มื้อ`,
                size: "xl",
                weight: "bold",
                color: "#111111",
                wrap: true,
                align: "center",
            },
            {
                type: "text",
                text: "กดปุ่มด้านล่างเพื่อดูทั้งหมด",
                size: "md",
                color: "#555555",
                wrap: true,
                align: "center",
                margin: "sm",
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
                action: { type: "uri", label: "ดูทั้งหมด", uri: seeMoreUrl },
            },
        ],
    },
});

export const MealHistoryMessage = (
    dateLabel: string,
    seeMoreUrl: string,
    intake: MealHistoryIntake,
    meals: MealHistoryMealItem[],
): messagingApi.Message[] => {
    const mealBubbles: messagingApi.FlexBubble[] = [];

    if (meals.length > MAX_MEAL_CARDS) {
        // Show first (MAX_MEAL_CARDS - 1) meals + 1 "see more" card
        const shown = meals.slice(0, MAX_MEAL_CARDS - 1);
        const remaining = meals.length - shown.length;
        mealBubbles.push(...shown.map(buildMealBubble));
        mealBubbles.push(buildSeeMoreBubble(remaining, seeMoreUrl));
    } else {
        mealBubbles.push(...meals.map(buildMealBubble));
    }

    const bubbles: messagingApi.FlexBubble[] = [
        buildSummaryBubble(dateLabel, intake, meals.length, seeMoreUrl),
        ...mealBubbles,
    ];

    return [
        {
            type: "flex",
            altText: `ประวัติอาหาร วันที่ ${dateLabel} (${meals.length} มื้อ)`,
            contents: {
                type: "carousel",
                contents: bubbles,
            },
        },
    ];
};
