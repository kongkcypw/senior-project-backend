import { HTTPFetchError, messagingApi } from '@line/bot-sdk';
import { HttpStatus, Injectable } from '@nestjs/common';

import { LineWebhookConfigService } from './line-webhook-config.service';

@Injectable()
export class LineMessagingApiClientService {
  private readonly client: messagingApi.MessagingApiClient;

  constructor(
    private readonly lineWebhookConfigService: LineWebhookConfigService,
  ) {
    this.client = new messagingApi.MessagingApiClient({
      channelAccessToken: lineWebhookConfigService.channelAccessToken,
    });
  }

  async sendReplyMessages(
    replyToken: string,
    messages: messagingApi.Message[],
  ): Promise<void> {
    try {
      await this.client.replyMessage({ replyToken, messages });
    } catch (error) {
      if (this.isHttpClientError(error)) {
        console.log(`Failed to send reply message due to client error: ${error.message}`)

        return;
      }

      throw error;
    }
  }

  async linkRichMenuIdToUser(
    lineUserId: string,
    richMenuId: string,
  ): Promise<void> {
    try {
      await this.client.linkRichMenuIdToUser(lineUserId, richMenuId);
    } catch (error) {
      if (this.isHttpClientError(error)) {
        console.log(
            `Failed to link rich menu ID to user due to client error: ${error.message}`,
        )

        return;
      }

      throw error;
    }
  }

  async unlinkRichMenuIdFromUser(lineUserId: string): Promise<void> {
    try {
      await this.client.unlinkRichMenuIdFromUser(lineUserId);
    } catch (error) {
      if (this.isHttpClientError(error)) {
        console.log(
            `Failed to unlink rich menu ID from user due to client error: ${error.message}`,
        )

        return;
      }

      throw error;
    }
  }

  private isHttpClientError(error: unknown): error is HTTPFetchError {
    return (
      error instanceof HTTPFetchError &&
      error.status >= HttpStatus.BAD_REQUEST &&
      error.status < HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}
