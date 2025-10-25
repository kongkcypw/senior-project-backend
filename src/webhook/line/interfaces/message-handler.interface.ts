import { messagingApi } from '@line/bot-sdk';

/**
 * Context provided to message handlers.
 * Contains optional LINE user ID for user-specific operations.
 */
export interface MessageHandlerContext {
  /** Optional LINE user ID for user-specific operations */
  lineUserId?: string;
}

/**
 * Handler interface for processing LINE message events.
 * Returns an array of LINE messages in response to the received message.
 */
export interface MessageHandler {
  /**
   * Processes a message event and returns LINE messages.
   * @param context - Message event context
   * @returns Array of messages or promise resolving to messages
   */
  handle: (
    context: MessageHandlerContext,
  ) => messagingApi.Message[] | Promise<messagingApi.Message[]>;
}

/**
 * Configuration for a message handler.
 * Contains an array of actions that trigger the handler and the handler instance itself.
 */
export interface MessageHandlerConfig {
  /** Array of action strings that trigger this handler */
  actions: string[];
  /** Handler instance that processes the message event */
  handler: MessageHandler;
  /** Optional flag to require user authentication before handling */
  requireAuthentication?: boolean;
}