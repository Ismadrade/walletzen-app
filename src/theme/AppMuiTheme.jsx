import { useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";

import { useTheme } from "../context/useTheme";

/**
 * Liga o tema do Material UI ao dark mode do app. Sem isso os componentes MUI
 * (`Paper`, `DataGrid`, `Dialog`, `Alert`) ficam sempre no tema claro, mesmo com
 * o resto da tela escuro.
 */
export function AppMuiTheme({ children }) {
  const { darkMode } = useTheme();

  const theme = useMemo(
    () => createTheme({ palette: { mode: darkMode ? "dark" : "light" } }),
    [darkMode],
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
