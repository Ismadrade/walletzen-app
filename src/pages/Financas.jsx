import { DataGrid } from "@mui/x-data-grid";
import { Box, Paper, Typography } from "@mui/material";

const columns = [
  { field: "id", headerName: "ID" },
  { field: "description", headerName: "Descrição", flex: 2, hideable: true },
  {
    field: "amount",
    headerName: "Valor",
    flex: 2,
    type: "number",
    align: "left",
    headerAlign: "left",
    renderCell: (params) => {
      const isIncome = params.row.transactionType === "INCOME";
      return (
        <span
          style={{
            color: isIncome ? "#2e7d32" : "#d32f2f",
            fontWeight: 500,
          }}
        >
          {new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(params.value)}
        </span>
      );
    },
  },
];

const rows = [
  {
    id: 1,
    description: "Cartão de Crédito",
    amount: 4000,
    transactionType: "EXPENSE",
  },
  { id: 2, description: "Salario", amount: 10000, transactionType: "INCOME" },
  { id: 3, description: "Aluguel", amount: 250.89, transactionType: "EXPENSE" },
  { id: 4, description: "PLR", amount: 3000, transactionType: "INCOME" },
  { id: 5, description: "Água", amount: 60, transactionType: "EXPENSE" },
  { id: 6, description: "Luz", amount: 450.8, transactionType: "EXPENSE" },
  { id: 7, description: "Internet", amount: 129.9, transactionType: "EXPENSE" },
  { id: 8, description: "Faculdade", amount: 520, transactionType: "EXPENSE" },
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Financas() {
  const total = rows.reduce((acc, row) => {
    if (row.transactionType === "INCOME") {
      return acc + row.amount;
    } else {
      return acc - row.amount;
    }
  }, 0);
  const expenses = rows.filter(
  (row) => row.transactionType === "EXPENSE"
);

const averageExpense =
  expenses.length > 0
    ? expenses.reduce((acc, row) => acc + row.amount, 0) / expenses.length
    : 0;

  return (
    <Paper sx={{ width: "80%",  p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      {/* 🔥 RESUMO */}
      <Box display="flex" gap={2} mb={2} flexDirection={{ xs: "column", sm: "row" }}>
        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Total
          </Typography>
          <Typography variant="h6">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(total)}
          </Typography>
        </Paper>

        <Paper sx={{ flex: 1, p: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Média de gastos
          </Typography>
          <Typography variant="h6">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(averageExpense)}
          </Typography>
        </Paper>
      </Box>

      <DataGrid
      columnVisibilityModel={{
    description: window.innerWidth > 600,
  }}
        autoHeight
        density="compact"
        columnHeaderHeight={40}
        rowHeight={40}
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
