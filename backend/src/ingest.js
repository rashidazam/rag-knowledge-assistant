import { pool } from "./db.js";
import { generateEmbedding } from "./embeddings.js";
import pgvector from "pgvector/pg";

export async function ingestDocument(title, chunks) {
  const client = await pool.connect();

  try {
    const embeddings = [];

    // Generate embeddings for every chunk
    for (const chunk of chunks) {
      embeddings.push(await generateEmbedding(chunk));
    }

    await client.query("BEGIN");

    // Create the parent document
    const documentResult = await client.query(
      "INSERT INTO documents (title) VALUES ($1) RETURNING id",
      [title]
    );

    const documentId = documentResult.rows[0].id;

    // Save each chunk with its embedding
    for (let i = 0; i < chunks.length; i++) {
      await client.query(
        `INSERT INTO document_chunks
         (document_id, chunk_index, content, embedding)
         VALUES ($1, $2, $3, $4::vector)`,
        [
          documentId,
          i,
          chunks[i],
          pgvector.toSql(embeddings[i]),
        ]
      );
    }

    await client.query("COMMIT");

    return documentId;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}