import { MigrationInterface, QueryRunner } from "typeorm";

const FEATURE_FLAG_TABLE = 'feature_flag';

export class InsertFeatureFlag1776399750661 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "${FEATURE_FLAG_TABLE}" ("key", "description", "is_enable") VALUES
            ('RAG-LLM-SERVICE', 'Enable this to call the RAG LLM Service', false),
            ('VECTOR_EMBEDDING', 'Enable this to use vector embedding', false)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "${FEATURE_FLAG_TABLE}"
            WHERE "key" IN ('RAG-LLM-SERVICE', 'VECTOR_EMBEDDING')
        `);
    }

}
