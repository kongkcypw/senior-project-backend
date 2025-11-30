import { messagingApi } from "@line/bot-sdk";

export const MemberJoinEventMessages = (
    membersDisplayName: string[],
    navigateUrl: string
): messagingApi.Message[] => {

    let displayNames: string = '';
    console.log('Members Display Names:', membersDisplayName);

    if (membersDisplayName.length > 1) {
        for (const memberDisplayName of membersDisplayName) {
            console.log('Processing member display name:', memberDisplayName);
            if (memberDisplayName === '') {
                displayNames = 'สมาชิกใหม่';
                break;
            }

            displayNames += `${memberDisplayName}, `;
        }
        displayNames = displayNames.slice(0, -2); // Remove trailing comma and space
    }

    if (membersDisplayName.length === 1 && membersDisplayName[0] && membersDisplayName[0] !== '') {
        displayNames = membersDisplayName[0];
    }

    if (displayNames === '') {
        displayNames = 'สมาชิกใหม่';
    }

    return [
        {
            type: "flex",
            altText: "สมาชิกใหม่",
            contents: {
                type: "bubble",
                header: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "ยินดีต้อนรับ " + displayNames,
                            weight: "bold",
                            size: "lg",
                            color: "#008080"
                        }
                    ],
                    paddingAll: "20px",
                    backgroundColor: "#88e7e7"
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    contents: [
                        {
                            type: "text",
                            text: "ก่อนจะเริ่มใช้งาน กรุณากรอกข้อมูลร่างกายและเป้าหมายสุขภาพของคุณ เพื่อให้เราสามารถให้คำแนะนำที่เหมาะสมกับคุณได้มากที่สุด",
                            wrap: true,
                            color: "#666666",
                            size: "sm"
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
                            height: "sm",
                            action: {
                                type: "uri",
                                label: "ตกลง",
                                uri: navigateUrl
                            },
                            color: "#008080"
                        }
                    ]
                }
            }
        }
    ]
}