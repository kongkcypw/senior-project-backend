import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableWorkoutExercise1776671697357 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableName = 'workout_exercise';

        await queryRunner.dropColumn(tableName, 'rest_time_second');

        await queryRunner.addColumn(tableName, new TableColumn({
            name: 'description',
            type: 'text',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableName = 'workout_exercise';

        await queryRunner.dropColumn(tableName, 'description');

        await queryRunner.addColumn(tableName, new TableColumn({
            name: 'rest_time_second',
            type: 'integer',
            isNullable: true,
        }));
    }

}
