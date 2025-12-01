import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class DropTableNotificationSchedule1764596032947 implements MigrationInterface {

    private readonly TABLE_NAME = 'notification_schedule';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.TABLE_NAME, true, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(
            new Table({
                name: this.TABLE_NAME,
                columns: [
                    { name: "id", type: "serial", isPrimary: true, isNullable: false },
                    { name: "type", type: "varchar", isNullable: false },
                    { name: "send_interval", type: "varchar", isNullable: false },
                    { name: "send_at", type: "time", isNullable: false },
                    { name: "created_at", type: "timestamp", isNullable: false, default: "now()" },
                    { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
                ],
            }),
            true
        );
    }
}