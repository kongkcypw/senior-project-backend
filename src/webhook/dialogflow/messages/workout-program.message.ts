import { messagingApi } from "@line/bot-sdk";

export const WorkoutProgramMessages = (
    navigateUrl: string
): messagingApi.Message[] => {
    return [
        {
            type: "flex",
            altText: "Flex Message",
            contents: {
                type: "carousel",
                contents: [
                    {
                        type: "bubble",
                        size: "kilo",
                        hero: {
                            type: "image",
                            size: "full",
                            aspectRatio: "20:13",
                            aspectMode: "cover",
                            url: "https://cdn.shopify.com/s/files/1/1497/9682/files/2_3b458939-656d-42a7-ab89-3f827f6b9a83.jpg?v=1648826582"
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "Push Day",
                                    wrap: true,
                                    weight: "bold",
                                    size: "xl"
                                },
                                {
                                    type: "box",
                                    layout: "baseline",
                                    contents: [
                                        {
                                            type: "text",
                                            text: "PPL Program",
                                            wrap: true,
                                            weight: "regular",
                                            size: "lg",
                                            flex: 0
                                        }
                                    ]
                                }
                            ]
                        },
                        footer: {
                            type: "box",
                            layout: "vertical",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "button",
                                    style: "primary",
                                    action: {
                                        type: "uri",
                                        label: "บันทึกข้อมูล",
                                        uri: navigateUrl
                                    }
                                },
                                {
                                    type: "button",
                                    action: {
                                        type: "uri",
                                        label: "รายละเอียดโปรแกรม",
                                        uri: navigateUrl
                                    }
                                }
                            ]
                        }
                    },
                    {
                        type: "bubble",
                        size: "kilo",
                        hero: {
                            type: "image",
                            size: "full",
                            aspectRatio: "20:13",
                            aspectMode: "cover",
                            url: "https://s3assets.skimble.com/assets/2900765/image_iphone.jpg"
                        },
                        body: {
                            type: "box",
                            layout: "vertical",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "text",
                                    text: "Pull Day",
                                    wrap: true,
                                    weight: "bold",
                                    size: "xl"
                                },
                                {
                                    type: "box",
                                    layout: "baseline",
                                    flex: 1,
                                    contents: [
                                        {
                                            type: "text",
                                            text: "PPL Program",
                                            wrap: true,
                                            weight: "regular",
                                            size: "lg",
                                            flex: 0
                                        }
                                    ]
                                },
                                {
                                    type: "text",
                                    text: "สัปดาห์นี้คุณออกกำลังกาย 2 ครั้งแล้ว",
                                    wrap: true,
                                    size: "xxs",
                                    margin: "md",
                                    color: "#ff5551",
                                    flex: 0
                                }
                            ]
                        },
                        footer: {
                            type: "box",
                            layout: "vertical",
                            spacing: "sm",
                            contents: [
                                {
                                    type: "button",
                                    flex: 2,
                                    style: "primary",
                                    color: "#aaaaaa",
                                    action: {
                                        type: "uri",
                                        label: "บันทึกข้อมูล",
                                        uri: navigateUrl
                                    }
                                },
                                {
                                    type: "button",
                                    action: {
                                        type: "uri",
                                        label: "รายละเอียดโปรแกรม",
                                        uri: navigateUrl
                                    }
                                }
                            ]
                        }
                    },
                ]
            }
        }
    ]
}