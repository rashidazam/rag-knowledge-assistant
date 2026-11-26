
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
    throw new Error("Invalid chunk size or overlap");
  }

  const cleanedText = text
    .replace(/\u0000/g, "")
    .toWellFormed()
    .normalize("NFC")
    .replace(/\s+/g, " ")
    .trim();

  if (!cleanedText) return [];

  const words = cleanedText.split(" ");
  const chunks = [];
  const step = chunkSize - overlap;

  for (let start = 0; start < words.length; start += step) {
    const end = Math.min(start + chunkSize, words.length);

    chunks.push(words.slice(start, end).join(" "));

    if (end === words.length) break;
  }

  return chunks;
}
