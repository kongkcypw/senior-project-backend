import { Module } from "@nestjs/common";
import { LineWebhookModule } from "./line/line-webhook.module";

@Module({
    imports: [LineWebhookModule],
})
export class WebhookModule {}