import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableWorkoutProgram1776669703380 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const tableName = 'workout_program';

        await queryRunner.renameColumn(tableName, 'order_in_program', 'order_in_workout');

        await queryRunner.changeColumn(tableName, 'line_user_id_trainer', new TableColumn({
            name: 'line_user_id_trainer',
            type: 'varchar',
            isNullable: true,
        }));

        await queryRunner.addColumn(tableName, new TableColumn({
            name: 'description',
            type: 'text',
            isNullable: true,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const tableName = 'workout_program';

        await queryRunner.dropColumn(tableName, 'description');

        await queryRunner.changeColumn(tableName, 'line_user_id_trainer', new TableColumn({
            name: 'line_user_id_trainer',
            type: 'varchar',
            isNullable: false,
        }));

        await queryRunner.renameColumn(tableName, 'order_in_workout', 'order_in_program');
    }

}
