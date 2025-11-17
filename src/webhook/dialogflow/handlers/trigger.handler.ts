import { Injectable } from "@nestjs/common";
import { IntentHandlerInterface } from "../interfaces/intent-handler.interface";
import { Response } from "express";

@Injectable()
export class TriggerHandler implements IntentHandlerInterface {

    constructor(){}

    async handle(res: Response): Promise<Response> {

        const replyText = 'ขุนพันธ์มาแล้วครับ! มีอะไรให้ช่วยไหมครับ?';

        return res.json({
            fulfillmentText: replyText,
            fulfillmentMessages: [{
                text: { text: [replyText] }
            }]
        });
    }
}