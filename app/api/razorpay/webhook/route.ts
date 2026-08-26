import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyOwner } from "@/lib/notify";
import { decrementStockOnce } from "@/lib/stock";
import { ensureInvoice } from "@/lib/invoice";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  // Razorpay signs the RAW body - must not parse before verifying.
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") || "";
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!secret) {
    console.error("RAZORPAY_WEBHOOK_SECRET not set");
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");

  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    console.error("Webhook signature mismatch");
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  let event: any;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const eventId = req.headers.get("x-razorpay-event-id") || `${event.event}-${Date.now()}`;

  // Idempotency: unique index on event_id makes a repeat delivery a no-op.
  const { error: dupErr } = await supabaseAdmin.from("webhook_events").insert({
    event_id: eventId,
    event_type: event.event,
    payload: event,
  });
  if (dupErr) {
    console.log("Duplicate webhook ignored", eventId);
    return NextResponse.json({ ok: true, duplicate: true });
  }

  try {
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const payment = event.payload?.payment?.entity;
      if (!payment) return NextResponse.json({ ok: true });

      const orderId = payment.order_id;
      const paymentId = payment.id;

      const { data: existing } = await supabaseAdmin
        .from("orders")
        .select("id, order_number, status, customer_name, email, phone, address_line, city, state, pincode, items, total, notes")
        .eq("razorpay_order_id", orderId)
        .maybeSingle();

      if (existing?.status === "paid") {
        return NextResponse.json({ ok: true, already: true });
      }

      if (existing) {
        const { error } = await supabaseAdmin
          .from("orders")
          .update({
            razorpay_payment_id: paymentId,
            status: "paid",
            confirmed_via: "webhook",
            paid_at: new Date().toISOString(),
          })
          .eq("razorpay_order_id", orderId);

        if (error) {
          console.error("Webhook order update failed", error, orderId);
          return NextResponse.json({ ok: false }, { status: 500 });
        }

        await decrementStockOnce(orderId);

        // Invoice numbering must never gap, so failures are logged, not thrown.
        try { await ensureInvoice(existing.id); } catch (e) { console.error("Invoice failed", e); }

        try {
          await notifyOwner({
            paymentId,
            orderNumber: existing.order_number,
            name: existing.customer_name,
            phone: existing.phone,
            email: existing.email,
            address: existing.address_line,
            city: existing.city,
            state: existing.state,
            pincode: existing.pincode,
            items: existing.items,
            total: existing.total,
            notes: existing.notes,
          });
        } catch (e) {
          console.error("Webhook notify failed", e);
        }
      } else {
        // No pending row - payment arrived without our record. Save what we can.
        console.error("Paid order with no pending row", orderId, paymentId);
        await supabaseAdmin.from("orders").insert({
          razorpay_order_id: orderId,
          razorpay_payment_id: paymentId,
          status: "paid",
          confirmed_via: "webhook_orphan",
          paid_at: new Date().toISOString(),
          customer_name: payment.notes?.name || "Unknown - check Razorpay",
          email: payment.email || null,
          phone: payment.contact || null,
          address_line: null,
          city: null,
          state: null,
          pincode: null,
          items: [],
          subtotal: (payment.amount || 0) / 100,
          shipping: 0,
          total: (payment.amount || 0) / 100,
        });
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload?.payment?.entity;
      if (payment?.order_id) {
        await supabaseAdmin
          .from("orders")
          .update({ status: "failed" })
          .eq("razorpay_order_id", payment.order_id)
          .eq("status", "pending");
      }
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Webhook handler error", e);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}