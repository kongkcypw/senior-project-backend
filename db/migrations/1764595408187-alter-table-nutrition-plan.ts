import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableNutritionPlan1764595408187 implements MigrationInterface {

    // Define the name for the foreign key constraint
    private NUTRITION_PLAN_FK = 'FK_nutrition_notification_time_nutrition_plan_id';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // REMOVE the foreign key and column from the nutrition_plan table
        await queryRunner.dropColumn('nutrition_plan', 'notification_schedule_id');

        // CREATE the new nutrition_notification_time table
        await queryRunner.createTable(
            new Table({
                name: 'nutrition_notification_time',
                columns: [
                    {
                        name: "id",
                        type: "serial",
                        isPrimary: true,
                        isNullable: false
                    },
                    {
                        name: 'nutrition_plan_id',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'send_at',
                        type: 'time',
                        isNullable: false,
                        // Example: '07:00:00'
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'NOW()',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'NOW()',
                    },
                ],
            }),
            true, // IfNotExist: false
        );

        // ADD the Foreign Key constraint to the new table
        await queryRunner.createForeignKey(
            'nutrition_notification_time',
            new TableForeignKey({
                columnNames: ['nutrition_plan_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'nutrition_plan',
                onDelete: 'CASCADE', // If the plan is deleted, remove the associated times
                name: this.NUTRITION_PLAN_FK,
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // DROP the new nutrition_notification_time table (which automatically handles its FK)
        await queryRunner.dropTable('nutrition_notification_time', true);

        // RE-ADD the column that was removed from the nutrition_plan table
        await queryRunner.addColumn('nutrition_plan', new TableColumn({
            name: 'notification_schedule_id',
            type: 'integer',
            isNullable: false,
        }));
    }
}