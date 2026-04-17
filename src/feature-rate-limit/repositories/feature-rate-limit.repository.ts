import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FeatureRateLimitEntity } from '../entities/feature-rate-limit.entity';

@Injectable()
export class FeatureRateLimitRepository extends Repository<FeatureRateLimitEntity> {
    constructor(private datasource: DataSource) {
        super(FeatureRateLimitEntity, datasource.createEntityManager());
    }

    async findByKey(key: string): Promise<FeatureRateLimitEntity | null> {
        return this.findOne({ where: { key } });
    }
}
