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

/**
 * Returns a Flex Message carousel of workout routine cards.
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
): messagingApi.Message[] => {
    const bubbles = routines.slice(0, 12).map(buildBubble);

    if (bubbles.length === 0) return [];

    if (bubbles.length === 1) {
        return [
            {
                type: "flex",
                altText: `เซสชัน: ${routines[0].sessionName}`,
                contents: bubbles[0],
            },
        ];
    }

    return [
        {
            type: "flex",
            altText: `รายการเซสชัน ${routines[0].programName}`,
            contents: {
                type: "carousel",
                contents: bubbles,
            },
        },
    ];
};
