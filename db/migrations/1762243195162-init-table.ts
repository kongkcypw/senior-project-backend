import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableUnique,
} from "typeorm";

export class InitTable1762243195162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- user table ---
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "line_user_id", type: "varchar", isNullable: false },
          { name: "display_name", type: "varchar", isNullable: true },
          { name: "role", type: "varchar", isNullable: true },
          { name: "created_at", type: "timestamp", isNullable: false, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

    await queryRunner.createUniqueConstraints("user", [
      new TableUnique({
        name: "UQ_user_line_user_id",
        columnNames: ["line_user_id"],
      }),
    ]);

    // --- line_group table ---
    await queryRunner.createTable(
      new Table({
        name: "line_group",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "line_group_id", type: "varchar", isNullable: false },
          { name: "name", type: "varchar", isNullable: true },
          { name: "created_at", type: "timestamp", isNullable: true, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

    await queryRunner.createUniqueConstraints("line_group", [
      new TableUnique({
        name: "UQ_line_group_line_group_id",
        columnNames: ["line_group_id"],
      }),
    ]);

    // --- notification_schedule table ---
    await queryRunner.createTable(
      new Table({
        name: "notification_schedule",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "type", type: "varchar", isNullable: false },
          { name: "send_interval", type: "varchar", isNullable: false },
          { name: "send_at", type: "timestamp", isNullable: false },
          { name: "is_active", type: "boolean", isNullable: false },
          { name: "created_at", type: "timestamp", isNullable: false, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

    // --- line_group_member table ---
    await queryRunner.createTable(
      new Table({
        name: "line_group_member",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "line_group_id", type: "varchar", isNullable: false },
          { name: "line_user_id", type: "varchar", isNullable: false },
          { name: "join_group_at", type: "timestamp", isNullable: false },
          { name: "leave_group_at", type: "timestamp", isNullable: true },
          { name: "created_at", type: "timestamp", isNullable: true, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

    await queryRunner.createForeignKeys("line_group_member", [
      new TableForeignKey({
        name: "FK_line_group_member_line_user_id",
        columnNames: ["line_user_id"],
        referencedTableName: "user",
        referencedColumnNames: ["line_user_id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        name: "FK_line_group_member_line_group_id",
        columnNames: ["line_group_id"],
        referencedTableName: "line_group",
        referencedColumnNames: ["line_group_id"],
        onDelete: "CASCADE",
      }),
    ]);

    // --- line_group_chat_history table ---
    await queryRunner.createTable(
      new Table({
        name: "line_group_chat_history",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "line_group_id", type: "varchar", isNullable: false },
          { name: "line_user_id", type: "varchar", isNullable: false },
          { name: "message_id", type: "integer", isNullable: false },
          { name: "sent_at", type: "timestamp", isNullable: false },
          { name: "unsent_at", type: "timestamp", isNullable: true },
          { name: "created_at", type: "timestamp", isNullable: true, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

    await queryRunner.createForeignKeys("line_group_chat_history", [
      new TableForeignKey({
        name: "FK_line_group_chat_history_line_user_id",
        columnNames: ["line_user_id"],
        referencedTableName: "user",
        referencedColumnNames: ["line_user_id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        name: "FK_line_group_chat_history_line_group_id",
        columnNames: ["line_group_id"],
        referencedTableName: "line_group",
        referencedColumnNames: ["line_group_id"],
        onDelete: "CASCADE",
      }),
    ]);

    // --- user_calories table ---
    await queryRunner.createTable(
      new Table({
        name: "user_calories",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "line_user_id", type: "varchar", isNullable: false },
          { name: "food_title", type: "varchar", isNullable: false },
          { name: "total_calories", type: "integer", isNullable: false },
          { name: "protein", type: "integer", isNullable: false },
          { name: "carbohydrate", type: "integer", isNullable: false },
          { name: "fat", type: "integer", isNullable: false },
          { name: "ingredients", type: "jsonb", isNullable: false },
          { name: "confirm_at", type: "timestamp", isNullable: true },
          { name: "created_at", type: "timestamp", isNullable: false, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "user_calories",
      new TableForeignKey({
        name: "FK_user_calories_line_user_id",
        columnNames: ["line_user_id"],
        referencedTableName: "user",
        referencedColumnNames: ["line_user_id"],
        onDelete: "CASCADE",
      })
    );

    // --- user_calories_plan table ---
    await queryRunner.createTable(
      new Table({
        name: "user_calories_plan",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "line_user_id", type: "varchar", isNullable: false },
          { name: "total_calories", type: "integer", isNullable: false },
          { name: "protein", type: "integer", isNullable: false },
          { name: "carbohydrate", type: "integer", isNullable: false },
          { name: "fat", type: "integer", isNullable: false },
          { name: "need_notificiation", type: "boolean", isNullable: false },
          { name: "notification_schedule_id", type: "integer", isNullable: false },
          { name: "created_at", type: "timestamp", isNullable: false, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

    await queryRunner.createForeignKeys("user_calories_plan", [
      new TableForeignKey({
        name: "FK_user_calories_plan_line_user_id",
        columnNames: ["line_user_id"],
        referencedTableName: "user",
        referencedColumnNames: ["line_user_id"],
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        name: "FK_user_calories_plan_notification_schedule_id",
        columnNames: ["notification_schedule_id"],
        referencedTableName: "notification_schedule",
        referencedColumnNames: ["id"],
        onDelete: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user_calories_plan", true);
    await queryRunner.dropTable("user_calories", true);
    await queryRunner.dropTable("line_group_chat_history", true);
    await queryRunner.dropTable("line_group_member", true);
    await queryRunner.dropTable("notification_schedule", true);
    await queryRunner.dropTable("line_group", true);
    await queryRunner.dropTable("user", true);
  }
}
