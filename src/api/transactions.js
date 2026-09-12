import { request } from "./client";

/**
 * Transações ativas do usuário. O backend exige `year` sempre que `month` for
 * enviado; sem nenhum dos dois devolve o período inteiro. Parâmetros vazios são
 * descartados pelo client.
 */
export function listByUser(userId, { page = 0, size = 100, year, month } = {}) {
  return request(`/financial/transactions/user/${userId}`, {
    params: { page, size, year, month },
  });
}

/** O dono vem do token — `userId` não vai no corpo. */
export function create({ transactionType, amount, description }) {
  return request("/financial/transactions", {
    method: "POST",
    body: { transactionType, amount, description },
  });
}
