import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameTableUserCalories1763908150775 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable("user_calories", "meal_history");
        await queryRunner.renameTable("user_calories_plan", "nutrition_plan");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.renameTable("meal_history", "user_calories");
        await queryRunner.renameTable("nutrition_plan", "user_calories_plan");
    }

}
