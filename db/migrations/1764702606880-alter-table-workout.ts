import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey, TableIndex } from "typeorm";

export class AlterTableWorkout1764702606880 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const programPlanTableName = 'workout_program_plan';
        const dayDefinitionTableName = 'workout_day_definition';
        const exerciseDetailTableName = 'workout_exercise_detail';

        // Drop foreign key on line_user_id_trainee before altering it to be NOT NULL
        const traineeFk = new TableForeignKey({
            columnNames: ['line_user_id_trainee'],
            referencedColumnNames: ['line_user_id'],
            referencedTableName: 'user',
            onDelete: 'RESTRICT',
        });
        await queryRunner.dropForeignKey(programPlanTableName, traineeFk);


        // Alter column line_user_id_trainee to be NOT NULL
        await queryRunner.changeColumn(programPlanTableName, 'line_user_id_trainee', new TableColumn({
            name: 'line_user_id_trainee',
            type: 'varchar',
            isNullable: false,
        }));

        // Re-create the foreign key after changing the column's nullability
        await queryRunner.createForeignKey(programPlanTableName, new TableForeignKey({
            columnNames: ['line_user_id_trainee'],
            referencedColumnNames: ['line_user_id'],
            referencedTableName: 'user',
            onDelete: 'RESTRICT',
            name: 'FK_workout_program_plan_trainee' // Giving it a name this time
        }));

        // Drop columns: notes, is_active, start_date, end_date
        await queryRunner.dropColumns(programPlanTableName, [
            'notes',
            'is_active',
            'start_date',
            'end_date',
        ]);

        // Drop column notes
        await queryRunner.dropColumn(dayDefinitionTableName, 'notes');

        // Rename prescribed_weight_kg to weight_kg and set type to 'real'
        await queryRunner.changeColumn(exerciseDetailTableName, 'prescribed_weight_kg', new TableColumn({
            name: 'weight_kg',
            type: 'int',
            isNullable: true,
        }));

        await queryRunner.changeColumn(exerciseDetailTableName, 'reps', new TableColumn({
            name: 'reps',
            type: 'int', // Changed from 'varchar' to 'int'
            isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const programPlanTableName = 'workout_program_plan';
        const dayDefinitionTableName = 'workout_day_definition';
        const exerciseDetailTableName = 'workout_exercise_detail';

        // a. Reverse alter column reps from 'int' back to 'varchar'
        await queryRunner.changeColumn(exerciseDetailTableName, 'reps', new TableColumn({
            name: 'reps',
            type: 'varchar',
            isNullable: false,
        }));

        // b. Reverse rename weight_kg back to prescribed_weight_kg
        await queryRunner.changeColumn(exerciseDetailTableName, 'weight_kg', new TableColumn({
            name: 'prescribed_weight_kg',
            type: 'real',
            isNullable: true,
        }));

        // --- Reverse Changes to workout_day_definition table ---

        // Add back column notes
        await queryRunner.addColumn(dayDefinitionTableName, new TableColumn({
            name: 'notes',
            type: 'text',
            isNullable: true,
        }));

        // --- Reverse Changes to workout_program_plan table ---

        // Add back columns: notes, is_active, start_date, end_date
        await queryRunner.addColumns(programPlanTableName, [
            new TableColumn({
                name: 'notes',
                type: 'text',
                isNullable: true,
            }),
            new TableColumn({
                name: 'is_active',
                type: 'boolean',
                default: true,
                isNullable: false,
            }),
            new TableColumn({
                name: 'start_date',
                type: 'date',
                isNullable: true,
            }),
            new TableColumn({
                name: 'end_date',
                type: 'date',
                isNullable: true,
            }),
        ]);

        // Drop foreign key on line_user_id_trainee before altering it to be nullable
        await queryRunner.dropForeignKey(programPlanTableName, 'FK_workout_program_plan_trainee');

        // Alter column line_user_id_trainee to be nullable again
        await queryRunner.changeColumn(programPlanTableName, 'line_user_id_trainee', new TableColumn({
            name: 'line_user_id_trainee',
            type: 'varchar',
            isNullable: true, // Changed from false to true
        }));

        // Re-create the foreign key that was dropped, but without the name to match the original migration
        await queryRunner.createForeignKey(programPlanTableName, new TableForeignKey({
            columnNames: ['line_user_id_trainee'],
            referencedColumnNames: ['line_user_id'],
            referencedTableName: 'user',
            onDelete: 'RESTRICT',
        }));
    }
}