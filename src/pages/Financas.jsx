import { useEffect, useMemo, useState } from "react";
import {
  Alert, Box, Button, Chip, IconButton, Paper, Tooltip, Typography,
  useMediaQuery, useTheme as useMuiTheme,
} from "@mui/material";
import { DeleteOutline, EditOutlined } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { ptBR } from "@mui/x-data-grid/locales";

import { listByUser, summaryByUser } from "../api/transactions";
import { useMe } from "../user/useMe";
import { useToast } from "../toast/useToast";
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

/** A data "yyyy-MM-dd" cai dentro do período filtrado? Ano/mês vazios = "Todos". */
function isInPeriod(isoDate, { year, month }) {
  if (!isoDate || year === "") return true;
  const [dateYear, dateMonth] = isoDate.split("-").map(Number);
  return dateYear === Number(year) && (month === "" || dateMonth === Number(month));
}

export default function Financas() {
  const { me, status } = useMe();
  const toast = useToast();
  const theme = useMuiTheme();
  // no celular a coluna Tipo sai: a cor do valor já diz se é receita ou despesa
  const compact = useMediaQuery(theme.breakpoints.down("sm"));

  const [period, setPeriod] = useState({ year: now.getFullYear(), month: now.getMonth() + 1 });
  const [pagination, setPagination] = useState({ page: 0, pageSize: 10 });
  const [reloadToken, setReloadToken] = useState(0);
  const [list, setList] = useState({ key: null, error: null, rows: [], total: 0 });
  const [summary, setSummary] = useState({ key: null, error: null, value: null });
  const [editor, setEditor] = useState(CLOSED);
  const [removal, setRemoval] = useState(CLOSED);

  // `loading` é derivado: enquanto o resultado guardado não for o do pedido atual,
  // a tela está carregando. Evita setState sincrono dentro do efeito.
  // Os totais dependem só do período; a lista, também da página.
  const periodKey = `${me?.id}|${period.year}|${period.month}|${reloadToken}`;
  const listKey = `${periodKey}|${pagination.page}|${pagination.pageSize}`;
  const listLoading = list.key !== listKey;
  const summaryLoading = summary.key !== periodKey;

  const reload = () => setReloadToken((token) => token + 1);

  // outro período = outra lista: volta para a primeira página
  const changePeriod = (next) => {
    setPeriod(next);
    setPagination((current) => ({ ...current, page: 0 }));
  };

  const handleSaved = ({ transaction, created }) => {
    reload();
    const verb = created ? "criado" : "atualizado";
    // se a data escolhida está fora do filtro, a linha não aparece — o aviso explica o porquê
    toast.success(isInPeriod(transaction?.transactionDate, period)
      ? `Lançamento ${verb} com sucesso.`
      : `Lançamento ${verb} em ${formatDate(transaction.transactionDate)}, fora do período filtrado.`);
  };

  const handleDeleted = () => {
    reload();
    toast.success("Lançamento excluído com sucesso.");
  };

  useEffect(() => {
    if (!me?.id) return undefined;

    let cancelled = false;
    listByUser(me.id, {
      year: period.year, month: period.month, page: pagination.page, size: pagination.pageSize,
    })
      .then((page) => {
        if (cancelled) return;
        const rows = page.content ?? [];
        // a última linha da página foi excluída: volta uma página em vez de mostrar uma vazia
        if (rows.length === 0 && pagination.page > 0) {
          setPagination((current) => ({ ...current, page: current.page - 1 }));
          return;
        }
        setList({ key: listKey, error: null, rows, total: page.totalElements ?? 0 });
      })
      .catch((error) => {
        if (!cancelled) setList({ key: listKey, error, rows: [], total: 0 });
      });

    return () => { cancelled = true; };
  }, [me?.id, period.year, period.month, pagination.page, pagination.pageSize, listKey]);

  useEffect(() => {
    if (!me?.id) return undefined;

    let cancelled = false;
    summaryByUser(me.id, { year: period.year, month: period.month })
      .then((value) => {
        if (!cancelled) setSummary({ key: periodKey, error: null, value });
      })
      .catch((error) => {
        if (!cancelled) setSummary({ key: periodKey, error, value: null });
      });

    return () => { cancelled = true; };
  }, [me?.id, period.year, period.month, periodKey]);

  const columns = useMemo(() => [
    {
      field: "transactionDate",
      headerName: "Data",
      width: compact ? 96 : 110,
      valueFormatter: (value) => formatDate(value),
    },
    { field: "description", headerName: "Descrição", flex: 1, minWidth: compact ? 120 : 160 },
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
      width: compact ? 120 : 150,
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
      width: 96,
      display: "flex",
      align: "center",
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
    // ordenar/filtrar pelo menu da coluna só agiria na página carregada — enganoso com
    // paginação no servidor, que já ordena por data (mais recente primeiro)
  ].map((column) => ({ ...column, sortable: false, filterable: false, disableColumnMenu: true })), [theme, compact]);

  const summaryText = (field) => {
    if (summary.error) return "Indisponível";
    return summary.value ? formatCurrency(summary.value[field]) : "—";
  };

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
    <Paper sx={{ p: { xs: 2, md: 3 }, display: "flex", flexDirection: "column", gap: 2.5, minWidth: 0 }}>
      <Box sx={{
        display: "flex", gap: 2, flexWrap: "wrap",
        alignItems: "flex-start", justifyContent: "space-between",
      }}>
        <PeriodFilter
          year={period.year}
          month={period.month}
          onChange={changePeriod}
          disabled={listLoading}
        />
        {/* ml:auto mantém o botão à direita mesmo quando quebra de linha */}
        <Button variant="contained" sx={{ ml: "auto", height: 40 }} onClick={() => setEditor(opening(null))}>
          Novo lançamento
        </Button>
      </Box>

      <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
        {/* enquanto recarrega, mantém os números anteriores esmaecidos em vez de piscar */}
        <Paper variant="outlined" sx={{ flex: 1, p: 2, opacity: summaryLoading ? 0.6 : 1, transition: "opacity .2s" }}>
          <Typography variant="subtitle2" color="text.secondary">Total do período</Typography>
          <Typography variant="h6">{summaryText("balance")}</Typography>
        </Paper>
        <Paper variant="outlined" sx={{ flex: 1, p: 2, opacity: summaryLoading ? 0.6 : 1, transition: "opacity .2s" }}>
          <Typography variant="subtitle2" color="text.secondary">Média de gastos do período</Typography>
          <Typography variant="h6">{summaryText("averageExpense")}</Typography>
        </Paper>
      </Box>

      {list.error ? (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={reload}>Tentar de novo</Button>}>
          {list.error.message || "Não foi possível carregar os lançamentos."}
        </Alert>
      ) : (
        // a rolagem horizontal, quando a tela é estreita, fica dentro da grade e não na página
        <Box sx={{ width: "100%", minWidth: 0 }}>
          <DataGrid
            autoHeight
            density="compact"
            columnHeaderHeight={40}
            rowHeight={44}
            rows={list.rows}
            columns={columns}
            columnVisibilityModel={{ transactionType: !compact }}
            localeText={dataGridLocale}
            loading={listLoading}
            paginationMode="server"
            rowCount={list.total}
            paginationModel={pagination}
            onPaginationModelChange={setPagination}
            pageSizeOptions={[10, 25, 50]}
            disableRowSelectionOnClick
            sx={{ border: 0 }}
          />
        </Box>
      )}

      <TransactionDialog
        key={`editor-${editor.key}`}
        open={editor.open}
        transaction={editor.transaction}
        onClose={() => setEditor(closing)}
        onSaved={handleSaved}
      />

      <DeleteTransactionDialog
        key={`removal-${removal.key}`}
        open={removal.open}
        transaction={removal.transaction}
        onClose={() => setRemoval(closing)}
        onDeleted={handleDeleted}
      />
    </Paper>
  );
}
