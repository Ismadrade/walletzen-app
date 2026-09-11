import Keycloak from "keycloak-js";

/**
 * Instância única do Keycloak. O client `walletzen-app` é público e usa
 * Authorization Code + PKCE — a inicialização fica no AuthProvider.
 */
const keycloak = new Keycloak({
  url: import.meta.env.VITE_KEYCLOAK_URL,
  realm: import.meta.env.VITE_KEYCLOAK_REALM,
  clientId: import.meta.env.VITE_KEYCLOAK_CLIENT_ID,
});

export default keycloak;
