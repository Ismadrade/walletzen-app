import { useEffect, useMemo, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [darkMode, setDark] = useState(false);

  // Espelha o estado na classe `dark` do <html> para as variantes `dark:` do
  // Tailwind seguirem o botão do app (e não a preferência do sistema).
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const value = useMemo(
    () => ({ darkMode, toggleDark: () => setDark((current) => !current) }),
    [darkMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
