
import { useEffect, useRef } from "react";

import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
  Alert,
  AlertTitle,
  Chip,
} from "@mui/material";

import {
  BrainCircuit,
  Sparkles,
  Database,
} from "lucide-react";

import ChatMessage from "./ChatMessage";

const suggestions = [
  "What is the difference between useMemo and useCallback?",
  "How can I improve React performance?",
  "When should I use Redux?",
  "What are React hooks?",
];

export default function ChatWindow({
  messages,
  loading,
  error,
  onAsk,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading, error]);

  return (
    <Box
      sx={{
        flex: 1,
        overflowY: "auto",
        minHeight: 0,
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ maxWidth: 900, mx: "auto" }}>
        {messages.length === 0 && (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2.5,
              pt: { xs: 2, md: 4 },
              pb: 4,
            }}
          >
            {/* Welcome icon */}
            <Box
              sx={{
                width: 88,
                height: 88,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "action.hover",
                borderRadius: 5,
                color: "primary.main",
                flexShrink: 0,
              }}
            >
              <BrainCircuit size={48} />
            </Box>

            <Chip
              label="RAG Knowledge Assistant · v1.0"
              size="small"
              color="primary"
              variant="outlined"
            />

            <Typography
              variant="h4"
              fontWeight={700}
              textAlign="center"
              sx={{
                fontSize: { xs: "1.7rem", md: "2.1rem" },
              }}
            >
              Chat with your knowledge
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
              sx={{ maxWidth: 600, lineHeight: 1.7 }}
            >
              Explore your knowledge base through semantic
              search and context-grounded AI answers.
            </Typography>

            {/* Strict RAG information */}
            <Alert
              severity="info"
              variant="outlined"
              icon={<Database size={22} />}
              sx={{
                width: "100%",
                maxWidth: 700,
                boxSizing: "border-box",
                borderRadius: 2,
                textAlign: "left",
                "& .MuiAlert-message": {
                  width: "100%",
                },
              }}
            >
              <AlertTitle sx={{ fontWeight: 700 }}>
                Strict RAG Mode — Knowledge Base Only
              </AlertTitle>

              <Typography
                variant="body2"
                sx={{ lineHeight: 1.8 }}
              >
                This is a foundational Retrieval-Augmented
                Generation application, not a general-purpose
                AI chatbot.
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 1, lineHeight: 1.8 }}
              >
                Gemini is used to generate answers from
                information retrieved from the vector database.
                The assistant is instructed to use only the
                retrieved document context.
              </Typography>

              <Typography
                variant="body2"
                sx={{ mt: 1, lineHeight: 1.8 }}
              >
                If sufficient information is not available in
                the knowledge base, the assistant is instructed
                to acknowledge that limitation instead of
                falling back to general LLM knowledge.
              </Typography>

              <Typography
                variant="caption"
                component="div"
                color="text.secondary"
                sx={{ mt: 1.5, lineHeight: 1.7 }}
              >
                General AI and automatic LLM fallback modes
                are planned for Version 2.
              </Typography>
            </Alert>

            {/* Suggested questions */}
            <Box
              sx={{
                width: "100%",
                maxWidth: 700,
              }}
            >
              <Typography
                variant="subtitle2"
                color="text.secondary"
                sx={{ mb: 1.5 }}
              >
                Try asking
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    md: "1fr 1fr",
                  },
                  gap: 1.5,
                  width: "100%",
                }}
              >
                {suggestions.map((question) => (
                  <Button
                    key={question}
                    variant="outlined"
                    disabled={loading}
                    startIcon={<Sparkles size={17} />}
                    onClick={() => onAsk(question)}
                    sx={{
                      p: 2,
                      minHeight: 64,
                      textAlign: "left",
                      justifyContent: "flex-start",
                      textTransform: "none",
                      borderColor: "divider",
                      color: "text.primary",
                      lineHeight: 1.6,
                      "&:hover": {
                        borderColor: "primary.main",
                        bgcolor: "action.hover",
                      },
                    }}
                  >
                    {question}
                  </Button>
                ))}
              </Box>
            </Box>
          </Box>
        )}

        {/* Chat messages */}
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}

        {/* Loading indicator */}
        {loading && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ py: 2 }}
          >
            <CircularProgress size={22} />

            <Typography
              variant="body2"
              color="text.secondary"
            >
              Retrieving relevant chunks and generating
              answer...
            </Typography>
          </Stack>
        )}

        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <div ref={bottomRef} />
      </Box>
    </Box>
  );
}
