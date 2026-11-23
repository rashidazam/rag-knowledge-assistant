import express from "express";

const app = express();
const PORT = 3001;

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "RAG backend is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});