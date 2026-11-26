
import { useEffect, useMemo, useRef, useState } from "react";

import {
  Box,
  Typography,
  Stack,
  IconButton,
  Chip,
  Drawer,
  Tooltip,
  ThemeProvider,
  createTheme,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";

import {
  BrainCircuit,
  Menu,
  Moon,
  Sun,
  MessageSquarePlus,
  RefreshCw,
} from "lucide-react";

import ChatWindow from "./components/ChatWindow";
import ChatInput from "./components/ChatInput";
import Sidebar from "./components/Sidebar";

import {
  askQuestion,
  checkHealth,
  getErrorMessage,
} from "./api/ragApi";

const SIDEBAR_WIDTH = 340;

export default function App() {
  const [mode, setMode] = useState("dark");
  const [documents, setDocuments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("checking");
  const [mobileOpen, setMobileOpen] = useState(false);

  const requestInProgress = useRef(false);

  const isMobile = useMediaQuery("(max-width: 900px)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: mode === "dark" ? "#818cf8" : "#4f46e5",
          },
          background: {
            default: mode === "dark" ? "#0f1117" : "#f8fafc",
            paper: mode === "dark" ? "#181b24" : "#ffffff",
          },
        },
        shape: {
          borderRadius: 12,
        },
        typography: {
          fontFamily: "Inter, system-ui, sans-serif",
          button: {
            textTransform: "none",
            fontWeight: 600,
          },
        },
      }),
    [mode]
  );

  const verifyBackend = async () => {
    setStatus("checking");

    try {
      await checkHealth();
      setStatus("connected");
    } catch {
      setStatus("disconnected");
    }
  };

  useEffect(() => {
    verifyBackend();
  }, []);

  const handleDocumentAdded = (document) => {
    setDocuments((previous) => [
      document,
      ...previous,
    ]);
  };

  const handleAsk = async (question) => {
    if (requestInProgress.current || !question.trim()) return;

    requestInProgress.current = true;
    setError("");
    setLoading(true);

    setMessages((previous) => [
      ...previous,
      {
        id: crypto.randomUUID(),
        role: "user",
        content: question,
      },
    ]);

    try {
      const result = await askQuestion(question);

      setMessages((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: result.answer,
          sources: result.sources || [],
        },
      ]);
    } catch (error) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
      requestInProgress.current = false;
    }
  };

  const handleClearChat = () => {
    if (requestInProgress.current) return;

    setMessages([]);
    setError("");
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            px: { xs: 1.5, md: 3 },
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            flexShrink: 0,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5}>
            {isMobile && (
              <IconButton
                aria-label="Open knowledge base"
                onClick={() => setMobileOpen(true)}
              >
                <Menu size={22} />
              </IconButton>
            )}

            <BrainCircuit size={28} color={theme.palette.primary.main} />

            <Box>
              <Typography
                fontWeight={700}
                sx={{ fontSize: { xs: 15, md: 20 } }}
              >
                RAG Knowledge Assistant
              </Typography>

              {!isMobile && (
                <Typography variant="caption" color="text.secondary">
                  Transformers.js · pgvector · Gemini
                </Typography>
              )}
            </Box>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={0.5}>
            {!isMobile && (
              <Chip
                size="small"
                label={
                  status === "connected"
                    ? "API connected"
                    : status === "checking"
                    ? "Connecting"
                    : "Disconnected"
                }
                color={
                  status === "connected"
                    ? "success"
                    : status === "disconnected"
                    ? "error"
                    : "default"
                }
                variant="outlined"
              />
            )}

            <Tooltip title="Check backend connection">
              <IconButton
                aria-label="Check backend connection"
                onClick={verifyBackend}
              >
                <RefreshCw size={18} />
              </IconButton>
            </Tooltip>

            <Tooltip title="New chat">
              <span>
                <IconButton
                  aria-label="New chat"
                  onClick={handleClearChat}
                  disabled={loading}
                >
                  <MessageSquarePlus size={21} />
                </IconButton>
              </span>
            </Tooltip>

            <Tooltip title="Toggle theme">
              <IconButton
                aria-label="Toggle theme"
                onClick={() =>
                  setMode((previous) =>
                    previous === "dark" ? "light" : "dark"
                  )
                }
              >
                {mode === "dark" ? (
                  <Sun size={21} />
                ) : (
                  <Moon size={21} />
                )}
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>

        {/* Main layout */}
        <Box sx={{ display: "flex", flex: 1, minHeight: 0 }}>
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={() => setMobileOpen(false)}
            sx={{
              width: isMobile ? 0 : SIDEBAR_WIDTH,
              flexShrink: 0,
              "& .MuiDrawer-paper": {
                width: SIDEBAR_WIDTH,
                maxWidth: "90vw",
                boxSizing: "border-box",
                position: isMobile ? "fixed" : "relative",
                height: "100%",
                bgcolor: "background.paper",
              },
            }}
          >
            <Sidebar
              documents={documents}
              onDocumentAdded={handleDocumentAdded}
            />
          </Drawer>

          <Box
            component="main"
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              minWidth: 0,
              minHeight: 0,
            }}
          >
            <ChatWindow
              messages={messages}
              loading={loading}
              error={error}
              onAsk={handleAsk}
            />

            <ChatInput
              onSend={handleAsk}
              loading={loading}
            />
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}