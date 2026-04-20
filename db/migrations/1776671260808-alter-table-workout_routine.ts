import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableWorkoutRoutine1776671260808 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('workout_routine', new TableColumn({
            name: 'description',
            type: 'text',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('workout_routine', 'description');
    }

}
