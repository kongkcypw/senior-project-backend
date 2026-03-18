import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from "typeorm";

const DOCUMENT_TABLE = 'document';
const KNOWLEDGE_BASE_TABLE = 'knowledge_base';

export class CreateDocumentTable1773803681403 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create Documents Table
        await queryRunner.createTable(new Table({
            name: DOCUMENT_TABLE,
            columns: [
                { name: "id", type: "bigserial", isPrimary: true, isNullable: false },
                { name: "file_name", type: "text", isNullable: false },
                { name: "is_vectorized", type: "boolean", default: "false" },
                { name: "upload_date", type: "timestamp", default: "NOW()" },
            ],
        }), true);

        // 2. Create Knowledge Base Table
        await queryRunner.createTable(new Table({
            name: KNOWLEDGE_BASE_TABLE,
            columns: [
                { name: "id", type: "bigserial", isPrimary: true, isNullable: false },
                { name: "document_id", type: "bigint", isNullable: false },
                { name: "content", type: "text", isNullable: false },
                { name: "chunk_index", type: "int", isNullable: true },
                { name: "metadata", type: "jsonb", isNullable: true },
                // Note: 'vector' is a Postgres extension type
                { name: "embedding", type: "vector", length: "768", isNullable: true },
            ],
        }), true);

        // 3. Create Foreign Key
        await queryRunner.createForeignKey(KNOWLEDGE_BASE_TABLE, new TableForeignKey({
            name: "FK_knowledge_base_document_id",
            columnNames: ["document_id"],
            referencedTableName: DOCUMENT_TABLE,
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));

        // 4. Create HNSW Index (Requires Raw SQL as TypeORM doesn't support 'using hnsw' natively)
        await queryRunner.query(`
            CREATE INDEX "idx_knowledge_base_embedding" 
            ON "${KNOWLEDGE_BASE_TABLE}" 
            USING hnsw (embedding vector_cosine_ops);
        `);

        // 5. Create GIN Index for Metadata
        await queryRunner.query(`
            CREATE INDEX "idx_knowledge_base_metadata" 
            ON "${KNOWLEDGE_BASE_TABLE}" 
            USING GIN ("metadata");
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Deleting the table automatically drops the FK and Indices in Postgres
        // But we drop manually first to be safe and follow your existing pattern
        await queryRunner.dropIndex(KNOWLEDGE_BASE_TABLE, "idx_knowledge_base_metadata");
        await queryRunner.dropIndex(KNOWLEDGE_BASE_TABLE, "idx_knowledge_base_embedding");
        await queryRunner.dropForeignKey(KNOWLEDGE_BASE_TABLE, "FK_knowledge_base_document_id");
        await queryRunner.dropTable(KNOWLEDGE_BASE_TABLE);
        await queryRunner.dropTable(DOCUMENT_TABLE);
    }
}