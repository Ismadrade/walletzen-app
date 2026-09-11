import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Alert, Box, Button } from "@mui/material";

import keycloak from "./keycloak";
import { AuthContext } from "./AuthContext";
import { configureApi } from "../api/client";
import FullScreenLoader from "../components/feedback/FullScreenLoader";

/** De quanto em quanto tempo tentamos renovar o token. */
const REFRESH_INTERVAL_MS = 20_000;
/** Renova se faltar menos que isso para expirar. */
const MIN_VALIDITY_SECONDS = 30;

/**
 * Exige login no Keycloak (Authorization Code + PKCE) antes de renderizar o app
 * e mantém o token renovado. Também liga a camada de API ao token atual.
 */
export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [claims, setClaims] = useState(null);
  // StrictMode monta o efeito duas vezes; keycloak.init() só pode rodar uma.
  const initStarted = useRef(false);

  const logout = useCallback(
    () => keycloak.logout({ redirectUri: window.location.origin }),
    [],
  );

  useEffect(() => {
    if (initStarted.current) return;
    initStarted.current = true;

    keycloak
      .init({
        onLoad: "login-required",
        pkceMethod: "S256",
        // o iframe de checagem de sessão quebra em localhost (cookies de terceiros)
        checkLoginIframe: false,
      })
      .then((authenticated) => {
        if (!authenticated) {
          keycloak.login();
          return;
        }
        configureApi({
          getToken: () => keycloak.token,
          onUnauthorized: () => keycloak.login(),
        });
        setClaims(keycloak.tokenParsed);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (status !== "ready") return undefined;

    const timer = setInterval(() => {
      keycloak
        .updateToken(MIN_VALIDITY_SECONDS)
        .then((refreshed) => {
          if (refreshed) setClaims(keycloak.tokenParsed);
        })
        .catch(() => keycloak.login());
    }, REFRESH_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [status]);

  const value = useMemo(
    () => ({
      claims,
      roles: claims?.realm_access?.roles ?? [],
      logout,
    }),
    [claims, logout],
  );

  if (status === "loading") return <FullScreenLoader label="Autenticando…" />;

  if (status === "error") {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 3 }}>
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => window.location.reload()}>
              Tentar de novo
            </Button>
          }
        >
          Não foi possível falar com o Keycloak em {import.meta.env.VITE_KEYCLOAK_URL}.
          Confira se o backend está no ar (<code>docker compose up -d</code>).
        </Alert>
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
