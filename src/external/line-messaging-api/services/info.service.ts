import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { LINE_MESSAGING_API_BASE_ENDPOINT_URL } from "../constants/base-endpoint-url";
import { lastValueFrom } from "rxjs";

export interface BotInfoResponse {
    userId: string;
    basicId: string;
    premiumId?: string;
    displayName: string;
    pictureUrl?: string;
    chatMode: string;
    markAsReadMode: string;
}

@Injectable()
export class LineMessagingApiInfoService {
    constructor(private readonly httpService: HttpService) {}

    async getBotInfo(channelAccessToken: string): Promise<BotInfoResponse | null> {
        try {
            const url = `${LINE_MESSAGING_API_BASE_ENDPOINT_URL}/v2/bot/info`;
            const observable = this.httpService.get(url, {
                headers: { Authorization: `Bearer ${channelAccessToken}` },
            });
            const response = await lastValueFrom(observable);
            return response.data;
        } catch (error) {
            console.error('Error fetching bot info:', error);
            return null;
        }
    }
}
