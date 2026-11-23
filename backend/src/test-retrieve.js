import { retrieveChunks } from "./retrieve.js";
import { pool } from "./db.js";

async function main() {
  const questions = [
    "How can I manage state in React?",
    "What are JavaScript closures?",
    "Which database supports vector similarity search?"
  ];

  try {
    for (const question of questions) {
      console.log("\n================================");
      console.log("Question:", question);

      const results = await retrieveChunks(question, 3);

      console.table(
        results.map((row) => ({
          document: row.document_title,
          content: row.content,
          similarity: Number(row.similarity).toFixed(4)
        }))
      );
    }
  } catch (error) {
    console.error("Retrieval failed:", error);
  } finally {
    await pool.end();
  }
}

main();