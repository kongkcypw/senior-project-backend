import { Module } from '@nestjs/common';
import { FeatureFlagRepository } from './repositories/feature-flag.repository';
import { FeatureFlagService } from './services/feature-flag.service';

@Module({
    imports: [],
    providers: [FeatureFlagRepository, FeatureFlagService],
    controllers: [],
    exports: [FeatureFlagService],
})
export class FeatureFlagModule {}
