import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseConfigService } from "src/common/config/base-config.service";

@Injectable()
export class CloudFlareConfigService extends BaseConfigService<string> {
    constructor(private readonly configService: ConfigService) {
        super(configService);
    }

    get nodeEnv(): string {
        return this.getAsString('NODE_ENV');
    }

    get accountId(): string {
        return this.getAsString('CLOUDFLARE_R2_ACCOUNT_ID');
    }

    get accessKeyId(): string {
        return this.getAsString('CLOUDFLARE_R2_ACCESS_KEY_ID');
    }

    get secretAccessKey(): string {
        return this.getAsString('CLOUDFLARE_R2_SECRET_ACCESS_KEY');
    }

    get bucketName(): string {
        return this.getAsString('CLOUDFLARE_R2_BUCKET_NAME');
    }

    get endpoint(): string {
        return this.getAsString('CLOUDFLARE_R2_ENDPOINT');
    }

    get customDomain(): string {
        return this.getAsString('CLOUDFLARE_R2_CUSTOM_DOMAIN');
    }
}