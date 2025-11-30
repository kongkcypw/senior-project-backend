import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

export class CreateTableUserPhysiqueHistory1764527978378 implements MigrationInterface {

    private readonly tableName = 'user_physique_history';
    private readonly userTableName = 'user';
    private readonly fkName = 'FK_user_physique_history_line_user_id';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create the table
        await queryRunner.createTable(
            new Table({
                name: this.tableName,
                columns: [
                    {
                        name: "id",
                        type: "serial",
                        isPrimary: true,
                        isNullable: false
                    },
                    {
                        name: 'line_user_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'age',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'height_cm',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'weight_kg',
                        type: 'float',
                        isNullable: false,
                    },
                    {
                        name: 'body_fat_percentage',
                        type: 'float',
                        isNullable: true,
                        default: 'NULL',
                    },
                    {
                        name: 'goal',
                        type: 'varchar',
                        length: '255',
                        isNullable: true,
                        default: 'NULL',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'NOW()',
                        isNullable: false,
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'NOW()',
                        onUpdate: 'NOW()',
                        isNullable: false,
                    },
                ],
            }),
            true, // Use 'if not exists'
        );

        // Add the Foreign Key constraint
        await queryRunner.createForeignKey(
            this.tableName,
            new TableForeignKey({
                columnNames: ['line_user_id'],
                referencedColumnNames: ['line_user_id'], 
                referencedTableName: this.userTableName,
                name: this.fkName,
                onDelete: 'CASCADE', 
            }),
        );
    }

    // ---

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop the Foreign Key
        await queryRunner.dropForeignKey(this.tableName, this.fkName);

        // Drop the Table
        await queryRunner.dropTable(this.tableName);
    }
}