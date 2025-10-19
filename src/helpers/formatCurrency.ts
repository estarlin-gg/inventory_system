export const formatCurrency = (value: number, currency = "DOP") =>
  new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 2,
  }).format(value);
