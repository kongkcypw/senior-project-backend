import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { lastValueFrom } from "rxjs";
import { LINE_MESSAGING_API_BASE_ENDPOINT_URL } from "../constants/base-endpoint-url";
import { LineMessagingApiConfigService } from "./config.service";
import { GetGroupChatSummaryResponse } from "../types/get-group-chat-summary-response.type";
import { GetGroupChatMemberProfile } from "../types/get-group-chat-member-profile.type";

@Injectable()
export class LineMessagingApiGroupChatService {

    private readonly headers: { Authorization: string };

    constructor(
        private readonly httpService: HttpService,
        private readonly lineMessagingApiConfigService: LineMessagingApiConfigService,
    ) {
        this.headers = { Authorization: `Bearer ${this.lineMessagingApiConfigService.channelAccessToken}` };
    }

    /**
     * Get group chat summary or null if not found (catch errors)
     * @param groupId Group ID. Found in the source object of webhook event objects.
     * @returns groupId, groupName, pictureUrl?
     * @errorStatus 400: An invalid group ID is specified.
     * @errorStatus 404: A non-existent group or a group that your LINE Official Account doesn't participate in is specified.
     */
    async getGroupChatSummary(groupId: string): Promise<GetGroupChatSummaryResponse | null> {
        try {
            const url = `${LINE_MESSAGING_API_BASE_ENDPOINT_URL}/v2/bot/group/${groupId}/summary`;
            const observable = this.httpService.get(url, { headers: this.headers });
            const response = await lastValueFrom(observable);
            return response.data;
        } catch (error) {
            // Status: 400: An invalid group ID is specified.
            // Status: 404 A non-existent group or a group that your LINE Official Account doesn't participate in is specified.
            console.error('Error fetching group chat summary:', error);
            return null;
        }
    }

    /**
     * Get member count in a group chat or null if not found (catch errors) The number returned excludes the LINE Official Account.
     * @param groupId Group ID. Found in the source object of webhook event objects.
     * @returns number of members
     * @errorStatus 400: An invalid group ID is specified.
     * @errorStatus 404: A non-existent group or a group that your LINE Official Account doesn't participate in is specified.
     */
    async getGroupChatMemberCount(groupId: string): Promise<number | null> {
        try {
            const url = `${LINE_MESSAGING_API_BASE_ENDPOINT_URL}/v2/bot/group/${groupId}/members/count`;
            const observable = this.httpService.get(url, { headers: this.headers });
            const response = await lastValueFrom(observable);
            return response.data.count;
        } catch (error) {
            console.error('Error fetching group chat member count:', error);
            return null;
        }
    }

    /**
     * Get member profile in a group chat or null if not found (catch errors)
     * @param groupId Group ID. Found in the source object of webhook event objects.
     * @param userId User ID. Found in the source object of webhook event objects. Do not use the LINE ID used in LINE.
     * @returns displayName, userId, pictureUrl?
     * @errorStatus 400: An invalid group ID or user ID is specified.
     * @errorStatus 404: A non-existent group, a group that your LINE Official Account doesn't participate in, or a user who is not a member of the group is specified.
     */
    async getGroupChatMemberProfile(groupId: string, userId: string): Promise<GetGroupChatMemberProfile | null> {
        try {
            const url = `${LINE_MESSAGING_API_BASE_ENDPOINT_URL}/v2/bot/group/${groupId}/member/${userId}`;
            const observable = this.httpService.get(url, { headers: this.headers });
            const response = await lastValueFrom(observable);
            return response.data;
        } catch (error) {
            console.error('Error fetching group chat member profile:', error);
            return null;
        }
    }

    /**
     * Leave a group chat
     * @param groupId Group ID. Found in the source object of webhook event objects.
     * @return true if left successfully, false otherwise
     */
    async leaveGroupChat(groupId: string): Promise<boolean> {
        try {
            const url = `${LINE_MESSAGING_API_BASE_ENDPOINT_URL}/v2/bot/group/${groupId}/leave`;
            const observable = this.httpService.post(url, {}, { headers: this.headers });
            await lastValueFrom(observable);
            return true;
        } catch (error) {
            console.error('Error leaving group chat:', error);
            return false;
        }
    }
}