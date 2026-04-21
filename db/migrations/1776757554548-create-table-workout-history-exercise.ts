import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateTableWorkoutHistoryExercise1776757554548 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableName = 'workout_history_exercise';

        await queryRunner.createTable(new Table({
            name: tableName,
            columns: [
                { name: 'id',                        type: 'serial',    isPrimary: true, isNullable: false },
                { name: 'workout_history_routine_id', type: 'integer',   isNullable: false },
                { name: 'exercise_id',               type: 'integer',   isNullable: false },
                { name: 'set',                       type: 'integer',   isNullable: false },
                { name: 'rep',                       type: 'integer',   isNullable: false },
                { name: 'weight_kg',                 type: 'float',     isNullable: true  },
                { name: 'notes',                     type: 'varchar',   isNullable: true  },
                { name: 'created_at',                type: 'timestamp', isNullable: false, default: 'NOW()' },
                { name: 'updated_at',                type: 'timestamp', isNullable: false, default: 'NOW()' },
            ],
        }), true);

        await queryRunner.createForeignKey(tableName, new TableForeignKey({
            name: 'FK_history_exercise_to_routine',
            columnNames: ['workout_history_routine_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workout_history_routine',
            onDelete: 'CASCADE',
        }));

        await queryRunner.createForeignKey(tableName, new TableForeignKey({
            name: 'FK_history_exercise_to_exercise',
            columnNames: ['exercise_id'],
            referencedColumnNames: ['id'],
            referencedTableName: 'workout_exercise',
            onDelete: 'CASCADE',
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableName = 'workout_history_exercise';
        await queryRunner.dropForeignKey(tableName, 'FK_history_exercise_to_exercise');
        await queryRunner.dropForeignKey(tableName, 'FK_history_exercise_to_routine');
        await queryRunner.dropTable(tableName);
    }

}
