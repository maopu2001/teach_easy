export function formatCurrency(
  value: number,
  currencyCode: string = "BDT",
  locale: string = "bn-BD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currencyCode,
    numberingSystem: "latn",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, locale: string = "bn-BD"): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    numberingSystem: "latn",
  }).format(value);
}

export function parseCurrencyToNumber(currencyString: string): number {
  const numericString = currencyString.replace(/[^0-9.-]/g, "");
  return parseFloat(numericString);
}
