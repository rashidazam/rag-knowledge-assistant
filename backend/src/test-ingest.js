import { ingestDocument } from "./ingest.js";
import { pool } from "./db.js";

async function main() {
  const chunks = [
    "JavaScript closures allow functions to remember variables from their lexical scope.",
    "React hooks like useState and useEffect help manage state and side effects in functional components.",
    "PostgreSQL is a relational database. The pgvector extension enables vector similarity search."
  ];

  try {
    const documentId = await ingestDocument(
      "My Programming Knowledge",
      chunks
    );

    console.log("Document inserted successfully!");
    console.log("Document ID:", documentId);

    const result = await pool.query(
      `SELECT id, document_id, chunk_index, content,
              vector_dims(embedding) AS dimensions
       FROM document_chunks
       WHERE document_id = $1
       ORDER BY chunk_index`,
      [documentId]
    );

    console.table(result.rows);
  } catch (error) {
    console.error("Ingestion failed:", error);
  } finally {
    await pool.end();
  }
}

main();