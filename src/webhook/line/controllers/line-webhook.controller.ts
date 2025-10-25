import type { WebhookRequestBody } from "@line/bot-sdk";
import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LineMessagingService } from "../services/line-messaging.service";

@Controller('webhook/line')
export class LineWebhookController {
  constructor(
    private readonly lineMessagingService: LineMessagingService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  webhook(
    @Body() body: WebhookRequestBody,
    @Headers ('x-line-signature') lineSignature: string,
  ): Promise<void> {
    return this.lineMessagingService.handleWebhookEvent(body, lineSignature);
  }
}