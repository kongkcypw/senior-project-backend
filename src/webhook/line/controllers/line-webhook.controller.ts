import type { WebhookRequestBody } from "@line/bot-sdk";
import { Body, Controller, Headers, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LineWebhookService } from "../services/line-webhook.service";

@Controller('webhook/line')
export class LineWebhookController {
  constructor(
    private readonly lineWebhookService: LineWebhookService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  webhook(
    @Body() body: WebhookRequestBody,
    @Headers ('x-line-signature') lineSignature: string,
  ): Promise<void> {
    return this.lineWebhookService.handleWebhookEvent(body, lineSignature);
  }
}