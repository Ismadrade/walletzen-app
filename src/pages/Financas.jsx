import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'id', headerName: 'ID' },
  { field: 'description', headerName: 'Descrição', flex: 2 },
  { 
    field: 'amount', 
    headerName: 'Valor', 
    flex: 2,
    type: 'number', 
    align: 'left',
    headerAlign: 'left',
    renderCell: (params) => {
      const isIncome = params.row.transactionType === 'INCOME';
      return (
        <span style={{ 
          color: isIncome ? '#2e7d32' : '#d32f2f',
          fontWeight: 500
        }}>
          {new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }).format(params.value)}
        </span>
      );
    }
 },

];

const rows = [
  { id: 1, description: 'Cartão de Crédito', amount: 4000, transactionType: 'EXPENSE' },
  { id: 2, description: 'Salario', amount: 10000, transactionType: 'INCOME'  },
  { id: 3, description: 'Aluguel', amount: 250.89, transactionType: 'EXPENSE' },
  { id: 4, description: 'PLR', amount: 3000, transactionType: 'INCOME' },
  { id: 5, description: 'Água', amount: 60, transactionType: 'EXPENSE' },
  { id: 6, description: 'Luz', amount: 450.80, transactionType: 'EXPENSE' },
  { id: 7, description: 'Internet', amount: 129.90, transactionType: 'EXPENSE' },
  { id: 8, description: 'Faculdade', amount: 520, transactionType: 'EXPENSE' },  
];

const paginationModel = { page: 0, pageSize: 5 };

export default function Financas() {
  return (
    <Paper sx={{ height: 400, width: '80%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}
