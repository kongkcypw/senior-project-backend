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
import { AnalyzeFoodPromptMessage } from '../messages/analyze-food-prompt.message';
import { GeminiAnalyzeFoodImageResponse } from 'src/external/gemini/types/gemini-analyze-food-image-response.type';
import { LineMessagingApiConfigService } from 'src/external/line-messaging-api/services/config.service';
import { NutritionPlanService } from 'src/nutrition/services/nutrition-plan.service';
import { LineGroupMemberService } from 'src/line-group/services/line-group-member.service';
import { LineLiffNavigatePathService } from 'src/external/line-liff/services/line-liff-navigate-path.service';

const ANALYZE_FOOD_TRIGGER = 'วิเคราะห์รูปอาหาร';

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
    private readonly lineGroupMemberService: LineGroupMemberService,
    private readonly nutritionPlanService: NutritionPlanService,
    private readonly lineLiffNavigatePathService: LineLiffNavigatePathService,
  ) {
  }

  async handle(event: MessageEvent): Promise<void> {
    console.log('Handling Message Event:', event);
    console.log('Message Event Type:', event.message.type);

    const isGroupChat = event.source.type === WebhookEventSourceType.GROUP;
    const isPersonalChat = event.source.type === WebhookEventSourceType.USER;
    console.log('Is Group Chat:', isGroupChat);
    console.log('Is Personal Chat:', isPersonalChat);

    if (event.message.type === WebhookEventMessageType.IMAGE) {
      await this.handleImageMessage(event);
      return;
    }

    if (isGroupChat) {
      await this.handleGroupChatTextMessage(event);
      return;
    }

    if (isPersonalChat) {
      await this.handlePersonalChatTextMessage(event);
      return;
    }
  }

  async handleGroupChatTextMessage(event: MessageEvent): Promise<void> {
    if (event.message.type !== WebhookEventMessageType.TEXT) {
      return;
    }

    const isGroupChat = true;
    let isBotMentioned = false;

    if (event.message.type === WebhookEventMessageType.TEXT && event.message.mention) {
      for (const mentionee of event.message.mention.mentionees) {
        console.log('Mentionee userId:', mentionee.userId);
        if (mentionee.userId === this.lineMessagingApiConfigService.chatbotUserId) {
          isBotMentioned = true;
          break;
        }
      }

      // Skip if bot is not mentioned
      if (!isBotMentioned) {
        return;
      }

      await this.dialogflowWebhookService.getFullfilmentTextAndReplyMessage(event, isGroupChat);
    }
  }

  async handlePersonalChatTextMessage(event: MessageEvent): Promise<void> {
    if (event.message.type !== WebhookEventMessageType.TEXT) {
      return;
    }

    if (event.message.text.trim() === ANALYZE_FOOD_TRIGGER) {
      await this.lineMessagingApiClientService.sendReplyMessages(
        event.replyToken,
        AnalyzeFoodPromptMessage(),
      );
      return;
    }

    const isGroupChat = false;
    await this.dialogflowWebhookService.getFullfilmentTextAndReplyMessage(event, isGroupChat);
  }

  async handleImageMessage(event: MessageEvent): Promise<void> {
    const isGroupChat = event.source.type === WebhookEventSourceType.GROUP;
    const isPersonalChat = event.source.type === WebhookEventSourceType.USER;

    if (!isGroupChat && !isPersonalChat) {
      return;
    }

    const userId = event.source.userId;
    const messageId = event.message.id;
    if (!userId) {
      return;
    }

    const messageContentResponse = await this.lineMessagingApiMessageContentService.getMessageContent(messageId);
    if (!messageContentResponse) {
      await this.sendErrorGetMessageContent(event);
      return;
    }
    const { buffer, contentType } = messageContentResponse;

    const fileExtension = contentType.split('/')[1] || 'jpeg';
    let fileKey: string;
    if (isGroupChat) {
      const groupId = (event.source as any).groupId as string;
      fileKey = `${R2UploadPathEnum.LINE_UPLOADS_FROM_GROUP}/${groupId}/${userId}/${messageId}.${fileExtension}`;
    } else {
      fileKey = `${R2UploadPathEnum.LINE_UPLOADS_FROM_PERSONAL}/${userId}/${messageId}.${fileExtension}`;
    }

    const publicUrl = await this.cloudFlareR2Service.uploadBuffer(fileKey, buffer, contentType);
    if (!publicUrl) {
      await this.sendErrorUploadToR2(event);
      return;
    }

    const analysisResult = await this.geminiService.analyzeFoodImage(buffer, contentType);
    if (!analysisResult) {
      await this.sendErrorAnalyzeImage(event);
      return;
    }
    if (analysisResult.data.is_food === false) {
      await this.sendNotFoodImageMessage(event);
      return;
    }

    // Resolve the trainee's lineUserId — direct for personal chat, via group member for group chat
    let lineUserId: string;
    if (isGroupChat) {
      const groupId = (event.source as any).groupId as string;
      const trainee = await this.lineGroupMemberService.findTraineeInGroup(groupId);
      if (!trainee) {
        return;
      }
      lineUserId = trainee.lineUserId;
    } else {
      lineUserId = userId;
    }

    const meal = await this.mealHistoryService.insertMealHistory({
      lineUserId,
      imageUrl: publicUrl,
      foodTitle: analysisResult.data.foodTitle,
      ingredients: analysisResult.data.ingredients,
      calories: analysisResult.data.nutritionFacts.calories,
      protein: analysisResult.data.nutritionFacts.protein,
      carbohydrate: analysisResult.data.nutritionFacts.carbohydrates,
      fat: analysisResult.data.nutritionFacts.fat,
    });

    const nutritionPlan = await this.nutritionPlanService.getNutritionPlanByLineUserId(lineUserId);
    const meals = await this.mealHistoryService.findMealsByDate(lineUserId, new Date());
    const totalCaloriesIntake = meals.reduce((total, m) => total + m.calories, 0);
    const remainingCalories = nutritionPlan
      ? nutritionPlan.totalCalories - totalCaloriesIntake
      : 0;

    const formatedDate = new Date().toLocaleString('th-TH', {
      timeZone: 'Asia/Bangkok',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: false,
    });

    const navigatePath = this.lineLiffNavigatePathService.getMealDetailPage(lineUserId, meal.id.toString());
    this.sendMealDetailMessage(event, analysisResult.data, remainingCalories, formatedDate, navigatePath);
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

  async sendMealDetailMessage(event: MessageEvent, detail: GeminiAnalyzeFoodImageResponse, remainingCalories: number, formatedDate: string, navigatePath: string): Promise<void> {
    await this.lineMessagingApiClientService.sendReplyMessages(
      event.replyToken,
      MealDetailMessage(detail, formatedDate, remainingCalories, navigatePath)
    );
  }
}