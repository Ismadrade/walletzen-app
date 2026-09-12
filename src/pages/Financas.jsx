import { useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, IconButton, Paper, Tooltip, Typography,
  useTheme as useMuiTheme,
} from "@mui/material";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";

import { listByUser } from "../api/transactions";
import { useMe } from "../user/useMe";
import { formatCurrency, formatDate } from "../utils/format";
import PeriodFilter from "../components/financas/PeriodFilter";
import TransactionDialog from "../components/financas/TransactionDialog";
import DeleteTransactionDialog from "../components/financas/DeleteTransactionDialog";

const dataGridLocale = ptBR.components.MuiDataGrid.defaultProps.localeText;
const now = new Date();

// Estado dos modais: `key` muda a cada abertura para remontar o modal com o
// formulário limpo; ao fechar, só `open` vira false e a animação de saída acontece.
const CLOSED = { open: false, key: 0, transaction: null };
const opening = (transaction) => (state) => ({ open: true, key: state.key + 1, transaction });
const closing = (state) => ({ ...state, open: false });

export default function Financas() {
  const { me, status } = useMe();
  const theme = useMuiTheme();

  const [period, setPeriod] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [reloadToken, setReloadToken] = useState(0);
  const [data, setData] = useState({ key: null, error: null, rows: [] });
  const [editor, setEditor] = useState(CLOSED);
  const [removal, setRemoval] = useState(CLOSED);

  // `loading` é derivado: enquanto o resultado guardado não for o do pedido atual,
  // a tela está carregando. Evita setState sincrono dentro do efeito.
  const requestKey = `${me?.id}|${period.year}|${period.month}|${reloadToken}`;
  const loading = data.key !== requestKey;

  const reload = () => setReloadToken((token) => token + 1);

  useEffect(() => {
    if (!me?.id) return undefined;

    let cancelled = false;
    listByUser(me.id, { year: period.year, month: period.month })
      .then((page) => {
        if (!cancelled) setData({ key: requestKey, error: null, rows: page.content ?? [] });
      })
      .catch((error) => {
        if (!cancelled) setData({ key: requestKey, error, rows: [] });
      });

    return () => { cancelled = true; };
  }, [me?.id, period.year, period.month, requestKey]);

  const { total, averageExpense } = useMemo(() => {
    const expenses = data.rows.filter((row) => row.transactionType === "EXPENSE");
    return {
      total: data.rows.reduce(
        (acc, row) => (row.transactionType === "INCOME" ? acc + Number(row.amount) : acc - Number(row.amount)),
        0,
      ),
      averageExpense: expenses.length
        ? expenses.reduce((acc, row) => acc + Number(row.amount), 0) / expenses.length
        : 0,
    };
  }, [data.rows]);

  const columns = useMemo(() => [
    {
      field: "createdAt",
      headerName: "Data",
      width: 110,
      valueFormatter: (value) => formatDate(value),
    },
    { field: "description", headerName: "Descrição", flex: 1, minWidth: 160 },
    {
      field: "transactionType",
      headerName: "Tipo",
      width: 120,
      renderCell: ({ value }) => (
        <Chip
          size="small"
          variant="outlined"
          color={value === "INCOME" ? "success" : "error"}
          label={value === "INCOME" ? "Receita" : "Despesa"}
        />
      ),
    },
    {
      field: "amount",
      headerName: "Valor",
      width: 150,
      type: "number",
      align: "right",
      headerAlign: "right",
      // cores pelo tema, para funcionar no claro e no escuro
      renderCell: ({ value, row }) => (
        <span style={{
          color: row.transactionType === "INCOME"
            ? theme.palette.success.main
            : theme.palette.error.main,
          fontWeight: 500,
        }}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "",
      width: 100,
      display: "flex",
      align: "center",
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: ({ row }) => (
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip title="Editar">
            <IconButton
              size="small"
              aria-label="Editar lançamento"
              onClick={() => setEditor(opening(row))}
              sx={{ "&:hover": { color: "primary.main" } }}
            >
              <EditOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Excluir">
            <IconButton
              size="small"
              aria-label="Excluir lançamento"
              onClick={() => setRemoval(opening(row))}
              sx={{ "&:hover": { color: "error.main" } }}
            >
              <DeleteOutline fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ], [theme]);

  if (status === "no-wallet") {
    return (
      <Alert severity="info" sx={{ maxWidth: 720 }}>
        Este login não tem uma carteira no WalletZen. Crie um usuário pela API
        (<code>POST /users/</code>) e entre com ele para ver seus lançamentos.
      </Alert>
    );
  }

  if (status === "error") {
    return (
      <Alert severity="error" sx={{ maxWidth: 720 }}>
        Não foi possível carregar seu cadastro. Confira se o backend está no ar.
      </Alert>
    );
  }

  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column", gap: 2.5 }}>
      <Box sx={{
        display: "flex", gap: 2, flexWrap: "wrap",
        alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <PeriodFilter
          year={period.year}
          month={period.month}
          onChange={setPeriod}
          disabled={loading}
        />
        {/* ml:auto mantém o botão à direita mesmo quando quebra de linha */}
        <Button variant="contained" sx={{ ml: "auto", height: 40 }} onClick={() => setEditor(opening(null))}>
          Novo lançamento
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
        <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Total do período</Typography>
          <Typography variant="h6">{formatCurrency(total)}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">Média de gastos do período</Typography>
          <Typography variant="h6">{formatCurrency(averageExpense)}</Typography>
        </Paper>
      </Box>

      {data.error ? (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>Tentar de novo</Button>}>
          {data.error.message || "Não foi possível carregar os lançamentos."}
        </Alert>
      ) : loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          autoHeight
          density="compact"
          columnHeaderHeight={40}
          rowHeight={44}
          rows={data.rows}
          columns={columns}
          localeText={dataGridLocale}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          pageSizeOptions={[10, 25, 50]}
          disableRowSelectionOnClick
          sx={{ border: 0 }}
          slotProps={{ noRowsOverlay: {} }}
        />
      )}

      <TransactionDialog
        key={`editor-${editor.key}`}
        open={editor.open}
        transaction={editor.transaction}
        onClose={() => setEditor(closing)}
        onSaved={reload}
      />

      <DeleteTransactionDialog
        key={`removal-${removal.key}`}
        open={removal.open}
        transaction={removal.transaction}
        onClose={() => setRemoval(closing)}
        onDeleted={reload}
      />
    </Paper>
  );
}
