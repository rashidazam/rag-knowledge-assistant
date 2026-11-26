
import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Tabs,
  Tab,
  Alert,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";

import { UploadCloud, FileText } from "lucide-react";

import {
  ingestPdf,
  ingestText,
  ingestUrl,
  getErrorMessage,
} from "../api/ragApi";

export default function DocumentUpload({ onSuccess }) {
  const [tab, setTab] = useState(0);
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      let result;
      let documentTitle;
      let type;

      if (tab === 0) {
        if (!file) throw new Error("Select a PDF file");

        if (file.size > 10 * 1024 * 1024) {
          throw new Error("Maximum file size is 10 MB");
        }

        result = await ingestPdf(file);
        documentTitle = file.name;
        type = "PDF";
      } else if (tab === 1) {
        if (!url.trim()) {
          throw new Error("Enter a webpage URL");
        }

        result = await ingestUrl(url.trim());
        documentTitle = result.title || url;
        type = "URL";
      } else {
        if (!title.trim() || !content.trim()) {
          throw new Error("Title and content are required");
        }

        result = await ingestText(
          title.trim(),
          content.trim()
        );

        documentTitle = title;
        type = "TEXT";
      }

      onSuccess({
        id: result.documentId ?? crypto.randomUUID(),
        title: documentTitle,
        type,
        chunks: result.chunksStored,
      });

      setSuccess(
        `Successfully ingested ${result.chunksStored} chunks`
      );

      setFile(null);
      setUrl("");
      setTitle("");
      setContent("");
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Tabs
        value={tab}
        onChange={(_, value) => {
          setTab(value);
          setError("");
          setSuccess("");
        }}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab label="PDF" disabled={loading} />
        <Tab label="URL" disabled={loading} />
        <Tab label="Text" disabled={loading} />
      </Tabs>

      <Stack
        component="form"
        onSubmit={handleSubmit}
        spacing={2}
      >
        {tab === 0 && (
          <Button
            component="label"
            variant="outlined"
            disabled={loading}
            sx={{
              borderStyle: "dashed",
              py: 3,
              textTransform: "none",
            }}
          >
            <Stack alignItems="center" spacing={1}>
              {file ? (
                <FileText size={28} />
              ) : (
                <UploadCloud size={28} />
              )}

              <Typography
                variant="body2"
                sx={{ overflowWrap: "anywhere" }}
              >
                {file ? file.name : "Choose PDF file"}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Maximum 10 MB
              </Typography>
            </Stack>

            <input
              hidden
              type="file"
              accept=".pdf,application/pdf"
              onChange={(event) => {
                setFile(event.target.files?.[0] || null);
                event.target.value = "";
              }}
            />
          </Button>
        )}

        {tab === 1 && (
          <TextField
            label="Webpage URL"
            placeholder="https://react.dev/learn"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            type="url"
            required
            fullWidth
            size="small"
          />
        )}

        {tab === 2 && (
          <>
            <TextField
              label="Document title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
              fullWidth
              size="small"
            />

            <TextField
              label="Document content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
              multiline
              minRows={5}
              maxRows={12}
              required
              fullWidth
            />
          </>
        )}

        <Button
          type="submit"
          variant="contained"
          disabled={loading || (tab === 0 && !file)}
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <UploadCloud size={18} />
            )
          }
        >
          {loading ? "Processing..." : "Ingest document"}
        </Button>

        {loading && (
          <Typography variant="caption" color="text.secondary">
            Extracting text, creating chunks and generating
            embeddings. This may take a while.
          </Typography>
        )}

        {error && <Alert severity="error">{error}</Alert>}

        {success && (
          <Alert severity="success">{success}</Alert>
        )}
      </Stack>
    </Box>
  );
}