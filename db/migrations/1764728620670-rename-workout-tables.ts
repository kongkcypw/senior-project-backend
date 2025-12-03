import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

// Define constants for tables (New names)
const WORKOUT_PROGRAM = 'workout_program';
const WORKOUT_ROUTINE = 'workout_routine';
const WORKOUT_EXERCISE = 'workout_exercise';
const WORKOUT_HISTORY = 'workout_history';
const USER = 'user';

export class RenameWorkoutTables1764728620670 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // --- 1. Identify and Drop Foreign Keys Before Renaming Columns/Tables ---

        // FKs on workout_program (was workout_program_plan)
        const programTable = await queryRunner.getTable('workout_program_plan');
        if (programTable) {
            for (const fk of programTable.foreignKeys) {
                await queryRunner.dropForeignKey('workout_program_plan', fk);
            }
        }

        // FKs on workout_routine (was workout_day_definition)
        const routineTable = await queryRunner.getTable('workout_day_definition');
        if (routineTable) {
            for (const fk of routineTable.foreignKeys) {
                await queryRunner.dropForeignKey('workout_day_definition', fk);
            }
        }

        // FKs on workout_exercise (was workout_exercise_detail)
        const exerciseTable = await queryRunner.getTable('workout_exercise_detail');
        if (exerciseTable) {
            for (const fk of exerciseTable.foreignKeys) {
                await queryRunner.dropForeignKey('workout_exercise_detail', fk);
            }
        }

        // FKs on workout_history
        const historyTable = await queryRunner.getTable(WORKOUT_HISTORY);
        if (historyTable) {
            for (const fk of historyTable.foreignKeys) {
                await queryRunner.dropForeignKey(WORKOUT_HISTORY, fk);
            }
        }

        // --- 2. Rename Tables (using old names) ---
        await queryRunner.renameTable('workout_program_plan', WORKOUT_PROGRAM);
        await queryRunner.renameTable('workout_day_definition', WORKOUT_ROUTINE);
        await queryRunner.renameTable('workout_exercise_detail', WORKOUT_EXERCISE);

        // --- 3. Rename and Add Columns (using new table names) ---

        // Changes to workout_program 
        await queryRunner.addColumn(WORKOUT_PROGRAM, new TableColumn({
            name: 'order_in_program', type: 'int', default: 1, isNullable: false,
        }));

        // Changes to workout_routine 
        await queryRunner.renameColumn(WORKOUT_ROUTINE, 'day_name', 'name');
        await queryRunner.renameColumn(WORKOUT_ROUTINE, 'program_plan_id', 'program_id'); // FK reference column
        await queryRunner.addColumn(WORKOUT_ROUTINE, new TableColumn({
            name: 'order_in_program', type: 'int', default: 1, isNullable: false,
        }));

        // Changes to workout_exercise 
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'exercise_name', 'name');
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'order_in_day', 'order_in_routine');
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'workout_day_definition_id', 'routine_id'); // FK reference column
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'sets', 'set');
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'rest_time_seconds', 'rest_time_second');
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'reps', 'rep');

        // Changes to workout_history 
        await queryRunner.renameColumn(WORKOUT_HISTORY, 'workout_day_definition_id', 'routine_id'); // FK reference column

        // --- 4. Re-create Foreign Keys with New, Consistent Names ---

        // workout_program FKs
        await queryRunner.createForeignKey(WORKOUT_PROGRAM, new TableForeignKey({
            columnNames: ['line_user_id_trainee'],
            referencedColumnNames: ['line_user_id'],
            referencedTableName: USER,
            onDelete: 'RESTRICT',
            name: 'FK_program_trainee_user'
        }));
        await queryRunner.createForeignKey(WORKOUT_PROGRAM, new TableForeignKey({
            columnNames: ['line_user_id_trainer'],
            referencedColumnNames: ['line_user_id'],
            referencedTableName: USER,
            onDelete: 'RESTRICT',
            name: 'FK_program_trainer_user'
        }));

        // workout_routine FKs
        await queryRunner.createForeignKey(WORKOUT_ROUTINE, new TableForeignKey({
            columnNames: ['program_id'],
            referencedColumnNames: ['id'],
            referencedTableName: WORKOUT_PROGRAM,
            onDelete: 'CASCADE',
            name: 'FK_routine_program'
        }));

        // workout_exercise FKs
        await queryRunner.createForeignKey(WORKOUT_EXERCISE, new TableForeignKey({
            columnNames: ['routine_id'],
            referencedColumnNames: ['id'],
            referencedTableName: WORKOUT_ROUTINE,
            onDelete: 'CASCADE',
            name: 'FK_exercise_routine'
        }));

        // workout_history FKs
        await queryRunner.createForeignKey(WORKOUT_HISTORY, new TableForeignKey({
            columnNames: ['line_user_id'],
            referencedColumnNames: ['line_user_id'],
            referencedTableName: USER,
            onDelete: 'CASCADE',
            name: 'FK_history_user'
        }));
        await queryRunner.createForeignKey(WORKOUT_HISTORY, new TableForeignKey({
            columnNames: ['routine_id'],
            referencedColumnNames: ['id'],
            referencedTableName: WORKOUT_ROUTINE,
            onDelete: 'CASCADE',
            name: 'FK_history_routine'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // --- 1. Identify and Drop Foreign Keys (using new names) ---
        await queryRunner.dropForeignKey(WORKOUT_PROGRAM, 'FK_program_trainee_user');
        await queryRunner.dropForeignKey(WORKOUT_PROGRAM, 'FK_program_trainer_user');
        await queryRunner.dropForeignKey(WORKOUT_ROUTINE, 'FK_routine_program');
        await queryRunner.dropForeignKey(WORKOUT_EXERCISE, 'FK_exercise_routine');
        await queryRunner.dropForeignKey(WORKOUT_HISTORY, 'FK_history_user');
        await queryRunner.dropForeignKey(WORKOUT_HISTORY, 'FK_history_routine');


        // --- 2. Reverse Column Renames and Drops ---

        // Reverse workout_history changes
        await queryRunner.renameColumn(WORKOUT_HISTORY, 'routine_id', 'workout_day_definition_id');

        // Reverse workout_exercise changes
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'rep', 'reps');
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'rest_time_second', 'rest_time_seconds');
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'set', 'sets');
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'routine_id', 'workout_day_definition_id');
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'order_in_routine', 'order_in_day');
        await queryRunner.renameColumn(WORKOUT_EXERCISE, 'name', 'exercise_name');

        // Reverse workout_routine changes
        await queryRunner.dropColumn(WORKOUT_ROUTINE, 'order_in_program');
        await queryRunner.renameColumn(WORKOUT_ROUTINE, 'program_id', 'program_plan_id');
        await queryRunner.renameColumn(WORKOUT_ROUTINE, 'name', 'day_name');

        // Reverse workout_program changes
        await queryRunner.dropColumn(WORKOUT_PROGRAM, 'order_in_program');

        // --- 3. Reverse Table Renames ---
        await queryRunner.renameTable(WORKOUT_EXERCISE, 'workout_exercise_detail');
        await queryRunner.renameTable(WORKOUT_ROUTINE, 'workout_day_definition');
        await queryRunner.renameTable(WORKOUT_PROGRAM, 'workout_program_plan');


        // --- 4. Re-create Foreign Keys with Original, Unnamed Constraints ---

        // This relies on the original migration's structure. Since the original FKs 
        // were created without names, we must drop and re-create them without names in `down`.

        // FKs on workout_program_plan (now exists again)
        await queryRunner.createForeignKey('workout_program_plan', new TableForeignKey({
            columnNames: ['line_user_id_trainee'], referencedColumnNames: ['line_user_id'], referencedTableName: USER, onDelete: 'RESTRICT',
        }));
        await queryRunner.createForeignKey('workout_program_plan', new TableForeignKey({
            columnNames: ['line_user_id_trainer'], referencedColumnNames: ['line_user_id'], referencedTableName: USER, onDelete: 'RESTRICT',
        }));

        // FKs on workout_day_definition (now exists again)
        await queryRunner.createForeignKey('workout_day_definition', new TableForeignKey({
            columnNames: ['program_plan_id'], referencedColumnNames: ['id'], referencedTableName: 'workout_program_plan', onDelete: 'CASCADE',
        }));

        // FKs on workout_exercise_detail (now exists again)
        await queryRunner.createForeignKey('workout_exercise_detail', new TableForeignKey({
            columnNames: ['workout_day_definition_id'], referencedColumnNames: ['id'], referencedTableName: 'workout_day_definition', onDelete: 'CASCADE',
        }));

        // FKs on workout_history
        const historyTableCheck = await queryRunner.getTable(WORKOUT_HISTORY);
        if (historyTableCheck) {
            const existingUserFk = historyTableCheck.foreignKeys.find(fk => fk.columnNames.indexOf('line_user_id') !== -1);
            if (!existingUserFk) {
                await queryRunner.createForeignKey(WORKOUT_HISTORY, new TableForeignKey({
                    columnNames: ['line_user_id'], referencedColumnNames: ['line_user_id'], referencedTableName: USER, onDelete: 'CASCADE',
                }));
            }

            const existingRoutineFk = historyTableCheck.foreignKeys.find(fk => fk.columnNames.indexOf('workout_day_definition_id') !== -1);
            if (!existingRoutineFk) {
                await queryRunner.createForeignKey(WORKOUT_HISTORY, new TableForeignKey({
                    columnNames: ['workout_day_definition_id'], referencedColumnNames: ['id'], referencedTableName: 'workout_day_definition', onDelete: 'CASCADE',
                }));
            }
        }
    }
}