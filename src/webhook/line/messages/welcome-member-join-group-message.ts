import { messagingApi } from "@line/bot-sdk";

export const welcomeMemberJoinGroupMessage: messagingApi.Message[] = [
    {
        type: 'text',
        text: 'สวัสดีฮ้าฟฟู่',
    }
]