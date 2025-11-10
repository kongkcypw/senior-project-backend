import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AlterTableUserAndLineGroup1762768289377 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- Add picture_url to user ---
    await queryRunner.addColumn(
      "user",
      new TableColumn({
        name: "picture_url",
        type: "varchar",
        isNullable: true,
      })
    );

    // --- Add picture_url to line_group ---
    await queryRunner.addColumn(
      "line_group",
      new TableColumn({
        name: "picture_url",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // --- Remove picture_url from user ---
    await queryRunner.dropColumn("user", "picture_url");

    // --- Remove picture_url from line_group ---
    await queryRunner.dropColumn("line_group", "picture_url");
  }
}
