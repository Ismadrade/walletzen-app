# WalletZen — App (Frontend)

SPA da aplicação **WalletZen** (gestão de finanças pessoais). Exibe as transações
financeiras do usuário com totais e média de gastos.

> **Status:** projeto de estudo. O app exige **login no Keycloak** e a tela de
> Finanças já consome a API de transações pelo gateway (listar por período e
> criar lançamento). O backend fica no repositório
> [`walletzen`](https://github.com/Ismadrade/walletzen).

---

## Stack

React 19 · Vite 7 · React Router 7 · Material UI 7 (`@mui/material`,
`@mui/icons-material`, `@mui/x-data-grid`) · Tailwind CSS 4 · `keycloak-js` 26 ·
ESLint 9.

---

## Estrutura

```
src/
├── main.jsx                # bootstrap: ThemeProvider → AppMuiTheme → AuthProvider → MeProvider → App
├── App.jsx                 # layout (SideNav + Navbar + PageHeader) e rotas
├── auth/
│   ├── keycloak.js         # instância keycloak-js (config via VITE_*)
│   ├── AuthProvider.jsx    # exige login (Authorization Code + PKCE) e renova o token
│   ├── AuthContext.js
│   └── useAuth.js          # { claims, roles, logout }
├── api/
│   ├── client.js           # fetch com Bearer automático; ApiError { status, message }
│   ├── users.js            # GET /users/me
│   └── transactions.js     # listar por período e criar lançamento
├── user/
│   ├── MeProvider.jsx      # carrega o cadastro do logado
│   ├── MeContext.js
│   └── useMe.js            # { status: ok | no-wallet | error, me }
├── theme/
│   └── AppMuiTheme.jsx     # tema do MUI seguindo o dark mode do app
├── pages/
│   ├── Dashboard.jsx       # placeholder (relatórios, fase seguinte)
│   └── Financas.jsx        # lançamentos do período + cartões Total / Média de gastos
├── components/
│   ├── financas/           # PeriodFilter e NewTransactionDialog
│   ├── sidenav/            # navegação lateral (usuário logado, dark mode, sair)
│   ├── navbar/             # barra superior
│   ├── pageheader/         # título da página conforme a rota
│   └── feedback/           # FullScreenLoader
├── context/
│   ├── ThemeProvider.jsx   # dark mode (também aplica a classe `dark` no <html>)
│   ├── ThemeContext.js
│   └── useTheme.js
├── config/
│   └── pageTitles.js       # mapa rota → título exibido no PageHeader
└── utils/
    └── format.js           # moeda e data em pt-BR
```

### Rotas

| Caminho      | Componente  | Conteúdo |
| ------------ | ----------- | -------- |
| `/`          | —           | Redireciona para `/financas` |
| `/dashboard` | `Dashboard` | Placeholder (relatórios) |
| `/financas`  | `Financas`  | Lançamentos do usuário logado (`GET /financial/transactions/user/{id}`) com filtro de **mês/ano**, cartões de **Total** e **Média de gastos do período** e cadastro de novo lançamento. Valores e datas em `pt-BR` / `BRL`. |

---

## Autenticação

O app inteiro fica atrás do login: o `AuthProvider` chama
`keycloak.init({ onLoad: "login-required", pkceMethod: "S256" })`, então abrir
qualquer rota redireciona para o Keycloak e volta autenticado. O token é renovado
em background e vai automaticamente no header `Authorization` de toda chamada
feita pelo `src/api/client.js`.

Depois do login, o `MeProvider` busca `GET /users/me` no `wz-user`:

| Resultado | `status` | O que significa |
| --------- | -------- | --------------- |
| `200`     | `ok`     | usuário tem cadastro; `me` traz `id`, `name`, `cpf`, `email`, `birthDate` |
| `404`     | `no-wallet` | o login não tem linha em `wz_user` — é o caso dos usuários seed do realm (`alice`, `admin`) |
| outro     | `error`  | falha inesperada na API |

> Para ver dados de verdade, logue com um usuário **criado pela API**
> (`POST /users/`) — o `wz-financial` identifica o dono do lançamento pelo
> `wz_user.id`, que os usuários seed não têm.

---

## Tela de Finanças

- **Filtro de período** — ano e mês, começando no mês corrente. O backend exige
  `year` sempre que `month` é enviado, então o campo de mês fica desabilitado
  enquanto o ano estiver em "Todos".
- **Cartões** — Total (receitas − despesas) e Média de gastos, calculados sobre
  o período filtrado.
- **Novo lançamento** — `POST /financial/transactions` sem `userId` no corpo: o
  backend resolve o dono pelo token. Os erros viram mensagem legível (`422` dono
  inválido, `503` serviço de usuários fora, `400` validação).
- A cor de receita/despesa vem da paleta do tema, para funcionar no claro e no escuro.

> Paginação e exclusão ainda não estão na tela: a listagem busca até 100 registros
> do período e pagina no cliente.

---

## Variáveis de ambiente

Copie `.env.example` para `.env` (git-ignored) e ajuste se precisar:

| Variável | Padrão | Descrição |
| -------- | ------ | --------- |
| `VITE_API_BASE_URL` | `http://localhost:8765` | Gateway — todas as chamadas de API passam por aqui |
| `VITE_KEYCLOAK_URL` | `http://localhost:8080` | Keycloak |
| `VITE_KEYCLOAK_REALM` | `walletzen` | Realm |
| `VITE_KEYCLOAK_CLIENT_ID` | `walletzen-app` | Client público (Authorization Code + PKCE) |

---

## Scripts

| Comando           | Ação |
| ----------------- | ---- |
| `npm run dev`     | Servidor de desenvolvimento Vite (HMR) |
| `npm run build`   | Build de produção |
| `npm run preview` | Serve o build gerado |
| `npm run lint`    | ESLint |

---

## Como rodar localmente

### Pré-requisitos

Node.js 18+ e o **backend no ar** — sem ele não há Keycloak para autenticar.

```bash
# 1. backend (no repositório walletzen)
cd ../../Backend && docker compose up -d

# 2. frontend
cp .env.example .env
npm install
npm run dev
```

O Vite sobe em `http://localhost:5173` e o app redireciona para a tela de login do
Keycloak. O gateway já libera CORS para essa origem (`FRONTEND_ORIGIN`).
