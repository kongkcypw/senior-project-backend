import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

const WORKOUT_EXERCISE = 'workout_exercise';
const WORKOUT_EXERCISE_SET = 'workout_exercise_set'; // New table name
const WORKOUT_EXERCISE_TEMPLATE = 'workout_exercise_template';

export class CreateNewTableWorkout1764749540335 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        // --- 1. Drop fixed prescription columns from WORKOUT_EXERCISE (Production) ---
        await queryRunner.dropColumns(WORKOUT_EXERCISE, [
            new TableColumn({ name: 'rep', type: 'int' }),
            new TableColumn({ name: 'set', type: 'int' }),
            new TableColumn({ name: 'weight_kg', type: 'real' }),
        ]);

        // --- 2. Drop fixed prescription columns from WORKOUT_EXERCISE_TEMPLATE (Templates) ---
        await queryRunner.dropColumns(WORKOUT_EXERCISE_TEMPLATE, [
            new TableColumn({ name: 'rep', type: 'int' }),
            new TableColumn({ name: 'set', type: 'int' }),
            new TableColumn({ name: 'weight_kg', type: 'real' }),
        ]);

        // --- 3. Create WORKOUT_EXERCISE_SET table ---
        await queryRunner.createTable(new Table({
            name: WORKOUT_EXERCISE_SET,
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                { name: 'exercise_id', type: 'int', isNullable: false },

                // Renamed from set_number
                { name: 'set', type: 'int', isNullable: false },

                // Renamed from prescribed_rep
                { name: 'rep', type: 'int', isNullable: false },

                // Renamed from prescribed_weight_kg
                { name: 'weight_kg', type: 'real', isNullable: true },

                { name: 'created_at', type: 'timestamp', default: 'NOW()' },
                { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
            ],
            indices: [
                // Ensures the 'set' number is unique within an 'exercise_id'
                { columnNames: ['exercise_id', 'set'], isUnique: true }
            ]
        }), true);

        // --- 4. Add Foreign Key for WORKOUT_EXERCISE_SET ---
        await queryRunner.createForeignKey(WORKOUT_EXERCISE_SET, new TableForeignKey({
            columnNames: ['exercise_id'],
            referencedColumnNames: ['id'],
            referencedTableName: WORKOUT_EXERCISE,
            onDelete: 'CASCADE',
            name: 'FK_exercise_set_to_exercise'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        // --- 1. Drop Foreign Key and Table (Reverse 3 & 4) ---
        await queryRunner.dropForeignKey(WORKOUT_EXERCISE_SET, 'FK_exercise_set_to_exercise');
        await queryRunner.dropTable(WORKOUT_EXERCISE_SET);

        // --- 2. Re-add old fixed prescription columns to WORKOUT_EXERCISE_TEMPLATE (Reverse 2) ---
        await queryRunner.addColumns(WORKOUT_EXERCISE_TEMPLATE, [
            // These defaults rely on your previous mock data definition
            new TableColumn({ name: 'rep', type: 'int', isNullable: false, default: 10 }),
            new TableColumn({ name: 'set', type: 'int', isNullable: false, default: 3 }),
            new TableColumn({ name: 'weight_kg', type: 'real', isNullable: true }),
        ]);

        // --- 3. Re-add old fixed prescription columns to WORKOUT_EXERCISE (Reverse 1) ---
        await queryRunner.addColumns(WORKOUT_EXERCISE, [
            // These defaults rely on your previous mock data definition
            new TableColumn({ name: 'rep', type: 'int', isNullable: false, default: 8 }),
            new TableColumn({ name: 'set', type: 'int', isNullable: false, default: 3 }),
            new TableColumn({ name: 'weight_kg', type: 'real', isNullable: true }),
        ]);
    }
}