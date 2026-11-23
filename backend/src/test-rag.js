import { askRAG } from "./rag.js";
import { pool } from "./db.js";

async function main() {
  try {
    const question = "How can I manage state in React?";

    console.log("Question:", question);

    const result = await askRAG(question);

    console.log("\nAI Answer:");
    console.log(result.answer);

    console.log("\nRetrieved Sources:");
    console.table(
      result.sources.map((source) => ({
        id: source.sourceId,
        document: source.document,
        similarity: source.similarity.toFixed(4),
      }))
    );
  } catch (error) {
    console.error("RAG failed:", error.message);
  } finally {
    await pool.end();
  }
}

main();