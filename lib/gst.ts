export const GST_RATE = 0.12;
export const HSN = "20081929";
export const SELLER_STATE = "Bihar";

export type TaxLine = {
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  intra: boolean;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Prices are tax inclusive, so tax is extracted backwards:
 * taxable = gross / (1 + rate)
 */
export function computeTax(grossTotal: number, deliveryState: string | null): TaxLine {
  const gross = Number(grossTotal) || 0;
  const taxable = r2(gross / (1 + GST_RATE));
  const tax = r2(gross - taxable);

  const intra = (deliveryState || "").trim().toLowerCase() === SELLER_STATE.toLowerCase();
  const half = r2(tax / 2);

  return {
    taxable,
    cgst: intra ? half : 0,
    sgst: intra ? r2(tax - half) : 0,
    igst: intra ? 0 : tax,
    total: gross,
    intra,
  };
}

/** Indian financial year: April to March. */
export function financialYear(d = new Date()): string {
  const y = d.getFullYear();
  const start = d.getMonth() >= 3 ? y : y - 1;
  return `${start}-${String(start + 1).slice(2)}`;
}

export function formatInvoiceNo(fy: string, seq: number): string {
  return `MK/${fy}/${String(seq).padStart(3, "0")}`;
}