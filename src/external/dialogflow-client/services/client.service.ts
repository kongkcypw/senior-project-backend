import { SessionsClient } from "@google-cloud/dialogflow";
import { Injectable } from "@nestjs/common";
import { DialogflowConfigService } from "./config.service";
import { LineMessagingApiClientService } from "src/external/line-messaging-api/services/client.service";
import { MessageEvent } from "@line/bot-sdk";

@Injectable()
export class DialogflowClientService {
  constructor(
      private readonly dialogflowConfigService: DialogflowConfigService,
  ) {}

  createSessionsClient(): SessionsClient {
      const client = new SessionsClient({
          projectId: this.dialogflowConfigService.projectId,
          credentials: {
              client_email: this.dialogflowConfigService.clientEmail,
              private_key: this.dialogflowConfigService.privateKey,
          },
      });
      return client;
  }
}