
import { useEffect, useRef } from "react";

import {
  Box,
  Typography,
  Stack,
  CircularProgress,
  Button,
  Alert,
} from "@mui/material";

import { BrainCircuit, Sparkles } from "lucide-react";

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
          <Stack
            alignItems="center"
            spacing={2.5}
            sx={{ pt: { xs: 3, md: 8 }, pb: 4 }}
          >
            <Box
              sx={{
                p: 3,
                bgcolor: "action.hover",
                borderRadius: 5,
                color: "primary.main",
              }}
            >
              <BrainCircuit size={48} />
            </Box>

            <Typography
              variant="h4"
              fontWeight={700}
              textAlign="center"
            >
              Chat with your knowledge
            </Typography>

            <Typography
              color="text.secondary"
              textAlign="center"
              maxWidth={500}
            >
              Upload PDFs, ingest webpages or add text.
              Ask questions and get answers grounded in your
              knowledge base.
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
                maxWidth: 650,
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
                    textAlign: "left",
                    justifyContent: "flex-start",
                    textTransform: "none",
                    borderColor: "divider",
                    color: "text.primary",
                  }}
                >
                  {question}
                </Button>
              ))}
            </Box>
          </Stack>
        )}

        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}

        {loading && (
          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
            sx={{ py: 2 }}
          >
            <CircularProgress size={22} />

            <Typography variant="body2" color="text.secondary">
              Retrieving relevant chunks and generating answer...
            </Typography>
          </Stack>
        )}

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