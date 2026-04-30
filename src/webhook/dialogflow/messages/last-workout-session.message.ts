import { messagingApi } from "@line/bot-sdk";

export interface LastWorkoutSessionCardData {
    programName: string;
    sessionName: string;
    exerciseCount: number;
    sessionDateText: string;
    completedSessionsThisWeek: number;
    totalRoutines: number;
    navigateUrl: string;
}

const HERO_IMAGE_URL = "https://khunphan.dpdns.org/flex-message/dumbell_with_gradient_background.png";

const buildNoLastSessionBubble = (workoutPlanUrl: string): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "mega",
    header: {
        type: "box",
        layout: "vertical",
        paddingAll: "16px",
        contents: [
            {
                type: "text",
                text: "ออกกำลังกายครั้งล่าสุด",
                size: "xl",
                weight: "bold",
                color: "#FFFFFF",
                wrap: true,
            },
        ],
        background: {
            type: "linearGradient",
            angle: "180deg",
            startColor: "#7B97F4",
            endColor: "#4270ED",
        },
    },
    body: {
        type: "box",
        layout: "vertical",
        paddingAll: "16px",
        backgroundColor: "#F3F3F3",
        contents: [
            {
                type: "text",
                text: "ไม่พบการออกกำลังกายครั้งล่าสุด",
                margin: "xs",
                size: "xl",
                weight: "bold",
                color: "#111111",
                wrap: true,
            },
            {
                type: "text",
                text: "คุณยังไม่เคยบันทึกเซสชันออกกำลังกายของคุณ คุณสามารถคลิกปุ่มเริ่มบันทึกเซสชันตามโปรแกรมที่เลือกได้",
                margin: "sm",
                size: "md",
                color: "#1F1F1F",
                wrap: true,
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
                            uri: workoutPlanUrl,
                        },
                    },
                ],
            },
        ],
    },
});

const buildLastSessionBubble = (item: LastWorkoutSessionCardData): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "mega",
    hero: {
        type: "image",
        url: HERO_IMAGE_URL,
        size: "full",
        aspectRatio: "4:3",
        aspectMode: "cover",
    },
    body: {
        type: "box",
        layout: "vertical",
        paddingAll: "14px",
        backgroundColor: "#F3F3F3",
        contents: [
            {
                type: "text",
                text: `โปรแกรม: ${item.programName}`,
                margin: "xs",
                size: "lg",
                color: "#111111",
                wrap: true,
            },
            {
                type: "text",
                text: `เซสชัน: ${item.sessionName}`,
                margin: "xs",
                size: "lg",
                color: "#111111",
                wrap: true,
            },
            {
                type: "text",
                text: `จำนวนท่าออกกำลังกาย: ${item.exerciseCount}`,
                margin: "sm",
                size: "md",
                color: "#888888",
                wrap: true,
            },
            {
                type: "text",
                text: `วันที่: ${item.sessionDateText}`,
                margin: "sm",
                size: "md",
                color: "#888888",
                wrap: true,
            },
            {
                type: "separator",
                margin: "md",
                color: "#B5B5B5",
            },
            {
                type: "text",
                text: `เซสชั่นที่สำเร็จแล้ว(สัปดาห์นี้): ${item.completedSessionsThisWeek}/${item.totalRoutines}`,
                margin: "md",
                size: "md",
                color: "#1F1F1F",
                wrap: true,
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
                            uri: item.navigateUrl,
                        },
                    },
                ],
            },
        ],
    },
});

export const LastWorkoutSessionMessages = (
    lastSession: LastWorkoutSessionCardData | null,
    workoutPlanUrl: string,
): messagingApi.Message[] => {
    const bubble = lastSession
        ? buildLastSessionBubble(lastSession)
        : buildNoLastSessionBubble(workoutPlanUrl);

    return [
        {
            type: "flex",
            altText: lastSession ? "ออกกำลังกายครั้งล่าสุด" : "ไม่พบการออกกำลังกายครั้งล่าสุด",
            contents: bubble,
        },
    ];
};
