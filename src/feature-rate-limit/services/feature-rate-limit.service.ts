import { Injectable } from '@nestjs/common';
import { FeatureRateLimitRepository } from '../repositories/feature-rate-limit.repository';
import { FeatureRateLimitKey } from '../enums/feature-rate-limit.enum';

@Injectable()
export class FeatureRateLimitService {
    constructor(private readonly featureRateLimitRepository: FeatureRateLimitRepository) {}

    /*** Checks if the rate limit for a given feature has been reached 
     * - If no record exists for the key, it treats it as if the limit has been reached (i.e., feature is unavailable).
     * - If the last reset date is before today, it resets the usage count and allows access.
     * ***/
    async isLimitReached(key: FeatureRateLimitKey): Promise<boolean> {
        const record = await this.featureRateLimitRepository.findByKey(key);
        if (!record) return true;

        const today = new Date().toISOString().split('T')[0];
        const lastReset = new Date(record.lastResetDate).toISOString().split('T')[0];

        if (lastReset < today) {
            record.usagePerDay = 0;
            record.lastResetDate = new Date();
            await this.featureRateLimitRepository.save(record);
            return false;
        }

        return record.usagePerDay >= record.maxPerDay;
    }

    async incrementUsage(key: FeatureRateLimitKey, count: number = 1): Promise<void> {
        const record = await this.featureRateLimitRepository.findByKey(key);
        if (!record) return;

        const today = new Date().toISOString().split('T')[0];
        const lastReset = new Date(record.lastResetDate).toISOString().split('T')[0];

        if (lastReset < today) {
            record.usagePerDay = count;
            record.lastResetDate = new Date();
        } else {
            record.usagePerDay += count;
        }

        await this.featureRateLimitRepository.save(record);
    }
}
