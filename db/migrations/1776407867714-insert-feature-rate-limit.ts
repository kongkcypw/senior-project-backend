import { MigrationInterface, QueryRunner } from "typeorm";

const FEATURE_RATE_LIMIT_TABLE = 'feature_rate_limit';

export class InsertFeatureRateLimit1776407867714 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "${FEATURE_RATE_LIMIT_TABLE}" ("key", "description", "max_per_day") VALUES
            ('RAG-LLM-SERVICE', 'Limit for Gemini API', 1000)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "${FEATURE_RATE_LIMIT_TABLE}"
            WHERE "key" IN ('RAG-LLM-SERVICE')
        `);
    }

}
