import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AlterTableWorkoutHistory1776658453320 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableName = 'workout_history';

        await queryRunner.renameColumn(tableName, 'set_number', 'set');
        await queryRunner.renameColumn(tableName, 'actual_reps', 'rep');
        await queryRunner.renameColumn(tableName, 'actual_weight_kg', 'weight_kg');
        await queryRunner.renameColumn(tableName, 'performed_at', 'started_at');

        await queryRunner.addColumn(tableName, new TableColumn({
            name: 'finished_at',
            type: 'timestamp',
            isNullable: false,
        }));

        await queryRunner.addColumn(tableName, new TableColumn({
            name: 'exercise_id',
            type: 'integer',
            isNullable: true,
        }));

        await queryRunner.createForeignKey(tableName, new TableForeignKey({
            name: 'FK_workout_history_exercise',
            columnNames: ['exercise_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workout_exercise',
            onDelete: 'CASCADE',
        }));

        await queryRunner.changeColumn(tableName, 'exercise_id', new TableColumn({
            name: 'exercise_id',
            type: 'integer',
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableName = 'workout_history';

        await queryRunner.dropForeignKey(tableName, 'FK_workout_history_exercise');
        await queryRunner.dropColumn(tableName, 'exercise_id');

        await queryRunner.dropColumn(tableName, 'finished_at');

        await queryRunner.renameColumn(tableName, 'started_at', 'performed_at');
        await queryRunner.renameColumn(tableName, 'weight_kg', 'actual_weight_kg');
        await queryRunner.renameColumn(tableName, 'rep', 'actual_reps');
        await queryRunner.renameColumn(tableName, 'set', 'set_number');
    }

}
