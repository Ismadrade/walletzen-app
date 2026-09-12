import { useState } from "react";
import {
  Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField,
} from "@mui/material";

import { create } from "../../api/transactions";

const EMPTY = { transactionType: "EXPENSE", amount: "", description: "" };

/** Traduz o erro da API para algo que o usuário entenda. */
function messageFor(error) {
  if (error?.status === 422) return "O dono do lançamento não existe ou está inativo.";
  if (error?.status === 503) return "Serviço de usuários indisponível. Tente de novo em instantes.";
  return error?.message || "Não foi possível salvar o lançamento.";
}

export default function NewTransactionDialog({ open, onClose, onCreated }) {
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const amount = Number(form.amount);
  const amountIsValid = form.amount !== "" && !Number.isNaN(amount) && amount > 0;

  const close = () => {
    if (saving) return;
    setForm(EMPTY);
    setError(null);
    onClose();
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!amountIsValid) return;

    setSaving(true);
    setError(null);
    try {
      // sem userId: o backend resolve o dono pelo token
      await create({ ...form, amount });
      setForm(EMPTY);
      onCreated();
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
        <DialogTitle>Novo lançamento</DialogTitle>

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

            <TextField
              label="Valor"
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              disabled={saving}
              required
              error={form.amount !== "" && !amountIsValid}
              helperText={form.amount !== "" && !amountIsValid ? "Informe um valor maior que zero" : " "}
              slotProps={{ htmlInput: { min: 0.01, step: 0.01 } }}
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
          <Button type="submit" variant="contained" disabled={saving || !amountIsValid}>
            {saving ? "Salvando…" : "Salvar"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
