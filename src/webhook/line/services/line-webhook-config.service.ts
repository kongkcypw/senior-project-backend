import { BaseConfigService } from "src/common/config/base-config.service";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class LineWebhookConfigService extends BaseConfigService<string> {
    constructor(private readonly configService: ConfigService) {
        super(configService);
    }

    get channelSecret(): string {
        return this.getAsString('LINE_CHANNEL_SECRET');
    }

    get channelAccessToken(): string {
        return this.getAsString('LINE_CHANNEL_ACCESS_TOKEN');
    }
}