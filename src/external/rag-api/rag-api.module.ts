import { Module } from "@nestjs/common";
import { RagApiConfigService } from "./services/config.service";
import { HttpModule } from "@nestjs/axios";
import { RagAgentService } from "./services/rag-agent.service";

@Module({
    imports: [HttpModule],
    providers: [
        RagApiConfigService,
        RagAgentService,
    ],
    exports: [
        RagApiConfigService,
        RagAgentService,
    ],
})
export class RagApiModule { }