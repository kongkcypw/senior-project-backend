import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableMealHistory1763910925458 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_history" RENAME COLUMN "total_calories" TO "calories"`);
        await queryRunner.addColumn("meal_history", new TableColumn({
                name: "image_url",
                type: "varchar",
                isNullable: false,
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "meal_history" RENAME COLUMN "calories" TO "total_calories"`);
        await queryRunner.dropColumn("meal_history", "image_url");
    }
}
