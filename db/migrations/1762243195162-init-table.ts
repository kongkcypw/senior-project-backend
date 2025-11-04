import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class InitTable1762243195162 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // --- users table ---
    await queryRunner.createTable(
      new Table({
        name: "users",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "line_user_id", type: "varchar", isNullable: false },
          { name: "display_name", type: "varchar", isNullable: false },
          { name: "role", type: "varchar", isNullable: false },
          { name: "created_at", type: "timestamp", isNullable: false, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

    // --- line_groups table ---
    await queryRunner.createTable(
      new Table({
        name: "line_groups",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "group_id", type: "varchar", isUnique: true, isNullable: false },
          { name: "name", type: "varchar", isUnique: true, isNullable: false },
          { name: "created_at", type: "timestamp", isNullable: true, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

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

    // --- line_group_members table ---
    await queryRunner.createTable(
      new Table({
        name: "line_group_members",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "group_id", type: "varchar", isNullable: false },
          { name: "user_id", type: "integer", isNullable: false },
          { name: "join_group_at", type: "timestamp", isNullable: false },
          { name: "leave_group_at", type: "timestamp", isNullable: true },
          { name: "created_at", type: "timestamp", isNullable: true, default: "now()" },
          { name: "updated_at", type: "timestamp", isNullable: false, default: "now()" },
        ],
      }),
      true
    );

    await queryRunner.createForeignKeys("line_group_members", [
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["group_id"],
        referencedColumnNames: ["group_id"],
        referencedTableName: "line_groups",
        onDelete: "CASCADE",
      }),
    ]);

    // --- line_group_chat_history table ---
    await queryRunner.createTable(
      new Table({
        name: "line_group_chat_history",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "group_id", type: "varchar", isNullable: false },
          { name: "user_id", type: "integer", isNullable: false },
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
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["group_id"],
        referencedColumnNames: ["group_id"],
        referencedTableName: "line_groups",
        onDelete: "CASCADE",
      }),
    ]);

    // --- users_calories table ---
    await queryRunner.createTable(
      new Table({
        name: "users_calories",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "user_id", type: "integer", isNullable: false },
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
      "users_calories",
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      })
    );

    // --- users_calories_plan table ---
    await queryRunner.createTable(
      new Table({
        name: "users_calories_plan",
        columns: [
          { name: "id", type: "serial", isPrimary: true, isNullable: false },
          { name: "user_id", type: "integer", isNullable: false },
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

    await queryRunner.createForeignKeys("users_calories_plan", [
      new TableForeignKey({
        columnNames: ["user_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "users",
        onDelete: "CASCADE",
      }),
      new TableForeignKey({
        columnNames: ["notification_schedule_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "notification_schedule",
        onDelete: "CASCADE",
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("users_calories_plan", true);
    await queryRunner.dropTable("users_calories", true);
    await queryRunner.dropTable("line_group_chat_history", true);
    await queryRunner.dropTable("line_group_members", true);
    await queryRunner.dropTable("notification_schedule", true);
    await queryRunner.dropTable("line_groups", true);
    await queryRunner.dropTable("users", true);
  }
}
