import { MigrationInterface, QueryRunner, Table } from "typeorm";

const FEATURE_FLAG_TABLE = 'feature_flag';

export class CreateTableFeatureFlag1776399180160 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: FEATURE_FLAG_TABLE,
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                { name: "key", type: "varchar", isNullable: false },
                { name: "description", type: "varchar", isNullable: true },
                { name: "is_enable", type: "boolean", default: "false", isNullable: false },
                { name: "created_at", type: "timestamp", default: "NOW()", isNullable: false },
                { name: "updated_at", type: "timestamp", default: "NOW()", isNullable: false },
            ],
        }), true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(FEATURE_FLAG_TABLE);
    }
}
