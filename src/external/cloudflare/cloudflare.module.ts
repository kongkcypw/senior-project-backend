import { Module } from "@nestjs/common";
import { CloudFlareR2Service } from "./services/cloudflare-r2.service";
import { CloudFlareConfigService } from "./services/config.service";
import { CloudflareR2Controller } from "./controllers/cloudflare-r2.controller";

@Module({
    imports: [],
    controllers: [CloudflareR2Controller],
    providers: [CloudFlareConfigService, CloudFlareR2Service],
    exports: [CloudFlareR2Service],
})

export class CloudflareModule {}