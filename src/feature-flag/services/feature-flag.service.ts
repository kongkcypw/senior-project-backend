import { Injectable } from '@nestjs/common';
import { FeatureFlagRepository } from '../repositories/feature-flag.repository';
import { FeatureFlagKey } from '../enums/feature-flag.constant';

@Injectable()
export class FeatureFlagService {
    constructor(private readonly featureFlagRepository: FeatureFlagRepository) {}

    async isEnabled(key: FeatureFlagKey): Promise<boolean> {
        const flag = await this.featureFlagRepository.findByKey(key);
        return flag?.isEnable ?? false;
    }
}
