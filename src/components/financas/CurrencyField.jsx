import { InputAdornment, TextField } from "@mui/material";

import { formatCents } from "../../utils/format";

// amount é numeric(10,2) no banco: até 8 dígitos inteiros + 2 decimais
const MAX_DIGITS = 10;

/**
 * Campo de valor em reais com máscara de "caixa eletrônico": os dígitos entram
 * pela direita (1 → 0,01 · 12 → 0,12 · 1234 → 12,34). O valor controlado é em
 * centavos inteiros, o que evita arredondamento de ponto flutuante durante a digitação.
 */
export default function CurrencyField({ cents, onChange, ...props }) {
  const handleChange = (event) => {
    const digits = event.target.value.replace(/\D/g, "").replace(/^0+/, "");
    if (digits.length > MAX_DIGITS) return;
    onChange(digits ? Number(digits) : 0);
  };

  return (
    <TextField
      {...props}
      value={cents ? formatCents(cents) : ""}
      onChange={handleChange}
      placeholder="0,00"
      autoComplete="off"
      slotProps={{
        input: { startAdornment: <InputAdornment position="start">R$</InputAdornment> },
        htmlInput: { inputMode: "numeric" },
      }}
    />
  );
}
