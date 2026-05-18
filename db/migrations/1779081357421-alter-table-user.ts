import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableUser1779081357421 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            ADD COLUMN IF NOT EXISTS has_seen_onboarding BOOLEAN NOT NULL DEFAULT FALSE
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user"
            DROP COLUMN IF EXISTS has_seen_onboarding
        `);
    }

}
