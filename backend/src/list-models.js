
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  console.log("Fetching available Gemini models...\n");

  const models = await ai.models.list();

  const availableModels = [];

  for await (const model of models) {
    const actions = model.supportedActions || [];

    availableModels.push({
      name: model.name,
      displayName: model.displayName,
      generateContent: actions.includes("generateContent"),
    });
  }

  console.table(availableModels);

  console.log(
    "\nSelect a model that supports generateContent."
  );
  console.log(
    "Then update GEMINI_MODEL in your backend/.env file."
  );
}

main().catch((error) => {
  console.error("Failed to list models:", error.message);
});
