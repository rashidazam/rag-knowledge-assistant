
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
  Database,
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
    setDocuments((previous) => [document, ...previous]);
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
          width: "100%",
          height: "100dvh",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          component="header"
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            boxSizing: "border-box",
            gap: { xs: 1, md: 3 },
            px: { xs: 1, md: 3 },
            py: 1.5,
            minHeight: 72,
            borderBottom: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            flexShrink: 0,
          }}
        >
          {/* Left section */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 1, md: 1.5 },
              flex: 1,
              minWidth: 0,
            }}
          >
            {isMobile && (
              <IconButton
                aria-label="Open knowledge base"
                onClick={() => setMobileOpen(true)}
                size="small"
              >
                <Menu size={22} />
              </IconButton>
            )}

            <BrainCircuit
              size={28}
              color={theme.palette.primary.main}
              style={{ flexShrink: 0 }}
            />

            <Box sx={{ minWidth: 0 }}>
              <Typography
                fontWeight={700}
                noWrap
                sx={{
                  fontSize: { xs: 14, md: 20 },
                  lineHeight: 1.4,
                }}
              >
                RAG Knowledge Assistant
              </Typography>

              {!isMobile && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Transformers.js · pgvector · Gemini
                </Typography>
              )}
            </Box>
          </Box>

          {/* Right section */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: { xs: 0.25, md: 1 },
              ml: "auto",
              flexShrink: 0,
            }}
          >
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
                sx={{ mr: 1 }}
              />
            )}

            <Tooltip title="Check backend connection">
              <IconButton
                aria-label="Check backend connection"
                onClick={verifyBackend}
                size={isMobile ? "small" : "medium"}
              >
                <RefreshCw size={19} />
              </IconButton>
            </Tooltip>

            <Tooltip title="New chat">
              <Box
                component="span"
                sx={{ display: "inline-flex" }}
              >
                <IconButton
                  aria-label="New chat"
                  onClick={handleClearChat}
                  disabled={loading}
                  size={isMobile ? "small" : "medium"}
                >
                  <MessageSquarePlus size={21} />
                </IconButton>
              </Box>
            </Tooltip>

            <Tooltip title="Toggle theme">
              <IconButton
                aria-label="Toggle theme"
                size={isMobile ? "small" : "medium"}
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
          </Box>
        </Box>

        {/* Main layout */}
        <Box
          sx={{
            display: "flex",
            flex: 1,
            minHeight: 0,
            minWidth: 0,
          }}
        >
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
                overflowY: "auto",
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

            {/* Persistent RAG mode indicator */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                px: 2,
                pt: 1,
                flexShrink: 0,
              }}
            >
              <Tooltip title="Answers are intended to use retrieved document context only. General knowledge fallback is disabled.">
                <Chip
                  icon={<Database size={14} />}
                  label="Strict RAG · Knowledge Base Only"
                  size="small"
                  variant="outlined"
                  color="primary"
                  sx={{ fontSize: "0.7rem" }}
                />
              </Tooltip>
            </Box>

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
