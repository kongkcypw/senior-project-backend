import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTableNotificationSchedule1763279841310 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Change send_at from timestamp → time
        await queryRunner.query(`
            ALTER TABLE notification_schedule
            ALTER COLUMN send_at TYPE time
            USING send_at::time;
        `);

        // 2. Drop is_active column
        await queryRunner.query(`
            ALTER TABLE notification_schedule
            DROP COLUMN is_active;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Reverse migration

        // 1. Re-add is_active column (default true or false — choose one)
        await queryRunner.query(`
            ALTER TABLE notification_schedule
            ADD COLUMN is_active boolean NOT NULL DEFAULT true;
        `);

        // 2. Recreate send_at as timestamp
        // Since table has no rows, we safely drop + re-add
        await queryRunner.query(`
            ALTER TABLE notification_schedule
            DROP COLUMN send_at;
        `);

        await queryRunner.query(`
            ALTER TABLE notification_schedule
            ADD COLUMN send_at timestamp NOT NULL DEFAULT now();
        `);
    }
}
