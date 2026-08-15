/** Shared formatting + status helpers for the admin dashboard. */

export function inr(v: number | null | undefined) {
  if (v === null || v === undefined || Number.isNaN(v)) return "₹—";
  return "₹" + Number(v).toLocaleString("en-IN", { maximumFractionDigits: 0 });
}

/** Compact form for stat tiles: ₹1.2L, ₹45.3k. */
export function inrShort(v: number | null | undefined) {
  const n = Number(v) || 0;
  if (n >= 1_00_00_000) return "₹" + (n / 1_00_00_000).toFixed(2).replace(/\.00$/, "") + "Cr";
  if (n >= 1_00_000) return "₹" + (n / 1_00_000).toFixed(2).replace(/\.00$/, "") + "L";
  if (n >= 1_000) return "₹" + (n / 1_000).toFixed(1).replace(/\.0$/, "") + "k";
  return inr(n);
}

export function num(v: number | null | undefined) {
  return Number(v || 0).toLocaleString("en-IN");
}

export function shortDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" });
}

export function dateTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit",
  });
}

export function relative(iso: string | null | undefined) {
  if (!iso) return "—";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return shortDate(iso);
}

/**
 * The order lifecycle the database actually stores. The brief asked for
 * Pending/Confirmed/Processing/Returned as well, but writing those would
 * be rejected by the API (lib/adminAuth.ts ORDER_STATUSES), so the real
 * five are shown under friendlier labels instead of inventing states the
 * backend cannot persist.
 */
export const ORDER_STATUS = {
  pending:   { label: "Pending",   tone: "warn"    as const, help: "Checkout started, payment not captured" },
  paid:      { label: "Confirmed", tone: "info"    as const, help: "Payment received, not yet packed" },
  packed:    { label: "Packed",    tone: "info"    as const, help: "Picked and boxed, awaiting pickup" },
  shipped:   { label: "Shipped",   tone: "info"    as const, help: "Handed to the courier" },
  delivered: { label: "Delivered", tone: "success" as const, help: "Confirmed delivered" },
  cancelled: { label: "Cancelled", tone: "danger"  as const, help: "Cancelled and refunded" },
} as const;

export type OrderStatusKey = keyof typeof ORDER_STATUS;

/** Statuses an admin may set. Mirrors ORDER_STATUSES in lib/adminAuth.ts. */
export const SETTABLE_STATUSES: OrderStatusKey[] = [
  "paid", "packed", "shipped", "delivered", "cancelled",
];

export function statusMeta(s: string | null | undefined) {
  return ORDER_STATUS[(s || "") as OrderStatusKey] ?? {
    label: s || "Unknown", tone: "neutral" as const, help: "",
  };
}

export function badgeClass(tone: string) {
  return `adm-badge adm-badge-${tone}`;
}

/** Percentage change, guarding the divide-by-zero that makes tiles show Infinity. */
export function pctChange(current: number, previous: number): number | null {
  if (!previous) return current > 0 ? null : 0;
  return Math.round(((current - previous) / previous) * 100);
}

export const LOW_STOCK_THRESHOLD = 5;

export function stockTone(stock: number, threshold = LOW_STOCK_THRESHOLD) {
  if (stock <= 0) return "danger" as const;
  if (stock <= threshold) return "warn" as const;
  return "success" as const;
}

export function stockLabel(stock: number, threshold = LOW_STOCK_THRESHOLD) {
  if (stock <= 0) return "Out of stock";
  if (stock <= threshold) return "Low stock";
  return "In stock";
}
