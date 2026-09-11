import { Box, CircularProgress, Typography } from "@mui/material";

/** Ocupa a tela enquanto um provider ainda não tem o que renderizar. */
export default function FullScreenLoader({ label }) {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 2,
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <CircularProgress />
      {label && <Typography variant="body2">{label}</Typography>}
    </Box>
  );
}
