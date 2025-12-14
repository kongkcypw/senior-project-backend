import { messagingApi } from "@line/bot-sdk";

export const ManageProgramMessages = (
    navigateUrlNutrition: string,
    navigateUrlWorkout: string,
    displayName: string | null,
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
                            text: "จัดการโปรแกรม",
                            weight: "bold",
                            size: "xl",
                            color: "#000000"
                        },
                        {
                            type: "text",
                            text: `@${displayName ?? 'ไม่ระบุ'}`,
                            size: "md",
                            color: "#555555",
                            margin: "md",
                            weight: "bold"
                        },
                        {
                            type: "separator",
                            margin: "lg",
                            color: "#FFFFFF00"
                        }
                    ]
                },
                footer: {
                    type: "box",
                    layout: "horizontal",
                    spacing: "sm",
                    contents: [
                        {
                            type: "button",
                            color: "#8C9BAB",
                            style: "link",
                            action: {
                                type: "uri",
                                label: "โภชนาการ",
                                uri: navigateUrlNutrition
                            },
                            height: "sm",
                            flex: 1
                        },
                        {
                            type: "button",
                            color: "#8C9BAB",
                            style: "link",
                            action: {
                                type: "uri",
                                label: "ออกกำลังกาย",
                                uri: navigateUrlWorkout
                            },
                            height: "sm",
                            flex: 1
                        }
                    ]
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