import { Module } from "@nestjs/common";
import { LineLiffConfigService } from "./services/config.service";
import { LineLiffNavigatePathService } from "./services/line-liff-navigate-path.service";

@Module({
    imports: [],
    providers: [LineLiffConfigService, LineLiffNavigatePathService],
    exports: [LineLiffConfigService, LineLiffNavigatePathService],
})
export class LineLiffModule {}