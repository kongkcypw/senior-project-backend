import { MigrationInterface, QueryRunner, TableUnique } from "typeorm";

export class AlterTableNutritionPlan1764612039605 implements MigrationInterface {

    private readonly tableName = "nutrition_plan";
    private readonly uniqueConstraintName = "UQ_nutrition_plan_line_user_id";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createUniqueConstraints(this.tableName, [
            new TableUnique({
                name: this.uniqueConstraintName,
                columnNames: ["line_user_id"],
            }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropUniqueConstraint(this.tableName, this.uniqueConstraintName);
    }

}
