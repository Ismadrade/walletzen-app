const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Erro de API com o status HTTP e a mensagem devolvida pelo backend
 * (corpo `{ "date": ..., "message": ... }` do `ExceptionResponse`).
 */
export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Injetados pelo AuthProvider — evita que a camada de API dependa do Keycloak.
let getToken = () => null;
let onUnauthorized = () => {};

export function configureApi(handlers) {
  getToken = handlers.getToken ?? getToken;
  onUnauthorized = handlers.onUnauthorized ?? onUnauthorized;
}

function buildUrl(path, params) {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url;
}

async function readErrorMessage(response) {
  try {
    const body = await response.json();
    if (body?.message) return body.message;
  } catch {
    // corpo vazio ou não-JSON: cai no texto padrão
  }
  return `Erro ${response.status}`;
}

/**
 * Chamada à API pelo gateway, já com o Bearer do usuário logado.
 * `401` dispara o re-login (sessão expirou de vez) além de lançar o erro.
 */
export async function request(path, { method = "GET", body, params } = {}) {
  const headers = { Accept: "application/json" };

  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body !== undefined) headers["Content-Type"] = "application/json";

  const response = await fetch(buildUrl(path, params), {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401) {
    onUnauthorized();
    throw new ApiError(401, "Sessão expirada");
  }
  if (!response.ok) {
    throw new ApiError(response.status, await readErrorMessage(response));
  }
  if (response.status === 204) return null;

  return response.json();
}
