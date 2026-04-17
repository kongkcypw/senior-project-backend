import { MigrationInterface, QueryRunner, Table } from "typeorm";

const FEATURE_RATE_LIMIT_TABLE = 'feature_rate_limit';

export class CreateTableFeatureRateLimit1776407176342 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: FEATURE_RATE_LIMIT_TABLE,
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                { name: "key", type: "varchar", isNullable: false },
                { name: "description", type: "varchar", isNullable: true },
                { name: "usage_per_day", type: "int", default: "0", isNullable: false },
                { name: "max_per_day", type: "int", isNullable: false },
                { name: "last_reset_date", type: "date", default: "CURRENT_DATE", isNullable: false },
                { name: "created_at", type: "timestamp", default: "NOW()", isNullable: false },
                { name: "updated_at", type: "timestamp", default: "NOW()", isNullable: false },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(FEATURE_RATE_LIMIT_TABLE);
    }
}
