import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

const WORKOUT_SCHEDULE_ITEM = 'workout_schedule_item';
const WORKOUT_PROGRAM_PLAN = 'workout_program_plan';
const WORKOUT_DAY_DEFINITION = 'workout_day_definition';

export class DropTableWorkoutScheduleItem1764727036695 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the table. Setting dropForeignKeys: true ensures 
        await queryRunner.dropTable(WORKOUT_SCHEDULE_ITEM, true, true, true);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Re-create the table and its foreign keys for the rollback (down) migration.
        await queryRunner.createTable(new Table({
            name: WORKOUT_SCHEDULE_ITEM,
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                { name: 'program_plan_id', type: 'int', isNullable: false },
                { name: 'workout_day_definition_id', type: 'int', isNullable: false },
                { name: 'schedule_type', type: 'varchar', isNullable: false },
                { name: 'frequency', type: 'int', default: 1, isNullable: false },
                { name: 'interval_value', type: 'int', isNullable: true },
                { name: 'day_of_week', type: 'int', isNullable: true },
                { name: 'preferred_time', type: 'time', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'NOW()' },
                { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
            ],
        }), true);

        // Add Foreign Key for program_plan_id
        await queryRunner.createForeignKey(WORKOUT_SCHEDULE_ITEM, new TableForeignKey({
            columnNames: ['program_plan_id'],
            referencedColumnNames: ['id'],
            referencedTableName: WORKOUT_PROGRAM_PLAN,
            onDelete: 'CASCADE',
        }));

        // Add Foreign Key for workout_day_definition_id
        await queryRunner.createForeignKey(WORKOUT_SCHEDULE_ITEM, new TableForeignKey({
            columnNames: ['workout_day_definition_id'],
            referencedColumnNames: ['id'],
            referencedTableName: WORKOUT_DAY_DEFINITION,
            onDelete: 'CASCADE',
        }));
    }

}