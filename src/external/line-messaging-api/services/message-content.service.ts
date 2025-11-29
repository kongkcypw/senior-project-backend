import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { LineMessagingApiConfigService } from "./config.service";
import { LINE_MESSAGING_API_DATA_ENDPOINT_URL } from "../constants/base-endpoint-url";
import { lastValueFrom } from 'rxjs'; // Import for better async handling
import { GetMessageContentResponse } from "../types/get-message-content.type";

@Injectable()
export class LineMessagingApiMessageContentService {

    private readonly headers: { Authorization: string };

    constructor(
        private readonly httpService: HttpService,
        private readonly lineMessagingApiConfigService: LineMessagingApiConfigService,
    ) {
        // Initialize headers with the Bearer token
        this.headers = {
            Authorization: `Bearer ${this.lineMessagingApiConfigService.channelAccessToken}`
        };
    }

    /**
     * Retrieves the binary content (image, video, etc.) of a LINE message.
     * @param messageId The ID of the message to retrieve content for.
     * @returns A Promise that resolves to a Buffer containing the file data.
     */
    async getMessageContent(messageId: string): Promise<GetMessageContentResponse | null> {
        const url = `${LINE_MESSAGING_API_DATA_ENDPOINT_URL}/v2/bot/message/${messageId}/content`;

        try {
            const response = this.httpService.get(url, {
                headers: this.headers,
                responseType: 'arraybuffer',
            });

            const axiosResponse = await lastValueFrom(response);

            const contentType = axiosResponse.headers['content-type'];

            if (!contentType) {
                throw new Error('Content-Type header missing from LINE API response.');
            }

            return {
                buffer: Buffer.from(axiosResponse.data),
                contentType: contentType,
            };

        } catch (error) {
            console.error('Error fetching message content from LINE API:', error);
            return null;
        }
    }
}