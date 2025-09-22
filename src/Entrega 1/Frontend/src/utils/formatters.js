export function formatDisplay(value, { currency = false, locale = "pt-BR", currencyCode = "BRL", fallback = "--" } = {}) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return currency
      ? value.toLocaleString(locale, { style: "currency", currency: currencyCode })
      : value.toLocaleString(locale);
  }
  return value ?? fallback;
}

export const formatPercent = (ratio, digits = 2) =>
  new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number.isFinite(ratio) ? ratio : 0);