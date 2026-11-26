
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  LinearProgress,
  Stack,
  Chip,
} from "@mui/material";

import { ChevronDown, FileText } from "lucide-react";

export default function SourceCard({ source }) {
  const similarity = Number(source.similarity);
  const validScore = Number.isFinite(similarity);

  const progress = validScore
    ? Math.max(0, Math.min(100, similarity * 100))
    : 0;

  const color =
    similarity >= 0.6
      ? "success"
      : similarity >= 0.3
      ? "warning"
      : "inherit";

  return (
    <Accordion
      disableGutters
      elevation={0}
      sx={{
        border: 1,
        borderColor: "divider",
        borderRadius: "10px !important",
        overflow: "hidden",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={<ChevronDown size={18} />}>
        <Stack spacing={1} sx={{ width: "100%", pr: 1 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <FileText size={16} />

            <Typography
              variant="body2"
              fontWeight={600}
              sx={{ overflowWrap: "anywhere" }}
            >
              {source.document}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Chip
              label={`Source ${source.sourceId}`}
              size="small"
              variant="outlined"
            />

            <Typography variant="caption">
              Similarity:{" "}
              {validScore ? similarity.toFixed(4) : "N/A"}
            </Typography>
          </Stack>

          <LinearProgress
            variant="determinate"
            value={progress}
            color={color}
            sx={{ height: 5, borderRadius: 3 }}
          />
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <Box
          sx={{
            bgcolor: "action.hover",
            p: 2,
            borderRadius: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              whiteSpace: "pre-wrap",
              overflowWrap: "anywhere",
              lineHeight: 1.8,
            }}
          >
            {source.content}
          </Typography>
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}