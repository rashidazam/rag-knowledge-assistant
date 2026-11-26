
import {
  Box,
  Avatar,
  Typography,
  Stack,
  Paper,
} from "@mui/material";

import { Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";

import SourceCard from "./SourceCard";

export default function ChatMessage({ message }) {
  const isUser = message.role === "user";

  return (
    <Stack
      direction="row"
      spacing={1.5}
      justifyContent={isUser ? "flex-end" : "flex-start"}
      alignItems="flex-start"
      sx={{ mb: 3 }}
    >
      {!isUser && (
        <Avatar sx={{ bgcolor: "primary.main" }}>
          <Bot size={22} />
        </Avatar>
      )}

      <Box
        sx={{
          maxWidth: { xs: "82%", md: "85%" },
          minWidth: 0,
        }}
      >
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: "block", mb: 0.5 }}
        >
          {isUser ? "You" : "Knowledge Assistant"}
        </Typography>

        <Paper
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            bgcolor: isUser ? "primary.main" : "background.paper",
            color: isUser ? "primary.contrastText" : "text.primary",
            border: isUser ? 0 : 1,
            borderColor: "divider",
            overflowWrap: "anywhere",
          }}
        >
          {isUser ? (
            <Typography sx={{ whiteSpace: "pre-wrap" }}>
              {message.content}
            </Typography>
          ) : (
            <Box className="markdown-content">
              <ReactMarkdown>{message.content}</ReactMarkdown>
            </Box>
          )}
        </Paper>

        {!isUser && message.sources?.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography
              variant="subtitle2"
              fontWeight={700}
              sx={{ mb: 1 }}
            >
              Retrieved sources ({message.sources.length})
            </Typography>

            <Stack spacing={1}>
              {message.sources.map((source) => (
                <SourceCard
                  key={source.sourceId}
                  source={source}
                />
              ))}
            </Stack>
          </Box>
        )}
      </Box>

      {isUser && (
        <Avatar sx={{ bgcolor: "action.selected" }}>
          <User size={20} />
        </Avatar>
      )}
    </Stack>
  );
}