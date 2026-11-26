
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
  Layers,
  Rocket,
  CheckCircle2,
} from "lucide-react";

import DocumentUpload from "./DocumentUpload";

const upcomingFeatures = [
  "Advanced chunking strategies",
  "Document management and metadata",
  "Hybrid search and metadata filtering",
  "Reranking and relevance optimization",
  "Conversational RAG and chat history",
  "General AI and automatic LLM fallback",
  "RAG evaluation and observability",
  "Performance and security improvements",
  "Extended MCP capabilities",
];

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
      {/* Knowledge base */}
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

      {/* Session documents */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1,
          mb: 1.5,
        }}
      >
        <Typography variant="subtitle2" fontWeight={700}>
          Session documents
        </Typography>

        <Chip label={documents.length} size="small" />
      </Box>

      <Stack spacing={1}>
        {documents.length === 0 && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ lineHeight: 1.7 }}
          >
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

      <Divider sx={{ my: 3 }} />

      {/* Version 1 information */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mb: 1.5,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Layers size={19} />

            <Typography
              variant="subtitle2"
              fontWeight={700}
            >
              About this project
            </Typography>
          </Box>

          <Chip
            label="v1.0"
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        <Typography
          variant="subtitle2"
          color="primary.main"
          fontWeight={700}
          sx={{ mb: 1 }}
        >
          Version 1 — Base Version
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ lineHeight: 1.7, mb: 2 }}
        >
          A foundational Retrieval-Augmented Generation
          application built from scratch without high-level
          RAG frameworks.
        </Typography>

        {[
          "Local embedding generation",
          "Semantic vector search",
          "Context-grounded answers",
          "MCP server integration",
        ].map((feature) => (
          <Box
            key={feature}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 0.8,
            }}
          >
            <CheckCircle2
              size={14}
              color="#22c55e"
              style={{ flexShrink: 0 }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
            >
              {feature}
            </Typography>
          </Box>
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Version 2 roadmap */}
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            mb: 1.5,
          }}
        >
          <Rocket size={19} />

          <Typography
            variant="subtitle2"
            fontWeight={700}
          >
            Coming in Version 2
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1.5, lineHeight: 1.7 }}
        >
          The next version will focus on advanced RAG
          techniques and production-ready AI engineering.
        </Typography>

        {upcomingFeatures.map((feature) => (
          <Box
            key={feature}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 1.2,
              mb: 1,
            }}
          >
            <Box
              sx={{
                width: 5,
                height: 5,
                mt: "7px",
                borderRadius: "50%",
                bgcolor: "primary.main",
                flexShrink: 0,
              }}
            />

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ lineHeight: 1.6 }}
            >
              {feature}
            </Typography>
          </Box>
        ))}

        <Chip
          label="Planned for v2.0"
          size="small"
          variant="outlined"
          sx={{ mt: 1 }}
        />
      </Box>
    </Box>
  );
}
