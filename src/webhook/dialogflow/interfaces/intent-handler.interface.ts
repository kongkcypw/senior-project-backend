import { Response } from "express";

export interface IntentHandlerInterface {
    /**
     * Handles a Dialogflow intent.
     * @returns A promise that resolves when the intent is handled
     */
    handle: (res: Response) => Promise<Response>;
}