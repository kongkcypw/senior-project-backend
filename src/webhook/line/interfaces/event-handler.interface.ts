import { WebhookEvent } from '@line/bot-sdk';

/**
 * Interface for handling LINE webhook events.
 * Generic type T extends WebhookEvent to ensure type safety.
 */
export interface EventHandler<T extends WebhookEvent> {
    /**   
    Handles a LINE webhook event.
    @param event - The LINE webhook event to handle
    @returns A promise that resolves when the event is handled
    */
    handle: (event: T) => Promise<void>;
}