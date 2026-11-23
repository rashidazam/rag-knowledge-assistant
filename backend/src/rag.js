import { retrieveChunks } from "./retrieve.js";
import { generateAnswer } from "./generate.js";

export async function askRAG(question) {
  // Step 1: Retrieve relevant document chunks
  const chunks = await retrieveChunks(question, 3);

  // Step 2: Generate an answer using those chunks
  const answer = await generateAnswer(question, chunks);

  // Step 3: Return the answer and its sources
  return {
    question,
    answer,
    sources: chunks.map((chunk, index) => ({
      sourceId: index + 1,
      document: chunk.document_title,
      content: chunk.content,
      similarity: Number(chunk.similarity),
    })),
  };
}