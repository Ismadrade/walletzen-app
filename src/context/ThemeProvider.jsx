import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";

// Mesma chave lida pelo script inline do index.html (aplica o tema antes do React subir).
const STORAGE_KEY = "walletzen:theme";

function readStoredDarkMode() {
  try {
    return localStorage.getItem(STORAGE_KEY) === "dark";
  } catch {
    // storage bloqueado (navegação privada restrita, cookies desativados): segue no claro
    return false;
  }
}

export function ThemeProvider({ children }) {
  const [darkMode, setDark] = useState(readStoredDarkMode);

  // Espelha o estado na classe `dark` do <html> para as variantes `dark:` do
  // Tailwind seguirem o botão do app (e não a preferência do sistema), e guarda
  // a escolha para sobreviver ao reload.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    try {
      localStorage.setItem(STORAGE_KEY, darkMode ? "dark" : "light");
    } catch {
      // sem storage o tema só não fica salvo
    }
  }, [darkMode]);

  const value = useMemo(
    () => ({ darkMode, toggleDark: () => setDark((current) => !current) }),
    [darkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
