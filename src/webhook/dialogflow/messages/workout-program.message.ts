import { messagingApi } from "@line/bot-sdk";

export interface WorkoutRoutineItem {
    programName: string;
    sessionName: string;
    exerciseCount: number;
    isCompleted: boolean;
    navigateUrl: string;
}

const buildBubble = (item: WorkoutRoutineItem): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "deca",

    // ── Hero: full-width image + absolute badge ──────────────────────────────
    hero: {
        type: "box",
        layout: "vertical",
        contents: [
            {
                type: "image",
                url: "https://khunphan.dpdns.org/flex-message/dumbell_with_gradient_background.png",
                size: "full",
                aspectRatio: "4:3",
                aspectMode: "cover",
            },
            // Status badge — absolute-positioned over top-left of image
            {
                type: "box",
                layout: "vertical",
                position: "absolute",
                offsetTop: "12px",
                offsetStart: "12px",
                backgroundColor: item.isCompleted ? "#22C55E" : "#EF4444",
                cornerRadius: "xl",
                paddingTop: "4px",
                paddingBottom: "4px",
                paddingStart: "10px",
                paddingEnd: "10px",
                contents: [
                    {
                        type: "text",
                        text: item.isCompleted ? "สำเร็จ" : "ยังไม่สำเร็จ",
                        color: "#FFFFFF",
                        size: "sm",
                        weight: "bold",
                    },
                ],
            },
        ],
    },

    // ── Body: program name, session name, exercise count ─────────────────────
    body: {
        type: "box",
        layout: "vertical",
        paddingAll: "16px",
        contents: [
            {
                type: "text",
                text: item.programName,
                weight: "bold",
                size: "lg",
                wrap: true,
                color: "#111111",
            },
            {
                type: "text",
                text: item.sessionName,
                size: "md",
                wrap: true,
                color: "#333333",
                margin: "xs",
            },
            {
                type: "text",
                text: `จำนวนท่าออกกำลังกาย: ${item.exerciseCount}`,
                size: "sm",
                color: "#888888",
                wrap: true,
                margin: "sm",
            },
        ],
    },

    // ── Footer: outlined "รายละเอียด" button ─────────────────────────────────
    footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "12px",
        contents: [
            {
                // Fake outlined button: box with border wrapping a link-style button
                type: "box",
                layout: "vertical",
                borderColor: "#4E7FFF",
                borderWidth: "light",
                cornerRadius: "md",
                contents: [
                    {
                        type: "button",
                        style: "link",
                        color: "#4E7FFF",
                        height: "sm",
                        action: {
                            type: "uri",
                            label: "รายละเอียด",
                            uri: item.navigateUrl,
                        },
                    },
                ],
            },
        ],
    },
});

const buildSummaryBubble = (routines: WorkoutRoutineItem[], workoutScore: number): messagingApi.FlexBubble => {
    const programName = routines[0]?.programName || "โปรแกรมออกกำลังกาย";
    const score = workoutScore;

    return {
        type: "bubble",
        size: "deca",
        header: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#4E7FFF",
            paddingAll: "12px",
            contents: [
                {
                    type: "text",
                    text: "โปรแกรมออกกำลังกาย",
                    size: "md",
                    weight: "bold",
                    color: "#FFFFFF",
                    wrap: true,
                },
            ],
        },
        body: {
            type: "box",
            layout: "vertical",
            paddingAll: "14px",
            contents: [
                {
                    type: "text",
                    text: `ชื่อโปรแกรม:`,
                    size: "xs",
                    color: "#666666",
                    wrap: true,
                },
                {
                    type: "text",
                    text: programName,
                    size: "sm",
                    weight: "bold",
                    color: "#111111",
                    wrap: true,
                    margin: "xs",
                },
                {
                    type: "separator",
                    margin: "md",
                    color: "#E0E0E0",
                },
                {
                    type: "text",
                    text: `บันทึกของการออกกำลังกาย`,
                    size: "xs",
                    color: "#666666",
                    wrap: true,
                    margin: "md",
                },
                ...routines.map((routine, index) => ({
                    type: "box" as const,
                    layout: "horizontal" as const,
                    margin: "xs" as const,
                    contents: [
                        {
                            type: "text" as const,
                            text: routine.sessionName,
                            weight: "bold" as const,
                            size: "xs" as const,
                            color: "#111111",
                            flex: 2,
                            wrap: true,
                        },
                        {
                            type: "text" as const,
                            text: routine.isCompleted ? "สำเร็จ" : "ยังไม่สำเร็จ",
                            size: "xs" as const,
                            color: routine.isCompleted ? "#22C55E" : "#EF4444",
                            weight: "bold" as const,
                            align: "end" as const,
                            flex: 1,
                        },
                    ],
                })),
                {
                    type: "separator",
                    margin: "md",
                    color: "#E0E0E0",
                },
                {
                    type: "text",
                    text: `คะแนนการออกกำลังกาย:`,
                    size: "xs",
                    color: "#666666",
                    wrap: true,
                    margin: "md",
                },
                {
                    type: "text",
                    text: `${Math.round(score)}/50`,
                    size: "sm",
                    weight: "bold",
                    color: "#111111",
                    wrap: true,
                    margin: "xs",
                },
            ],
        },
    };
};

/**
 * Returns a Flex Message carousel of workout routine cards with summary.
 * First card is a summary showing program name and routine statuses.
 * Pass up to 12 routines; a single routine renders as a plain bubble (no carousel).
 *
 * Example usage in a Dialogflow intent handler:
 *
 *   const messages = WorkoutProgramMessage([
 *     {
 *       programName: "PPL Program",
 *       sessionName: "Push Day",
 *       exerciseCount: 6,
 *       isCompleted: true,
 *       navigateUrl: `${FRONTEND_BASE_URL}/routine-detail/${traineeId}/${routineId}`,
 *     },
 *     { ... }
 *   ]);
 *   await client.replyMessage({ replyToken, messages });
 */
export const WorkoutProgramMessages = (
    routines: WorkoutRoutineItem[],
    workoutScore: number,
): messagingApi.Message[] => {
    if (routines.length === 0) return [];

    const routineBubbles = routines.slice(0, 12).map(buildBubble);
    const summaryBubble = buildSummaryBubble(routines.slice(0, 12), workoutScore);

    return [
        {
            type: "flex",
            altText: `รายการเซสชัน ${routines[0].programName}`,
            contents: {
                type: "carousel",
                contents: [summaryBubble, ...routineBubbles],
            },
        },
    ];
};
