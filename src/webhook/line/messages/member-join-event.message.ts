import { messagingApi } from "@line/bot-sdk";

export const MemberJoinEventMessages = (
    membersDisplayName: string[]
): messagingApi.Message[] => {

    let displayNames: string = '';
    console.log('Members Display Names:', membersDisplayName);

    if (membersDisplayName.length > 1) {
        for (const memberDisplayName of membersDisplayName) {
            console.log('Processing member display name:', memberDisplayName);
            if (memberDisplayName === ''){
                displayNames = 'สมาชิกใหม่';
                break;
            }

            displayNames += `${memberDisplayName}, `;
        }
        displayNames = displayNames.slice(0, -2); // Remove trailing comma and space
    }

    if(membersDisplayName.length === 1 && membersDisplayName[0] && membersDisplayName[0] !== ''){
        displayNames = membersDisplayName[0];
    }

    if (displayNames === '') {
        displayNames = 'สมาชิกใหม่';
    }

    return [
        {
            type: 'text',
            text: `สวัสดี ${displayNames}! ยินดีต้อนรับสู่กลุ่มครับ`,
        }
    ]
}