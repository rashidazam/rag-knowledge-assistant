import { pool } from "./db.js";
import { generateEmbedding } from "./embeddings.js";
import pgvector from "pgvector/pg";

export async function retrieveChunks(question, limit = 5) {
  // Step 1: Convert the user's question into an embedding
  const questionEmbedding = await generateEmbedding(question);

  // Step 2: Search PostgreSQL for similar embeddings
  const result = await pool.query(
    `
    SELECT
      dc.id,
      dc.content,
      dc.chunk_index,
      d.title AS document_title,
      1 - (dc.embedding <=> $1::vector) AS similarity
    FROM document_chunks dc
    JOIN documents d ON d.id = dc.document_id
    ORDER BY dc.embedding <=> $1::vector ASC
    LIMIT $2
    `,
    [pgvector.toSql(questionEmbedding), limit]
  );

  return result.rows;
}