const amountFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 50000 → « 50 000 » (espaces insécables, format français). */
export function formatAmount(amount: number) {
  return amountFormatter.format(amount);
}
