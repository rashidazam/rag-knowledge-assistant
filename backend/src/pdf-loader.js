
export async function extractPdfText(buffer) {
  const { PDFParse } = await import("pdf-parse");

  const parser = new PDFParse({
    data: new Uint8Array(buffer),
  });

  try {
    const result = await parser.getText();

    return {
      text: result.text?.trim() || "",
      totalPages: result.total || 0,
    };
  } finally {
    await parser.destroy();
  }
}
