import { useMemo } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme } from "@mui/material";

import { useTheme } from "../context/useTheme";

// o mesmo indigo da identidade (sidebar e tela de login do Keycloak);
// no escuro usamos o tom mais claro para manter contraste
const INDIGO_LIGHT = "#4f46e5";
const INDIGO_DARK = "#6366f1";

/**
 * Liga o tema do Material UI ao dark mode do app. Sem isso os componentes MUI
 * (`Paper`, `DataGrid`, `Dialog`, `Alert`) ficam sempre no tema claro, mesmo com
 * o resto da tela escuro — e o `primary` sairia no azul padrão do MUI.
 */
export function AppMuiTheme({ children }) {
  const { darkMode } = useTheme();

  const theme = useMemo(
    () => createTheme({
      palette: {
        mode: darkMode ? "dark" : "light",
        primary: { main: darkMode ? INDIGO_DARK : INDIGO_LIGHT },
      },
    }),
    [darkMode],
  );

  return <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>;
}
