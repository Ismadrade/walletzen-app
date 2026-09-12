const currencyFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const decimalFormat = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

export function formatCurrency(value) {
  return currencyFormat.format(Number(value ?? 0));
}

/** Centavos inteiros → "1.234,56" (sem o símbolo), para campos com máscara. */
export function formatCents(cents) {
  return decimalFormat.format(cents / 100);
}

export function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormat.format(date);
}
