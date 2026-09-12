import { useState } from "react";
import {
  Alert, Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Typography,
} from "@mui/material";

import { remove } from "../../api/transactions";
import { formatCurrency, formatDate } from "../../utils/format";

function messageFor(error) {
  if (error?.status === 403) return "Você não tem permissão para excluir este lançamento.";
  return error?.message || "Não foi possível excluir o lançamento.";
}

/** Confirmação antes de excluir; mostra o lançamento para não haver dúvida de qual é. */
export default function DeleteTransactionDialog({ open, transaction, onClose, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState(null);

  if (!transaction) return null;

  const close = () => {
    if (!deleting) onClose();
  };

  const confirm = async () => {
    setDeleting(true);
    setError(null);
    try {
      await remove(transaction.id);
      onDeleted();
      onClose();
    } catch (apiError) {
      // 404 = já não existe (excluído em outra aba, por exemplo): o objetivo foi atingido
      if (apiError?.status === 404) {
        onDeleted();
        onClose();
      } else {
        setError(apiError);
      }
    } finally {
      setDeleting(false);
    }
  };

  const income = transaction.transactionType === "INCOME";

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <DialogTitle>Excluir lançamento</DialogTitle>

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{messageFor(error)}</Alert>}

        <DialogContentText>
          Tem certeza que deseja excluir este lançamento? Essa ação não pode ser desfeita.
        </DialogContentText>

        <Box sx={{
          mt: 2, p: 2, borderRadius: 2, border: 1, borderColor: "divider",
          display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2,
        }}>
          <Box sx={{ minWidth: 0 }}>
            <Typography noWrap fontWeight={500}>{transaction.description || "Sem descrição"}</Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(transaction.createdAt)} · {income ? "Receita" : "Despesa"}
            </Typography>
          </Box>
          <Typography fontWeight={500} color={income ? "success.main" : "error.main"} sx={{ whiteSpace: "nowrap" }}>
            {formatCurrency(transaction.amount)}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={close} disabled={deleting}>Cancelar</Button>
        <Button variant="contained" color="error" onClick={confirm} disabled={deleting}>
          {deleting ? "Excluindo…" : "Excluir"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
