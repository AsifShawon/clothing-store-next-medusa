export type CurrencyCode = "bdt" | "usd" | "gbp" | (string & {})

export interface MoneyView {
  amount: number
  currencyCode: CurrencyCode
  formatted: string
  approxUsd?: string
}

export function formatBDT(amount: number): string {
  const rounded = Math.round(amount)
  const formatted = rounded.toLocaleString("en-BD")
  return `৳${formatted}`
}

export function formatMoney(amount: number, currencyCode: CurrencyCode = "bdt"): string {
  if (currencyCode.toLowerCase() === "bdt") {
    return formatBDT(amount)
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount)
}

export function createMoneyView(amount: number, currencyCode: CurrencyCode = "bdt", approxUsdRate = 120): MoneyView {
  const isBdt = currencyCode.toLowerCase() === "bdt"
  const approxUsd = isBdt && approxUsdRate > 0
    ? (amount / approxUsdRate).toFixed(2)
    : undefined

  return {
    amount,
    currencyCode,
    formatted: formatMoney(amount, currencyCode),
    approxUsd,
  }
}
