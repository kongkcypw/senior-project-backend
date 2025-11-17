import { Module } from "@nestjs/common";
import { DialogflowConfigService } from "./services/config.service";
import { DialogflowClientService } from "./services/client.service";

@Module({
    imports: [],
    providers: [DialogflowConfigService, DialogflowClientService],
    controllers: [],
    exports: [DialogflowConfigService, DialogflowClientService],
})

export class DialogflowModule {}