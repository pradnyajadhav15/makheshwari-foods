import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyOwnerCancelled } from "@/lib/notify";

/* Cancellation is customer-initiated but the refund is not automatic:
   the order moves to `cancelled` and the refund is issued by hand from
   the Razorpay dashboard. Stock goes back on the same transition. */
const CANCELLABLE = ["paid", "packed"];

export async function POST(req: Request) {
  const { token, orderId } = await req.json();
  if (!token || !orderId) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: userData, error } = await anon.auth.getUser(token);
  if (error || !userData.user?.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  /* Match on id AND email so an order id from the browser is never enough
     on its own to cancel someone else's order. */
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("id,status,items,stock_decremented,razorpay_payment_id,customer_name,phone,email,total,order_number")
    .eq("id", orderId)
    .ilike("email", userData.user.email)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "cancelled") return NextResponse.json({ ok: true, status: "cancelled" });
  if (!CANCELLABLE.includes(order.status)) {
    return NextResponse.json({ error: "This order has already shipped. Message us on WhatsApp and we will sort it out." }, { status: 400 });
  }

  /* The status guard is the lock: only the request that moves it off a
     cancellable status gets to restock, so a double click cannot add
     stock back twice. */
  const { data: claimed } = await supabaseAdmin
    .from("orders")
    .update({ status: "cancelled" })
    .eq("id", orderId)
    .in("status", CANCELLABLE)
    .select("id")
    .maybeSingle();

  if (!claimed) return NextResponse.json({ ok: true, status: "cancelled" });

  if (order.stock_decremented) {
    const items = (order.items as any[]) || [];
    if (items.length) {
      const { error: rpcErr } = await supabaseAdmin.rpc("restock_items", {
        p_items: items.map((l) => ({ slug: l.slug, qty: l.qty })),
      });
      if (rpcErr) console.error("Restock failed", rpcErr, orderId);
    }
  }

  /* Mail last, and never let a send failure surface as a failed
     cancellation — the order is already cancelled and the customer has
     been told so. */
  try {
    await notifyOwnerCancelled({
      paymentId: order.razorpay_payment_id,
      orderNumber: order.order_number,
      name: order.customer_name,
      phone: order.phone,
      email: order.email,
      items: (order.items as any[]) || [],
      total: order.total,
    });
  } catch (e) {
    console.error("Cancel notification failed", e, orderId);
  }

  return NextResponse.json({ ok: true, status: "cancelled" });
}