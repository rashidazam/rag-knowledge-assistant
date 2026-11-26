
import { pipeline, env } from "@huggingface/transformers";

if (process.env.VERCEL) {
  env.cacheDir = "/tmp/transformers-cache";
}

let extractorPromise;

async function getExtractor() {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    ).catch((error) => {
      extractorPromise = undefined;
      throw error;
    });
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
