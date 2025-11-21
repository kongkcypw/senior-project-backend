import { MessageEvent } from "@line/bot-sdk";

export interface IntentHandlerInterface {
    /**
     * Handles a Dialogflow intent.
     * @param event The LINE message event associated with the intent
     * @returns A promise that resolves when the intent has been handled
     */
    handle: (event: MessageEvent) => Promise<void>;
}