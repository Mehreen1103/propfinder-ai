export const LAKH = 100000;
export const CRORE = 10000000;

/** 4500000 -> "45 Lakh", 38000000 -> "3.8 Crore" */
export function formatBDT(amount) {
  if (amount >= CRORE) return `${Number((amount / CRORE).toFixed(2))} Crore`;
  if (amount >= LAKH) return `${Number((amount / LAKH).toFixed(2))} Lakh`;
  return amount.toLocaleString('en-US');
}

export const titleCase = (s) => s.charAt(0).toUpperCase() + s.slice(1);
