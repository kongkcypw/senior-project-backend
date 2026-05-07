import { messagingApi } from "@line/bot-sdk";

const DEFAULT_PROFILE_IMAGE_URL = "https://khunphan.dpdns.org/assets/profile/profile-place-holder.png";

const resolveProfileImageUrl = (profileImageUrl?: string | null): string =>
    profileImageUrl?.trim() ? profileImageUrl : DEFAULT_PROFILE_IMAGE_URL;

export const MemberJoinEventMessages = (
    membersDisplayName: string[],
    navigateUrl: string,
    profileImageUrl?: string | null,
): messagingApi.Message[] => {

    let displayNames: string = '';

    if (membersDisplayName.length > 1) {
        for (const memberDisplayName of membersDisplayName) {
            if (memberDisplayName === '') {
                displayNames = 'สมาชิกใหม่';
                break;
            }
            displayNames += `${memberDisplayName}, `;
        }
        displayNames = displayNames.slice(0, -2);
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
            altText: "ยินดีต้อนรับ " + displayNames,
            contents: {
                type: "bubble",
                header: {
                    type: "box",
                    layout: "horizontal",
                    backgroundColor: "#4E7FFF",
                    paddingAll: "12px",
                    contents: [
                        {
                            type: "box",
                            layout: "vertical",
                            width: "48px",
                            height: "48px",
                            cornerRadius: "999px",
                            borderWidth: "2px",
                            borderColor: "#FFFFFF",
                            contents: [
                                {
                                    type: "image",
                                    url: resolveProfileImageUrl(profileImageUrl),
                                    size: "full",
                                    aspectRatio: "1:1",
                                    aspectMode: "cover",
                                },
                            ],
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            margin: "md",
                            flex: 1,
                            justifyContent: "center",
                            contents: [
                                {
                                    type: "text",
                                    text: "ยินดีต้อนรับ!",
                                    size: "xs",
                                    color: "#DDEEFF",
                                    weight: "regular",
                                },
                                {
                                    type: "text",
                                    text: displayNames,
                                    size: "lg",
                                    weight: "bold",
                                    color: "#FFFFFF",
                                    wrap: true,
                                },
                            ],
                        },
                    ],
                },
                body: {
                    type: "box",
                    layout: "vertical",
                    paddingAll: "16px",
                    contents: [
                        {
                            type: "text",
                            text: "ก่อนจะเริ่มใช้งาน ขุนพันธ์แนะนำให้คุณกรอกข้อมูลร่างกายและเป้าหมายของคุณ เพื่อให้เราสามารถให้คำแนะนำคุณได้ดียิ่งขึ้น",
                            wrap: true,
                            color: "#555555",
                            size: "sm",
                        },
                    ],
                },
                footer: {
                    type: "box",
                    layout: "vertical",
                    paddingAll: "12px",
                    contents: [
                        {
                            type: "separator",
                            color: "#D0D0D0",
                        },
                        {
                            type: "box",
                            layout: "vertical",
                            margin: "md",
                            borderColor: "#4E7FFF",
                            borderWidth: "normal",
                            cornerRadius: "md",
                            contents: [
                                {
                                    type: "button",
                                    style: "link",
                                    color: "#4E7FFF",
                                    height: "sm",
                                    action: {
                                        type: "uri",
                                        label: "กรอกข้อมูล",
                                        uri: navigateUrl,
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        },
    ];
}
