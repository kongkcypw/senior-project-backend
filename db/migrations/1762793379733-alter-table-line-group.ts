import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableLineGroup1762793379733 implements MigrationInterface {

    private readonly tableName = "line_group";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            this.tableName,
            new TableColumn({
            name: "join_group_at",
            type: "timestamp",
            isNullable: false,
            })
        );
        await queryRunner.addColumn(
            this.tableName,
            new TableColumn({
            name: "leave_group_at",
            type: "timestamp",
            isNullable: true,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn(this.tableName, "join_group_at");
        await queryRunner.dropColumn(this.tableName, "leave_group_at");
    }

}
