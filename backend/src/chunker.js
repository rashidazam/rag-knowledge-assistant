
export function chunkText(text, chunkSize = 120, overlap = 20) {
  if (typeof text !== "string" || !text.trim()) {
    return [];
  }

  if (
    !Number.isInteger(chunkSize) ||
    !Number.isInteger(overlap) ||
    chunkSize <= 0 ||
    overlap < 0 ||
    overlap >= chunkSize
  ) {
    throw new Error(
      "chunkSize must be positive and overlap must be smaller than chunkSize"
    );
  }

  // Normalize whitespace
  const cleanedText = text.replace(/\s+/g, " ").trim();

  // Split into words
  const words = cleanedText.split(" ");

  const chunks = [];

  // Number of words to advance for each new chunk
  const step = chunkSize - overlap;

  for (let start = 0; start < words.length; start += step) {
    const end = Math.min(start + chunkSize, words.length);

    const chunk = words.slice(start, end).join(" ");

    chunks.push(chunk);

    // Stop after the final chunk
    if (end === words.length) {
      break;
    }
  }

  return chunks;
}
