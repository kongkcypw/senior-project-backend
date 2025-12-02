import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTablesForWorkoutsProgramPlan1764655833631 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. workout_program_plan (Program Definition/Template)
        await queryRunner.createTable(new Table({
            name: 'workout_program_plan',
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                { name: 'name', type: 'varchar', isNullable: false },
                { name: 'line_user_id_trainee', type: 'varchar', isNullable: true }, // Nullable for templates
                { name: 'line_user_id_trainer', type: 'varchar', isNullable: false },
                { name: 'notes', type: 'text', isNullable: true },
                { name: 'is_active', type: 'boolean', default: true, isNullable: false },
                { name: 'start_date', type: 'date', isNullable: true },
                { name: 'end_date', type: 'date', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'NOW()' },
                { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
            ],
        }), true);

        // Foreign Keys for workout_program_plan (Trainer & Trainee)
        await queryRunner.createForeignKey('workout_program_plan', new TableForeignKey({
            columnNames: ['line_user_id_trainee'],
            referencedColumnNames: ['line_user_id'],
            referencedTableName: 'user',
            onDelete: 'RESTRICT',
        }));
        await queryRunner.createForeignKey('workout_program_plan', new TableForeignKey({
            columnNames: ['line_user_id_trainer'],
            referencedColumnNames: ['line_user_id'],
            referencedTableName: 'user',
            onDelete: 'RESTRICT',
        }));

        // 2. workout_day_definition (What is the workout day?)
        await queryRunner.createTable(new Table({
            name: 'workout_day_definition',
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                { name: 'program_plan_id', type: 'int', isNullable: false },
                { name: 'day_name', type: 'varchar', isNullable: false },
                { name: 'notes', type: 'text', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'NOW()' },
                { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
            ],
        }), true);

        // Foreign Key for workout_day_definition
        await queryRunner.createForeignKey('workout_day_definition', new TableForeignKey({
            columnNames: ['program_plan_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workout_program_plan',
            onDelete: 'CASCADE',
        }));

        // 3. workout_exercise_detail (Specifics of the exercises)
        await queryRunner.createTable(new Table({
            name: 'workout_exercise_detail',
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                { name: 'workout_day_definition_id', type: 'int', isNullable: false },
                { name: 'exercise_name', type: 'varchar', isNullable: false },
                { name: 'reps', type: 'varchar', isNullable: false },
                { name: 'sets', type: 'int', isNullable: false },
                { name: 'prescribed_weight_kg', type: 'real', isNullable: true },
                { name: 'rest_time_seconds', type: 'int', isNullable: true },
                { name: 'image_url', type: 'varchar', isNullable: true },
                { name: 'order_in_day', type: 'int', isNullable: false },
                { name: 'created_at', type: 'timestamp', default: 'NOW()' },
                { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
            ],
        }), true);

        // Foreign Key for workout_exercise_detail
        await queryRunner.createForeignKey('workout_exercise_detail', new TableForeignKey({
            columnNames: ['workout_day_definition_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workout_day_definition',
            onDelete: 'CASCADE',
        }));

        // 4. workout_schedule_item (When to perform the workout)
        await queryRunner.createTable(new Table({
            name: 'workout_schedule_item',
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

        // Foreign Keys for workout_schedule_item
        await queryRunner.createForeignKey('workout_schedule_item', new TableForeignKey({
            columnNames: ['program_plan_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workout_program_plan',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('workout_schedule_item', new TableForeignKey({
            columnNames: ['workout_day_definition_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workout_day_definition',
            onDelete: 'CASCADE',
        }));

        // 5. workout_history (Trainee Log)
        await queryRunner.createTable(new Table({
            name: 'workout_history',
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                { name: 'line_user_id', type: 'varchar', isNullable: false },
                { name: 'workout_day_definition_id', type: 'int', isNullable: false },
                { name: 'performed_at', type: 'timestamp', isNullable: false },
                { name: 'set_number', type: 'int', isNullable: false },
                { name: 'actual_reps', type: 'int', isNullable: false },
                { name: 'actual_weight_kg', type: 'real', isNullable: false },
                { name: 'notes', type: 'varchar', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'NOW()' },
                { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
            ],
        }), true);

        // Foreign Keys for workout_history
        await queryRunner.createForeignKey('workout_history', new TableForeignKey({
            columnNames: ['line_user_id'],
            referencedColumnNames: ['line_user_id'],
            referencedTableName: 'user',
            onDelete: 'CASCADE',
        }));
        await queryRunner.createForeignKey('workout_history', new TableForeignKey({
            columnNames: ['workout_day_definition_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workout_day_definition',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order to avoid foreign key constraints issues
        await queryRunner.dropTable('workout_history');
        await queryRunner.dropTable('workout_schedule_item');
        await queryRunner.dropTable('workout_exercise_detail');
        await queryRunner.dropTable('workout_day_definition');
        await queryRunner.dropTable('workout_program_plan');
    }

}