import { useContext } from "react";
import { MeContext } from "./MeContext";

/**
 * Cadastro do usuário logado.
 * `status`: `ok` (tem `me`) · `no-wallet` (login sem linha em `wz_user`) · `error`.
 */
export function useMe() {
  return useContext(MeContext);
}
