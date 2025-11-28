import { MessageEvent } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { WebhookEventMessageType } from '../enums/webhook-event-message-type.enum';
import { DialogflowWebhookService } from 'src/webhook/dialogflow/services/dialogflow-webhook.service';
import { EventHandler } from '../interfaces/event-handler.interface';
import { LineMessagingApiMessageContentService } from 'src/external/line-messaging-api/services/message-content.service';
import { CloudFlareR2Service } from 'src/external/cloudflare/services/cloudflare-r2.service';
import { WebhookEventSourceType } from '../enums/webhook-event-source-type.enum';
import { R2UploadPathEnum } from 'src/external/cloudflare/enums/r2-upload-path.enum';

@Injectable()
export class MessageEventHandler implements EventHandler<MessageEvent> {

  constructor(
    private readonly dialogflowWebhookService: DialogflowWebhookService,
    private readonly lineMessagingApiMessageContentService: LineMessagingApiMessageContentService,
    private readonly cloudFlareR2Service: CloudFlareR2Service
  ) {
  }

  async handle(event: MessageEvent): Promise<void> {
    console.log('Handling Message Event:', event);
    console.log('Message Event Type:', event.message.type);

    if (event.message.type === WebhookEventMessageType.TEXT) {
      await this.dialogflowWebhookService.getFullfilmentTextAndReplyMessage(event);
    }

    if (event.message.type === WebhookEventMessageType.IMAGE) {
      await this.handleImageMessage(event);
    }

  }

  async handleImageMessage(event: MessageEvent): Promise<void> {

    if (event.source.type !== WebhookEventSourceType.GROUP) {
      return;
    }

    const groupId = event.source.groupId;
    if (!groupId) {
      console.error('Group ID is missing in the event source.');
      return;
    }
    const messageId = event.message.id;

    const userId = event.source.userId;
    if (!userId) {
      console.error('User ID is missing in the event source.');
      return;
    }

    try {
      // Get the content and MIME type from LINE API
      const { buffer, contentType } = await this.lineMessagingApiMessageContentService.getMessageContent(messageId);

      console.log(`Retrieved image content for message ID ${messageId}. MIME type: ${contentType}`);

      // Define the key (filename/path)
      const fileExtension = contentType.split('/')[1] || 'jpeg';
      const fileKey = `${R2UploadPathEnum.LINE_UPLOADS_FROM_GROUP}/${groupId}/${userId}/${messageId}.${fileExtension}`;

      // Upload the buffer to R2
      const publicUrl = await this.cloudFlareR2Service.uploadBuffer(fileKey, buffer, contentType);

      console.log(`Image successfully uploaded to R2. URL: ${publicUrl}`);

      // TODO: Save the publicUrl to database

    } catch (error) {
      console.error(`Failed to process/upload image content for message ID ${messageId}:`, error.message);
    }
  }
}