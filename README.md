# WalletZen — App (Frontend)

SPA da aplicação **WalletZen** (gestão de finanças pessoais). Exibe as transações
financeiras do usuário com totais e média de gastos.

> **Status:** projeto de estudo. As telas ainda usam dados fixos (mock) e **não
> estão integradas** ao backend. O backend fica no repositório
> [`walletzen`](https://github.com/Ismadrade/walletzen).

---

## Stack

React 19 · Vite 7 · React Router 7 · Material UI 7 (`@mui/material`,
`@mui/icons-material`, `@mui/x-data-grid`) · Tailwind CSS 4 · ESLint 9.

---

## Estrutura

```
src/
├── main.jsx                # bootstrap React + ThemeProvider
├── App.jsx                 # layout (SideNav + Navbar + PageHeader) e rotas
├── pages/
│   ├── Home.jsx            # placeholder
│   ├── Dashboard.jsx       # placeholder
│   └── Financas.jsx        # DataGrid de transações + cartões Total / Média de gastos
├── components/
│   ├── sidenav/            # navegação lateral
│   ├── navbar/             # barra superior
│   └── pageheader/         # título da página conforme a rota
├── context/
│   ├── ThemeProvider.jsx   # provider de tema
│   ├── ThemeContext.js
│   └── useTheme.js         # hook de acesso ao tema
└── config/
    └── pageTitles.js       # mapa rota → título exibido no PageHeader
```

### Rotas

| Caminho      | Componente  | Conteúdo |
| ------------ | ----------- | -------- |
| `/`          | `Home`      | Placeholder |
| `/dashboard` | `Dashboard` | Placeholder |
| `/financas`  | `Financas`  | Tabela de transações (`DataGrid`) com cartões de **Total** e **Média de gastos**. Valores em `pt-BR` / `BRL`. Linhas ainda definidas no próprio arquivo. |

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

Node.js 18+.

```bash
npm install
npm run dev
```

O Vite sobe por padrão em `http://localhost:5173`.
