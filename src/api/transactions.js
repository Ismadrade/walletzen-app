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

/** Mesmo corpo do `create`; o backend só aceita se quem chama for o dono (ou ADMIN). */
export function update(id, { transactionType, amount, description }) {
  return request(`/financial/transactions/${id}`, {
    method: "PUT",
    body: { transactionType, amount, description },
  });
}

/** Exclusão lógica no backend (`record_status = false`); responde 204. */
export function remove(id) {
  return request(`/financial/transactions/${id}`, { method: "DELETE" });
}
