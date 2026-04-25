import { MessageEvent } from "@line/bot-sdk";

export interface IntentHandlerInterface {
    /**
     * Handles a Dialogflow intent.
     * @param event The LINE message event associated with the intent
     * @returns A promise that resolves when the intent has been handled
     */
    handleGroupChat?: (event: MessageEvent) => Promise<void>;
    handlePersonalChat?: (event: MessageEvent) => Promise<void>;
    handleGeneral?: (event: MessageEvent) => Promise<void>;
}