import { BaseConfigService } from "src/common/config/base-config.service";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RagApiConfigService extends BaseConfigService<string> {
    constructor(private readonly configService: ConfigService) {
        super(configService);
    }

    get ragApiUrl(): string {
        return this.getAsString('RAG_API_URL');
    }
}