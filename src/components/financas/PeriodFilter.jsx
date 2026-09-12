import { Box, Button, MenuItem, TextField } from "@mui/material";

const MONTHS = Array.from({ length: 12 }, (_, index) => {
  const label = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(new Date(2000, index, 1));
  return { value: index + 1, label: label.charAt(0).toUpperCase() + label.slice(1) };
});

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, index) => CURRENT_YEAR - index);

/**
 * Filtro de período da listagem. O backend só aceita `month` acompanhado de
 * `year`, então o campo de mês fica desabilitado enquanto o ano estiver em "Todos".
 */
export default function PeriodFilter({ year, month, onChange, disabled }) {
  const handleYear = (event) => {
    const value = event.target.value;
    // sem ano não há mês: o backend devolveria 400
    onChange({ year: value, month: value === "" ? "" : month });
  };

  return (
    <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "flex-start" }}>
      <TextField
        select
        size="small"
        label="Ano"
        value={year}
        onChange={handleYear}
        disabled={disabled}
        helperText=" "
        sx={{ minWidth: 130 }}
      >
        <MenuItem value="">Todos</MenuItem>
        {YEARS.map((option) => (
          <MenuItem key={option} value={option}>{option}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        label="Mês"
        value={month}
        onChange={(event) => onChange({ year, month: event.target.value })}
        disabled={disabled || year === ""}
        helperText={year === "" ? "Escolha um ano para filtrar por mês" : " "}
        sx={{ minWidth: 160 }}
      >
        <MenuItem value="">Todos</MenuItem>
        {MONTHS.map((option) => (
          <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
        ))}
      </TextField>

      <Button
        variant="contained"
        onClick={() => onChange({ year: "", month: "" })}
        disabled={disabled || (year === "" && month === "")}
        sx={{ height: 40 }}
      >
        Limpar
      </Button>
    </Box>
  );
}
