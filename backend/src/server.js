
import express from "express";
import cors from "cors";
import "dotenv/config";

import { askRAG } from "./rag.js";
import { ingestDocument } from "./ingest.js";
import { chunkText } from "./chunker.js";
import multer from "multer";
import { extractPdfText } from "./pdf-loader.js";
import { extractUrlText } from "./url-loader.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB
  },

  fileFilter: (req, file, callback) => {
    if (file.mimetype === "application/pdf") {
      callback(null, true);
    } else {
      callback(new Error("Only PDF files are allowed"));
    }
  },
});


// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "RAG Knowledge Assistant API is running",
  });
});

// Ask a question using RAG
app.post("/api/ask", async (req, res) => {
  try {
    const { question } = req.body || {};

    if (typeof question !== "string" || !question.trim()) {
      return res.status(400).json({
        error: "A valid question is required",
      });
    }

    const result = await askRAG(question.trim());

    res.json(result);
  } catch (error) {
    console.error("RAG API error:", error);

    res.status(500).json({
      error: "Failed to generate an answer",
    });
  }
});



app.post("/api/documents", async (req, res) => {
  try {
    const { title, content } = req.body || {};

    if (typeof title !== "string" || !title.trim()) {
      return res.status(400).json({
        error: "A valid document title is required",
      });
    }

    if (typeof content !== "string" || !content.trim()) {
      return res.status(400).json({
        error: "Document content is required",
      });
    }

    // Step 1: Split document into chunks
    const chunks = chunkText(content, 120, 20);

    // Step 2: Generate embeddings and store chunks
    const documentId = await ingestDocument(
      title.trim(),
      chunks
    );

    return res.status(201).json({
      message: "Document ingested successfully",
      documentId,
      chunksStored: chunks.length,
    });
  } catch (error) {
    console.error("Ingestion error:", error);

    return res.status(500).json({
      error: "Failed to ingest document",
    });
  }
});



app.post(
  "/api/documents/pdf",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "PDF file is required",
        });
      }

      // Step 1: Extract text from PDF
      const { text, totalPages } =
        await extractPdfText(req.file.buffer);

      if (!text) {
        return res.status(422).json({
          error: "No readable text found in PDF",
        });
      }

      // Step 2: Split text into chunks
      const chunks = chunkText(text, 120, 20);

      // Step 3: Generate embeddings and store
      const documentId = await ingestDocument(
        req.file.originalname,
        chunks
      );

      return res.status(201).json({
        message: "PDF ingested successfully",
        documentId,
        filename: req.file.originalname,
        totalPages,
        chunksStored: chunks.length,
      });
    } catch (error) {
      console.error("PDF ingestion failed:", error);

      return res.status(500).json({
        error: "Failed to process PDF",
      });
    }
  }
);



app.post("/api/documents/url", async (req, res) => {
  try {
    const { url } = req.body || {};

    if (typeof url !== "string" || !url.trim()) {
      return res.status(400).json({
        error: "A valid URL is required",
      });
    }

    // Step 1: Fetch webpage and extract text
    const { title, text, url: sourceUrl } =
      await extractUrlText(url);

    if (!text) {
      return res.status(422).json({
        error: "No readable text found on webpage",
      });
    }

    // Step 2: Split text into chunks
    const chunks = chunkText(text, 120, 20);

    // Step 3: Generate embeddings and save
    const documentId = await ingestDocument(
      title,
      chunks
    );

    return res.status(201).json({
      message: "URL ingested successfully",
      documentId,
      title,
      sourceUrl,
      chunksStored: chunks.length,
    });
  } catch (error) {
    console.error("URL ingestion failed:", error);

    return res.status(500).json({
      error: "Failed to ingest URL",
    });
  }
});




app.listen(PORT, () => {
  console.log(`RAG API running at http://localhost:${PORT}`);
});
