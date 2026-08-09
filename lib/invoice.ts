import { supabaseAdmin } from "@/lib/supabase";
import { computeTax, financialYear, formatInvoiceNo } from "@/lib/gst";

export type Invoice = {
  invoice_no: string;
  fy: string;
  seq: number;
  taxable: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
  place_of_supply: string | null;
};

/**
 * Allocates an invoice number exactly once per order.
 * Numbering must be gapless, so the sequence is read and written
 * inside a retry loop; the unique index on invoice_no is what makes
 * two simultaneous orders safe.
 */
export async function ensureInvoice(orderId: string): Promise<Invoice | null> {
  const { data: existing } = await supabaseAdmin
    .from("invoices")
    .select("*")
    .eq("order_id", orderId)
    .maybeSingle();

  if (existing) return existing as Invoice;

  const { data: order, error: oErr } = await supabaseAdmin
    .from("orders")
    .select("id,total,state,status")
    .eq("id", orderId)
    .maybeSingle();

  if (oErr || !order) {
    console.error("Invoice: order not found", orderId, oErr);
    return null;
  }

  // Only raise invoices for money actually taken.
  if (!["paid", "packed", "shipped", "delivered"].includes(order.status)) {
    return null;
  }

  const fy = financialYear();
  const tax = computeTax(order.total, order.state);

  for (let attempt = 0; attempt < 5; attempt++) {
    const { data: seqData, error: sErr } = await supabaseAdmin.rpc("next_invoice_no", { p_fy: fy });
    if (sErr) {
      console.error("Invoice sequence failed", sErr);
      return null;
    }

    const seq = Number(seqData) || 1;
    const invoice_no = formatInvoiceNo(fy, seq);

    const { data: created, error } = await supabaseAdmin
      .from("invoices")
      .insert({
        order_id: orderId,
        invoice_no,
        fy,
        seq,
        taxable: tax.taxable,
        cgst: tax.cgst,
        sgst: tax.sgst,
        igst: tax.igst,
        total: order.total,
        place_of_supply: order.state,
      })
      .select()
      .single();

    if (!error && created) return created as Invoice;

    // 23505 = unique violation: another order took this number, try the next.
    if (error && (error as { code?: string }).code !== "23505") {
      console.error("Invoice insert failed", error);
      return null;
    }
  }

  console.error("Invoice: could not allocate a number after retries", orderId);
  return null;
}