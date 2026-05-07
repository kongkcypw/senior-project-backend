import { MigrationInterface, QueryRunner } from "typeorm";

const FEATURE_FLAG_TABLE = 'feature_flag';

export class InsertFeatureFlagForPushMessage1778132144782 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO "${FEATURE_FLAG_TABLE}" ("key", "description", "is_enable") VALUES
            ('PUSH_MESSAGE_FOR_LIFF_ACTION', 'Enable push messages for LIFF actions', true),
            ('PUSH_MESSAGE_FOR_MEAL_NOTIFICATION', 'Enable push messages for meal notifications', true)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "${FEATURE_FLAG_TABLE}"
            WHERE "key" IN ('PUSH_MESSAGE_FOR_LIFF_ACTION', 'PUSH_MESSAGE_FOR_MEAL_NOTIFICATION')
        `);
    }

}
