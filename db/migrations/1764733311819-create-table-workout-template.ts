import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

const ROUTINE_TEMPLATE_TABLE = 'workout_routine_template';
const EXERCISE_TEMPLATE_TABLE = 'workout_exercise_template';

export class CreateTableWorkoutTemplate1764733311819 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.createTable(new Table({
            name: ROUTINE_TEMPLATE_TABLE,
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                { name: 'name', type: 'varchar', isNullable: false },
                { name: 'description', type: 'text', isNullable: true },
                { name: 'tag', type: 'varchar', isNullable: true },
                { name: 'image_url', type: 'varchar', isNullable: true },
                { name: 'created_at', type: 'timestamp', default: 'NOW()' },
                { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
            ],
        }), true);

        await queryRunner.createTable(new Table({
            name: EXERCISE_TEMPLATE_TABLE,
            columns: [
                { name: "id", type: "serial", isPrimary: true, isNullable: false },
                // Make this nullable to support STANDALONE exercises (library)
                { name: 'routine_template_id', type: 'int', isNullable: true },
                { name: 'name', type: 'varchar', isNullable: false },
                { name: 'rep', type: 'int', isNullable: false },
                { name: 'set', type: 'int', isNullable: false },
                { name: 'weight_kg', type: 'real', isNullable: true },
                { name: 'rest_time_second', type: 'int', isNullable: true },
                { name: 'image_url', type: 'varchar', isNullable: true },
                { name: 'order_in_routine', type: 'int', isNullable: true }, // Nullable for standalones
                { name: 'created_at', type: 'timestamp', default: 'NOW()' },
                { name: 'updated_at', type: 'timestamp', default: 'NOW()' },
            ],
        }), true);

        await queryRunner.createForeignKey(EXERCISE_TEMPLATE_TABLE, new TableForeignKey({
            columnNames: ['routine_template_id'],
            referencedColumnNames: ['id'],
            referencedTableName: ROUTINE_TEMPLATE_TABLE,
            onDelete: 'CASCADE',
            name: 'FK_exercise_template_routine_template'
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(EXERCISE_TEMPLATE_TABLE, 'FK_exercise_template_routine_template');
        await queryRunner.dropTable(EXERCISE_TEMPLATE_TABLE);
        await queryRunner.dropTable(ROUTINE_TEMPLATE_TABLE);
    }
}