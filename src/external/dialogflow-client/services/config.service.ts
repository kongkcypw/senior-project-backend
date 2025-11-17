import { BaseConfigService } from "src/common/config/base-config.service";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";

@Injectable()
export class DialogflowConfigService extends BaseConfigService<string> {
    constructor(private readonly configService: ConfigService) {
        super(configService);
    }

    get projectId(): string {
        return this.getAsString('GOOGLE_CLOUD_PROJECT_ID');
    }

    get clientEmail(): string {
        return this.getAsString('GOOGLE_CLOUD_CLIENT_EMAIL');
    }

    get privateKey(): string {
        return this.getAsString('GOOGLE_CLOUD_PRIVATE_KEY').replace(/\\n/g, '\n');
    }

    get agentId(): string {
        return this.getAsString('DIALOGFLOW_AGENT_ID');
    }
}