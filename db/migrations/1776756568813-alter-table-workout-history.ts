import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableWorkoutHistory1776756568813 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const oldName = 'workout_history';
        const newName = 'workout_history_routine';

        // 1. Drop FK and per-set columns
        await queryRunner.dropForeignKey(oldName, 'FK_workout_history_exercise');
        await queryRunner.dropColumns(oldName, [
            new TableColumn({ name: 'exercise_id', type: 'integer' }),
            new TableColumn({ name: 'set',         type: 'integer' }),
            new TableColumn({ name: 'rep',         type: 'integer' }),
            new TableColumn({ name: 'weight_kg',   type: 'float'   }),
            new TableColumn({ name: 'notes',       type: 'varchar' }),
        ]);

        // 2. Make finished_at nullable
        await queryRunner.changeColumn(oldName, 'finished_at', new TableColumn({
            name: 'finished_at',
            type: 'timestamp',
            isNullable: true,
        }));

        // 3. Rename table
        await queryRunner.renameTable(oldName, newName);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const oldName = 'workout_history';
        const newName = 'workout_history_routine';

        // 1. Rename back
        await queryRunner.renameTable(newName, oldName);

        // 2. Make finished_at NOT NULL again
        await queryRunner.changeColumn(oldName, 'finished_at', new TableColumn({
            name: 'finished_at',
            type: 'timestamp',
            isNullable: false,
        }));

        // 3. Re-add per-set columns and FK
        await queryRunner.addColumns(oldName, [
            new TableColumn({ name: 'exercise_id', type: 'integer', isNullable: true }),
            new TableColumn({ name: 'set',         type: 'integer', isNullable: false, default: 1 }),
            new TableColumn({ name: 'rep',         type: 'integer', isNullable: false, default: 0 }),
            new TableColumn({ name: 'weight_kg',   type: 'float',   isNullable: false, default: 0 }),
            new TableColumn({ name: 'notes',       type: 'varchar', isNullable: true }),
        ]);
    }

}
