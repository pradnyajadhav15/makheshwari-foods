import { supabaseAdmin } from "@/lib/supabase";

/**
 * Decrement stock for a paid order exactly once.
 * The conditional update is the lock: whichever of verify/webhook
 * flips stock_decremented first is the only one that decrements.
 */
export async function decrementStockOnce(razorpayOrderId: string) {
  const { data: claimed, error: claimErr } = await supabaseAdmin
    .from("orders")
    .update({ stock_decremented: true })
    .eq("razorpay_order_id", razorpayOrderId)
    .eq("stock_decremented", false)
    .select("items")
    .maybeSingle();

  if (claimErr) {
    console.error("Stock claim failed", claimErr, razorpayOrderId);
    return { done: false };
  }

  if (!claimed) return { done: false, alreadyDone: true };

  const items = (claimed.items as any[]) || [];
  if (!items.length) return { done: true, skipped: true };

  const { data, error } = await supabaseAdmin.rpc("decrement_stock", {
    p_items: items.map((l) => ({ slug: l.slug, qty: l.qty })),
  });

  if (error) {
    console.error("Stock decrement failed", error, razorpayOrderId);
    // Release the claim so a retry can try again.
    await supabaseAdmin
      .from("orders")
      .update({ stock_decremented: false })
      .eq("razorpay_order_id", razorpayOrderId);
    return { done: false };
  }

  const low = (data as any[])?.filter((r) => r.stock <= 5) || [];
  if (low.length) console.log("LOW STOCK", low);

  return { done: true, result: data };
}