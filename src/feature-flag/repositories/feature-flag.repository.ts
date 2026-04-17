import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { FeatureFlagEntity } from '../entities/feature-flag.entity';

@Injectable()
export class FeatureFlagRepository extends Repository<FeatureFlagEntity> {
    constructor(private datasource: DataSource) {
        super(FeatureFlagEntity, datasource.createEntityManager());
    }

    async findByKey(key: string): Promise<FeatureFlagEntity | null> {
        return this.findOne({ where: { key } });
    }
}
