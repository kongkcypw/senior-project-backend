import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom, Observable } from "rxjs";
import { AxiosResponse } from 'axios';
import { LINE_MESSAGING_API_BASE_ENDPOINT_URL } from "../constants/base-endpoint-url";
import { LineMessagingApiConfigService } from "./config.service";
import { GroupChatSummaryResponse } from "../types/group-chat-summary-response.type";

@Injectable()
export class LineMessagingApiGroupChatService {

    private readonly headers: { Authorization: string };

    constructor(
        private readonly httpService: HttpService,
        private readonly lineMessagingApiConfigService: LineMessagingApiConfigService,
    ) {
        this.headers = { Authorization: `Bearer ${this.lineMessagingApiConfigService.channelAccessToken}` };
    }

    async getGroupChatSummary(groupId: string): Promise<GroupChatSummaryResponse> {
        const url = `${LINE_MESSAGING_API_BASE_ENDPOINT_URL}/v2/bot/group/${groupId}/summary`;
        const observable = this.httpService.get(url, { headers: this.headers });

        console.log(`Fetching summary for group ID: ${groupId}`);
        const response = await lastValueFrom(observable);

        return response.data;
    }
}