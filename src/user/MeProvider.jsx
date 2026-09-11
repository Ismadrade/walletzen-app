import { useEffect, useState } from "react";

import { MeContext } from "./MeContext";
import { fetchCurrentUser } from "../api/users";
import FullScreenLoader from "../components/feedback/FullScreenLoader";

const LOADING = { status: "loading", me: null, error: null };

/**
 * Carrega `GET /users/me` uma vez, depois do login. O `wz-user` devolve `404`
 * quando o login não tem cadastro (usuários seed do realm, como `alice`) — nesse
 * caso o app segue funcionando com `status: "no-wallet"`.
 */
export function MeProvider({ children }) {
  const [state, setState] = useState(LOADING);

  useEffect(() => {
    let cancelled = false;

    fetchCurrentUser()
      .then((me) => {
        if (!cancelled) setState({ status: "ok", me, error: null });
      })
      .catch((error) => {
        if (cancelled) return;
        setState(
          error.status === 404
            ? { status: "no-wallet", me: null, error: null }
            : { status: "error", me: null, error },
        );
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state.status === "loading") {
    return <FullScreenLoader label="Carregando seu cadastro…" />;
  }

  return <MeContext.Provider value={state}>{children}</MeContext.Provider>;
}
