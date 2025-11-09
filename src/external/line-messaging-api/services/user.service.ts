import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { LineMessagingApiConfigService } from "./config.service";
import { LINE_MESSAGING_API_BASE_ENDPOINT_URL } from "../constants/base-endpoint-url";
import { lastValueFrom } from "rxjs";
import { GetProfileResponse } from "../types/get-profile-response.type";

@Injectable()
export class LineMessagingApiUserService {

    private readonly headers: { Authorization: string };
    
    constructor(
        private readonly httpService: HttpService,
        private readonly lineMessagingApiConfigService: LineMessagingApiConfigService,
    ) {
        this.headers = { Authorization: `Bearer ${this.lineMessagingApiConfigService.channelAccessToken}` };
    }

    /**
     * Get user profile or null if not found
     * @param userId User ID. Found in the source object of webhook event objects. Do not use the LINE ID used in LINE.
     * @returns displayName, userId, language?, pictureUrl?, statusMessage?
     * @errorStatus 400: An invalid user ID is specified.
     * @errorStatus 404: Unable to get profile information. Consider these reasons:
       @errorStatus404 Target user ID doesn't exist.
       @errorStatus404 The user hasn't consented to their profile information being obtained.
       @errorStatus404 The user hasn't added the target LINE Official Account as a friend.
       @errorStatus404 The user blocked the target LINE Official Account after adding it as a friend.
     */
    async getProfile(userId: string): Promise<GetProfileResponse | null> {
        try {
            const url = `${LINE_MESSAGING_API_BASE_ENDPOINT_URL}/v2/bot/profile/${userId}`;
            const observable = this.httpService.get(url, { headers: this.headers });
            const response = await lastValueFrom(observable);
            return response.data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            return null;
        }
    }
}