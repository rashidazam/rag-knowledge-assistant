import { generateEmbedding } from "./embeddings.js";

async function test() {
  const texts = [
    "JavaScript closures remember their lexical scope.",
    "React hooks manage state in functional components.",
    "Tomorrow's weather will be sunny.",
  ];

  for (const text of texts) {
    const embedding = await generateEmbedding(text);

    console.log("\nText:", text);
    console.log("Dimensions:", embedding.length);
    console.log("First 5 values:", embedding.slice(0, 5));
  }
}

test().catch(console.error);