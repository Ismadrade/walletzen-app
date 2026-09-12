import { useState } from "react";
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField,
} from "@mui/material";

import { create, update } from "../../api/transactions";
import CurrencyField from "./CurrencyField";

function initialForm(transaction) {
  if (!transaction) return { transactionType: "EXPENSE", cents: 0, description: "" };
  return {
    transactionType: transaction.transactionType,
    cents: Math.round(Number(transaction.amount) * 100),
    description: transaction.description ?? "",
  };
}

/** Traduz o erro da API para algo que o usuário entenda. */
function messageFor(error) {
  if (error?.status === 404) return "Este lançamento não existe mais — talvez já tenha sido excluído.";
  if (error?.status === 403) return "Você não tem permissão para alterar este lançamento.";
  if (error?.status === 422) return "O dono do lançamento não existe ou está inativo.";
  if (error?.status === 503) return "Serviço de usuários indisponível. Tente de novo em instantes.";
  return error?.message || "Não foi possível salvar o lançamento.";
}

/**
 * Cria (sem `transaction`) ou edita (com `transaction`) um lançamento.
 * O formulário é inicializado só na montagem — o pai troca a `key` a cada abertura.
 */
export default function TransactionDialog({ open, transaction, onClose, onSaved }) {
  const editing = Boolean(transaction);
  const [initial] = useState(() => initialForm(transaction));
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const amountIsValid = form.cents > 0;
  const changed = form.transactionType !== initial.transactionType
    || form.cents !== initial.cents
    || form.description !== initial.description;

  const close = () => {
    if (!saving) onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!amountIsValid) return;

    const body = {
      transactionType: form.transactionType,
      amount: form.cents / 100,
      description: form.description,
    };

    setSaving(true);
    setError(null);
    try {
      // sem userId: o backend resolve o dono pelo token
      await (editing ? update(transaction.id, body) : create(body));
      onSaved();
      onClose();
    } catch (apiError) {
      setError(apiError);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={close} fullWidth maxWidth="xs">
      <form onSubmit={submit}>
        <DialogTitle>{editing ? "Editar lançamento" : "Novo lançamento"}</DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{messageFor(error)}</Alert>}

            <TextField
              select
              label="Tipo"
              value={form.transactionType}
              onChange={(e) => setForm({ ...form, transactionType: e.target.value })}
              disabled={saving}
            >
              <MenuItem value="INCOME">Receita</MenuItem>
              <MenuItem value="EXPENSE">Despesa</MenuItem>
            </TextField>

            <CurrencyField
              label="Valor"
              cents={form.cents}
              onChange={(cents) => setForm({ ...form, cents })}
              disabled={saving}
              required
              autoFocus={editing}
            />

            <TextField
              label="Descrição"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={saving}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={close} disabled={saving}>Cancelar</Button>
          <Button type="submit" variant="contained" disabled={saving || !amountIsValid || (editing && !changed)}>
            {saving ? "Salvando…" : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
