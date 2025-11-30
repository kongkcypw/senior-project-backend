import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BaseConfigService } from "src/common/config/base-config.service";

@Injectable()
export class LineLiffConfigService extends BaseConfigService<string> {

    constructor(private readonly configService: ConfigService) {
        super(configService);
    }

    get liffId(): string {
        return this.getAsString('LIFF_ID');
    }

    get liffNumericId(): string {
        return this.getAsString('LIFF_NUMERIC_ID');
    }
}