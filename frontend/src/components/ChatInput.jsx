
import { useState } from "react";

import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";

import { Send } from "lucide-react";

export default function ChatInput({ onSend, loading }) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (event) => {
    event?.preventDefault();

    if (!question.trim() || loading) return;

    onSend(question.trim());
    setQuestion("");
  };

  return (
    <Box sx={{ p: { xs: 1.5, md: 3 } }}>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "flex-end",
          gap: 1,
          p: 1.5,
          borderRadius: 3,
          maxWidth: 900,
          mx: "auto",
        }}
      >
        <TextField
          fullWidth
          multiline
          maxRows={6}
          variant="standard"
          placeholder="Ask anything about your documents..."
          value={question}
          disabled={loading}
          onChange={(e) => setQuestion(e.target.value)}
          slotProps={{
            input: {
              disableUnderline: true,
            },
          }}
          onKeyDown={(event) => {
            if (
              event.key === "Enter" &&
              !event.shiftKey &&
              !event.nativeEvent.isComposing
            ) {
              event.preventDefault();
              handleSubmit();
            }
          }}
        />

        <IconButton
          type="submit"
          aria-label="Send question"
          color="primary"
          disabled={loading || !question.trim()}
        >
          <Send size={22} />
        </IconButton>
      </Paper>

      <Typography
        variant="caption"
        color="text.secondary"
        textAlign="center"
        display="block"
        sx={{ mt: 1 }}
      >
        AI-generated answers may be inaccurate. Verify the sources.
      </Typography>
    </Box>
  );
}