import { MigrationInterface, QueryRunner, Table, TableColumn } from "typeorm";

export class AlterTableWorkoutExerciseTemplate1776677754902 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns('workout_exercise_template', [
            'routine_template_id',
            'order_in_routine',
            'rest_time_second',
        ]);

        await queryRunner.dropTable('workout_routine_template');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'workout_routine_template',
            columns: [
                { name: 'id',          type: 'serial',    isPrimary: true },
                { name: 'name',        type: 'varchar',   isNullable: false },
                { name: 'description', type: 'text',      isNullable: true },
                { name: 'tag',         type: 'varchar',   isNullable: true },
                { name: 'image_url',   type: 'varchar',   isNullable: true },
                { name: 'created_at',  type: 'timestamp', isNullable: false, default: 'now()' },
                { name: 'updated_at',  type: 'timestamp', isNullable: false, default: 'now()' },
            ],
        }));

        await queryRunner.addColumns('workout_exercise_template', [
            new TableColumn({ name: 'routine_template_id', type: 'integer', isNullable: true }),
            new TableColumn({ name: 'order_in_routine',    type: 'integer', isNullable: true }),
            new TableColumn({ name: 'rest_time_second',    type: 'integer', isNullable: true }),
        ]);
    }

}
