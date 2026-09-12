import { request } from "./client";

/**
 * Uma página das transações ativas do usuário, filtradas pela data do lançamento.
 * O backend exige `year` sempre que `month` for enviado; sem nenhum dos dois devolve o
 * período inteiro. Parâmetros vazios são descartados pelo client.
 */
export function listByUser(userId, { page = 0, size = 10, year, month } = {}) {
  return request(`/financial/transactions/user/${userId}`, {
    params: { page, size, year, month },
  });
}

/**
 * Totais do período (`income`, `expense`, `balance`, `expenseCount`, `averageExpense`),
 * calculados no backend — valem para o período todo, não só para a página exibida.
 */
export function summaryByUser(userId, { year, month } = {}) {
  return request(`/financial/transactions/user/${userId}/summary`, {
    params: { year, month },
  });
}

/** O dono vem do token — `userId` não vai no corpo. `transactionDate` é `yyyy-MM-dd`. */
export function create({ transactionType, amount, description, transactionDate }) {
  return request("/financial/transactions", {
    method: "POST",
    body: { transactionType, amount, description, transactionDate },
  });
}

/** Mesmo corpo do `create`; o backend só aceita se quem chama for o dono (ou ADMIN). */
export function update(id, { transactionType, amount, description, transactionDate }) {
  return request(`/financial/transactions/${id}`, {
    method: "PUT",
    body: { transactionType, amount, description, transactionDate },
  });
}

/** Exclusão lógica no backend (`record_status = false`); responde 204. */
export function remove(id) {
  return request(`/financial/transactions/${id}`, { method: "DELETE" });
}
