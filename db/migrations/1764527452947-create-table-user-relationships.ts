import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableUserRelationships1764527452947 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user_relationships',
                columns: [
                    {   name: "id", 
                        type: "serial", 
                        isPrimary: true, 
                        isNullable: false 
                    },
                    {
                        name: 'trainee_line_user_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'trainer_line_user_id',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'assigned_at',
                        type: 'timestamp',
                        default: 'NOW()',
                        isNullable: false,
                    },
                    {
                        name: 'unassigned_at',
                        type: 'timestamp',
                        isNullable: true,
                        default: 'NULL',
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                        isNullable: false,
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
            true, // Add `true` to indicate that `if not exists` should be used (optional)
        );

        await queryRunner.createForeignKey(
            'user_relationships',
            new TableForeignKey({
                columnNames: ['trainee_line_user_id'],
                referencedColumnNames: ['line_user_id'],
                referencedTableName: 'user',
                name: 'FK_trainee_line_user_id',
                onDelete: 'RESTRICT',
            }),
        );

        await queryRunner.createForeignKey(
            'user_relationships',
            new TableForeignKey({
                columnNames: ['trainer_line_user_id'],
                referencedColumnNames: ['line_user_id'],
                referencedTableName: 'user',
                name: 'FK_trainer_line_user_id',
                onDelete: 'RESTRICT',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop Foreign Key for Trainer
        await queryRunner.dropForeignKey(
            'user_relationships',
            'FK_trainer_line_user_id',
        );

        // Drop Foreign Key for Trainee
        await queryRunner.dropForeignKey(
            'user_relationships',
            'FK_trainee_line_user_id',
        );

        // Drop the table
        await queryRunner.dropTable('user_relationships');
    }
}