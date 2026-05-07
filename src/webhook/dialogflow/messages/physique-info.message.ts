import { messagingApi } from "@line/bot-sdk";

export interface PhysiqueInfoData {
    heightCm: number;
    weightKg: number;
    bodyFatPercentage: number | null;
    goal: string | null;
    updatedAtText: string;
}

const DEFAULT_PROFILE_IMAGE_URL = "https://khunphan.dpdns.org/assets/profile/profile-place-holder.png";

const resolveProfileImageUrl = (profileImageUrl?: string | null): string =>
    profileImageUrl?.trim() ? profileImageUrl : DEFAULT_PROFILE_IMAGE_URL;

const buildHeader = (profileImageUrl?: string | null): messagingApi.FlexBox => ({
    type: "box",
    layout: "horizontal",
    backgroundColor: "#4E7FFF",
    paddingAll: "12px",
    contents: [
        {
            type: "box",
            layout: "vertical",
            width: "40px",
            height: "40px",
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
            type: "text",
            text: "ข้อมูลสัดส่วน",
            size: "lg",
            weight: "bold",
            color: "#FFFFFF",
            margin: "md",
            wrap: true,
            flex: 1,
        },
    ],
});

const buildValueRow = (label: string, value: string): messagingApi.FlexBox => ({
    type: "box",
    layout: "horizontal",
    margin: "xs",
    contents: [
        {
            type: "text",
            text: label,
            size: "sm",
            weight: "bold",
            color: "#111111",
            wrap: true,
            flex: 1,
        },
        {
            type: "text",
            text: value,
            size: "sm",
            color: "#111111",
            align: "end",
            wrap: true,
            flex: 0,
        },
    ],
});

const buildPhysiqueBubble = (
    data: PhysiqueInfoData,
    profileImageUrl: string | null,
    navigateUrl: string,
): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "kilo",
    header: buildHeader(profileImageUrl),
    body: {
        type: "box",
        layout: "vertical",
        paddingAll: "16px",
        contents: [
            buildValueRow("ส่วนสูง:", `${data.heightCm} ซม.`),
            buildValueRow("น้ำหนัก:", `${data.weightKg} กก.`),
            buildValueRow(
                "เปอร์เซ็นไขมัน:",
                data.bodyFatPercentage === null
                    ? "-"
                    : `${data.bodyFatPercentage} %`,
            ),
            buildValueRow("เป้าหมาย:", data.goal?.trim() ? data.goal : "-"),
            {
                type: "text",
                text: `อัพเดทวันที่: ${data.updatedAtText}`,
                size: "xs",
                color: "#666666",
                align: "end",
                wrap: true,
                margin: "md",
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
                            label: "รายละเอียด",
                            uri: navigateUrl,
                        },
                    },
                ],
            },
        ],
    },
});

const buildNoDataBubble = (
    profileImageUrl: string | null,
    navigateUrl: string,
): messagingApi.FlexBubble => ({
    type: "bubble",
    size: "kilo",
    header: buildHeader(profileImageUrl),
    body: {
        type: "box",
        layout: "vertical",
        paddingAll: "16px",
        contents: [
            {
                type: "text",
                text: "คุณยังไม่ได้บันทึกข้อมูล",
                size: "lg",
                weight: "bold",
                color: "#111111",
                wrap: true,
            },
            {
                type: "text",
                text: "บันทึกข้อมูลเพื่อให้เราทราบรายละเอียดและเป้าหมายของคุณ",
                size: "sm",
                color: "#555555",
                wrap: true,
                margin: "sm",
            },
        ],
    },
    footer: {
        type: "box",
        layout: "vertical",
        paddingAll: "12px",
        contents: [
            {
                type: "button",
                style: "primary",
                color: "#3B6EF5",
                height: "sm",
                action: {
                    type: "uri",
                    label: "บันทึก",
                    uri: navigateUrl,
                },
            },
        ],
    },
});

export const PhysiqueInfoMessage = (
    data: PhysiqueInfoData | null,
    profileImageUrl: string | null,
    navigateUrl: string,
): messagingApi.Message[] => [
    {
        type: "flex",
        altText: "ข้อมูลสัดส่วน",
        contents: data
            ? buildPhysiqueBubble(data, profileImageUrl, navigateUrl)
            : buildNoDataBubble(profileImageUrl, navigateUrl),
    },
];
