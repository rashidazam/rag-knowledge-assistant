
import {
  Box,
  Stack,
  Typography,
  Divider,
  Chip,
  Paper,
} from "@mui/material";

import {
  Database,
  FileText,
  Globe,
  FileType,
} from "lucide-react";

import DocumentUpload from "./DocumentUpload";

export default function Sidebar({
  documents,
  onDocumentAdded,
}) {
  const icons = {
    PDF: FileType,
    URL: Globe,
    TEXT: FileText,
  };

  return (
    <Box sx={{ p: 2.5 }}>
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Database size={22} />

        <Typography variant="h6" fontWeight={700}>
          Knowledge Base
        </Typography>
      </Stack>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1, mb: 2 }}
      >
        Add documents to expand your assistant's knowledge.
      </Typography>

      <DocumentUpload onSuccess={onDocumentAdded} />

      <Divider sx={{ my: 3 }} />

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 1.5 }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          Session documents
        </Typography>

        <Chip label={documents.length} size="small" />
      </Stack>

      <Stack spacing={1}>
        {documents.length === 0 && (
          <Typography variant="body2" color="text.secondary">
            No documents added in this session.
            Previously ingested documents remain searchable.
          </Typography>
        )}

        {documents.map((doc) => {
          const Icon = icons[doc.type] || FileText;

          return (
            <Paper
              key={doc.id}
              variant="outlined"
              sx={{ p: 1.5, borderRadius: 2 }}
            >
              <Stack direction="row" spacing={1.5}>
                <Icon size={20} style={{ flexShrink: 0 }} />

                <Box sx={{ minWidth: 0 }}>
                  <Typography
                    variant="body2"
                    fontWeight={600}
                    sx={{ overflowWrap: "anywhere" }}
                  >
                    {doc.title}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {doc.type} · {doc.chunks} chunks
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Box>
  );
}