const currencyFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const decimalFormat = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const dateFormat = new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" });

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

export function formatCurrency(value) {
  return currencyFormat.format(Number(value ?? 0));
}

/** Centavos inteiros → "1.234,56" (sem o símbolo), para campos com máscara. */
export function formatCents(cents) {
  return decimalFormat.format(cents / 100);
}

export function formatDate(value) {
  if (!value) return "";
  // "2026-09-12" (LocalDate) seria lido como meia-noite UTC e, no Brasil, viraria o dia anterior
  const match = ISO_DATE.exec(value);
  const date = match
    ? new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
    : new Date(value);
  return Number.isNaN(date.getTime()) ? "" : dateFormat.format(date);
}
