import { request } from "./client";

/**
 * Cadastro do usuário logado (`wz-user`). O backend resolve quem é pelo token.
 * `404` = o login não tem uma linha em `wz_user` (usuários seed do realm).
 */
export function fetchCurrentUser() {
  return request("/users/me");
}
