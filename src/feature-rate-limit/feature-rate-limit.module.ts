import { Module } from '@nestjs/common';
import { FeatureRateLimitRepository } from './repositories/feature-rate-limit.repository';
import { FeatureRateLimitService } from './services/feature-rate-limit.service';

@Module({
    imports: [],
    providers: [FeatureRateLimitRepository, FeatureRateLimitService],
    controllers: [],
    exports: [FeatureRateLimitService],
})
export class FeatureRateLimitModule {}
