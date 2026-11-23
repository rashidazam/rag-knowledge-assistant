import { pipeline } from "@huggingface/transformers";

let extractorPromise;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
  }

  return extractorPromise;
}

export async function generateEmbedding(text) {
  const extractor = await getExtractor();

  const output = await extractor(text, {
    pooling: "mean",
    normalize: true,
  });

  return Array.from(output.data);
}