const amountFormatter = new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 });

/** 50000 → « 50 000 » (espaces insécables, format français). */
export function formatAmount(amount: number) {
  return amountFormatter.format(amount);
}

/** 0197865758 → « 01 97 86 57 58 » */
export function formatPhone(phone: string) {
  return phone.replace(/(\d{2})(?=\d)/g, "$1 ");
}

/** Lien d'appel au format international du Bénin (+229). */
export function telHref(phone: string) {
  return `tel:+229${phone}`;
}
