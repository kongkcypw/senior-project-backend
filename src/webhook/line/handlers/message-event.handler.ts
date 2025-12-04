import { MessageEvent } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import { WebhookEventMessageType } from '../enums/webhook-event-message-type.enum';
import { DialogflowWebhookService } from 'src/webhook/dialogflow/services/dialogflow-webhook.service';
import { EventHandler } from '../interfaces/event-handler.interface';
import { LineMessagingApiMessageContentService } from 'src/external/line-messaging-api/services/message-content.service';
import { CloudFlareR2Service } from 'src/external/cloudflare/services/cloudflare-r2.service';
import { WebhookEventSourceType } from '../enums/webhook-event-source-type.enum';
import { R2UploadPathEnum } from 'src/external/cloudflare/enums/r2-upload-path.enum';
import { GeminiService } from 'src/external/gemini/services/gemini.service';
import { MealHistoryService } from 'src/nutrition/services/meal-history.service';
import { LineMessagingApiClientService } from 'src/external/line-messaging-api/services/client.service';
import { MealDetailMessage } from '../messages/meal-detail.message';
import { GeminiAnalyzeFoodImageResponse } from 'src/external/gemini/types/gemini-analyze-food-image-response.type';
import { LineMessagingApiConfigService } from 'src/external/line-messaging-api/services/config.service';

@Injectable()
export class MessageEventHandler implements EventHandler<MessageEvent> {

  constructor(
    private readonly dialogflowWebhookService: DialogflowWebhookService,
    private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    private readonly lineMessagingApiMessageContentService: LineMessagingApiMessageContentService,
    private readonly lineMessagingApiConfigService: LineMessagingApiConfigService,
    private readonly cloudFlareR2Service: CloudFlareR2Service,
    private readonly geminiService: GeminiService,
    private readonly mealHistoryService: MealHistoryService,
  ) {
  }

  async handle(event: MessageEvent): Promise<void> {
    console.log('Handling Message Event:', event);
    console.log('Message Event Type:', event.message.type);

    if (event.message.type === WebhookEventMessageType.IMAGE) {
      await this.handleImageMessage(event);
      return;
    }

    let isBotMentioned = false;

    if (event.message.type === WebhookEventMessageType.TEXT && event.message.mention) {
      for (const mentionee of event.message.mention.mentionees) {
        if (mentionee.userId === this.lineMessagingApiConfigService.chatbotUserId) {
          isBotMentioned = true;
          break;
        }
      }

      if (!isBotMentioned) {
        console.log('Bot not mentioned in the message. Skipping further processing.');
        return;
      }

      console.log('Bot mentioned in the message. Proceeding with Dialogflow processing.');
      await this.dialogflowWebhookService.getFullfilmentTextAndReplyMessage(event);
    }

    // if (event.message.type === WebhookEventMessageType.TEXT) {
    //   await this.dialogflowWebhookService.getFullfilmentTextAndReplyMessage(event);
    // }

  }

  async handleImageMessage(event: MessageEvent): Promise<void> {

    if (event.source.type !== WebhookEventSourceType.GROUP) {
      return;
    }

    const groupId = event.source.groupId;
    const userId = event.source.userId;
    const messageId = event.message.id;
    if (!groupId || !userId) {
      return;
    }

    // Get the content and MIME type from LINE API
    const messageContentResponse = await this.lineMessagingApiMessageContentService.getMessageContent(messageId);
    if (!messageContentResponse) {
      await this.sendErrorGetMessageContent(event);
      return;
    }
    const { buffer, contentType } = messageContentResponse;

    // Define the key (filename/path) and upload to Cloudflare R2
    const fileExtension = contentType.split('/')[1] || 'jpeg';
    const fileKey = `${R2UploadPathEnum.LINE_UPLOADS_FROM_GROUP}/${groupId}/${userId}/${messageId}.${fileExtension}`;
    const publicUrl = await this.cloudFlareR2Service.uploadBuffer(fileKey, buffer, contentType);
    if (!publicUrl) {
      await this.sendErrorUploadToR2(event);
      return;
    }

    // Analyze the image using Gemini
    const analysisResult = await this.geminiService.analyzeFoodImage(buffer, contentType);
    if (!analysisResult) {
      await this.sendErrorAnalyzeImage(event);
      return;
    }
    if (analysisResult.data.is_food === false) {
      await this.sendNotFoodImageMessage(event);
      return;
    }

    await this.mealHistoryService.insertMealHistory({
      lineUserId: userId,
      imageUrl: publicUrl,
      foodTitle: analysisResult.data.foodTitle,
      ingredients: analysisResult.data.ingredients,
      calories: analysisResult.data.nutritionFacts.calories,
      protein: analysisResult.data.nutritionFacts.protein,
      carbohydrate: analysisResult.data.nutritionFacts.carbohydrates,
      fat: analysisResult.data.nutritionFacts.fat,
    });

    // TODO: Save to line group chat history

    this.sendMealDetailMessage(event, analysisResult.data);
  }

  async sendErrorGetMessageContent(event: MessageEvent): Promise<void> {
    await this.lineMessagingApiClientService.sendReplyMessages(
      event.replyToken,
      [
        {
          type: 'text',
          text: 'ขออภัยครับ ไม่สามารถดึงข้อมูลรูปภาพได้ กรุณาลองส่งรูปภาพอีกครั้งครับ',
        }
      ]
    );
  }

  async sendErrorUploadToR2(event: MessageEvent): Promise<void> {
    await this.lineMessagingApiClientService.sendReplyMessages(
      event.replyToken,
      [
        {
          type: 'text',
          text: 'ขออภัยครับ เกิดปัญหาในการอัปโหลดรูปภาพ กรุณาลองส่งรูปภาพอีกครั้งครับ',
        }
      ]
    );
  }

  async sendErrorAnalyzeImage(event: MessageEvent): Promise<void> {
    await this.lineMessagingApiClientService.sendReplyMessages(
      event.replyToken,
      [
        {
          type: 'text',
          text: 'ขออภัยครับ ไม่สามารถวิเคราะห์รูปภาพได้ กรุณาลองส่งรูปภาพอีกครั้งครับ',
        }
      ]
    );
  }

  async sendNotFoodImageMessage(event: MessageEvent): Promise<void> {
    await this.lineMessagingApiClientService.sendReplyMessages(
      event.replyToken,
      [
        {
          type: 'text',
          text: 'ขออภัยครับ รูปภาพที่ส่งมาไม่ใช่อาหาร กรุณาส่งรูปภาพอาหารเพื่อวิเคราะห์ครับ',
        }
      ]
    );
  }

  async sendMealDetailMessage(event: MessageEvent, detail: GeminiAnalyzeFoodImageResponse): Promise<void> {
    await this.lineMessagingApiClientService.sendReplyMessages(
      event.replyToken,
      MealDetailMessage(detail)
    );
  }
}