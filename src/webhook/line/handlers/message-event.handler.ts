import { MessageEvent, messagingApi } from '@line/bot-sdk';
import { Injectable } from '@nestjs/common';
import {
  MessageHandler,
  MessageHandlerConfig,
  MessageHandlerContext,
} from '../../line/interfaces/message-handler.interface';
import { EventHandler } from '../interfaces/event-handler.interface';
import { LineMessagingApiClientService } from '../services/line-messaging-api-client.service';
import { LINE_ERROR_MESSAGES } from '../constants/error-messages.constant';
import { CaloriesHandler } from './calories.handlers';

@Injectable()
export class MessageEventHandler implements EventHandler<MessageEvent> {
  private readonly handlerMap = new Map<string, MessageHandlerConfig>();

  constructor(
    private readonly lineMessagingApiClientService: LineMessagingApiClientService,
    private readonly caloriesHandler: CaloriesHandler,
  ) {
    this.initializeHandlers();
  }

  async handle(event: MessageEvent): Promise<void> {
    console.log('Handling Message Event:', event);
    const messages = await this.createReplyMessages(event);
    console.log('Reply Messages:', messages);
    if (messages.length > 0) {
      await this.lineMessagingApiClientService.sendReplyMessages(
        event.replyToken,
        messages,
      );
    }
  }

  initializeHandlers(): void {
    // Define the message handler configurations
    const handlerConfigs: MessageHandlerConfig[] = [
      {
        actions: ['แคลอรี่ในวันนี้'],
        handler: this.caloriesHandler,
        requireAuthentication: false,
      },
    ];

    this.registerHandlers(handlerConfigs);
  }

  /** Mark as public for unit testing only. */
  registerHandlers(handlerConfigs: MessageHandlerConfig[]): void {
    for (const handlerConfig of handlerConfigs) {
      for (const action of handlerConfig.actions) {
        const normalizedAction = this.normalizeAction(action);

        if (this.handlerMap.has(normalizedAction)) {
          throw new Error(
            `Handler for action "${normalizedAction}" is already registered`,
          );
        }

        this.handlerMap.set(normalizedAction, handlerConfig);
      }
    }
  }

  /** Mark as public for unit testing only. */
  async createReplyMessages(
    event: MessageEvent,
  ): Promise<messagingApi.Message[]> {
    if (event.message.type !== 'text') {
      return [];
    }

    const handlerConfig = this.findHandlerConfig(event.message.text);

    if (!handlerConfig) {
      return [];
    }

    // Execute authentication check if required
    // const isAuthenticated = await this.validateAuthentication(
    //   handlerConfig,
    //   event.source.userId,
    // );

    // if (!isAuthenticated) {
    //   return this.createAuthenticationErrorMessage();
    // }

    return await this.executeHandler(handlerConfig.handler, {
      lineUserId: event.source.userId,
    });
  }

  /** Mark as public for unit testing only. */
  async validateAuthentication(
    handlerConfig: MessageHandlerConfig,
    lineUid?: string,
  ): Promise<boolean> {
    if (!handlerConfig.requireAuthentication) {
      return true;
    }

    if (!lineUid) {
      return false;
    }

    // TODO: Implement actual customer lookup logic
    // const customer = await this.customersService.findActiveCustomerByLineUid(
    //   lineUid,
    // );

    // return !!customer;
    return true;
  }

  /** Mark as public for unit testing only. */
  async executeHandler(
    handler: MessageHandler,
    context: MessageHandlerContext,
  ): Promise<messagingApi.Message[]> {
    try {
      return await handler.handle(context);
    } catch (error) {
        console.error('Error executing message handler:', error);

      return this.createInternalServerErrorMessage();
    }
  }

  /** Mark as public for unit testing only. */
  normalizeAction(action: string): string {
    return action.toLowerCase();
  }

  /** Mark as public for unit testing only. */
  findHandlerConfig(action: string): MessageHandlerConfig | undefined {
    const normalizeAction = this.normalizeAction(action);

    return this.handlerMap.get(normalizeAction);
  }

  private createInternalServerErrorMessage(): messagingApi.Message[] {
    return [
      {
        type: 'text',
        text: LINE_ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
      },
    ];
  }
}
