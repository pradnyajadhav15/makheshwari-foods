import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyOwner } from "@/lib/notify";
import { decrementStockOnce } from "@/lib/stock";
import { ensureInvoice } from "@/lib/invoice";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, customer, items, subtotal, shipping, total } = body;

    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return NextResponse.json({ verified: false, error: "Signature mismatch" }, { status: 400 });
    }

    const { data: existing } = await supabaseAdmin
      .from("orders")
      .select("id, status")
      .eq("razorpay_order_id", razorpay_order_id)
      .maybeSingle();

    // Webhook may have already confirmed this - do not notify twice.
    if (existing?.status === "paid") {
      return NextResponse.json({ verified: true, saved: true, paymentId: razorpay_payment_id });
    }

    if (existing) {
      const { error } = await supabaseAdmin
        .from("orders")
        .update({
          razorpay_payment_id,
          status: "paid",
          confirmed_via: "verify",
          paid_at: new Date().toISOString(),
        })
        .eq("razorpay_order_id", razorpay_order_id);

      if (error) {
        console.error("Order update failed", error, { razorpay_payment_id });
        return NextResponse.json({ verified: true, saved: false, paymentId: razorpay_payment_id });
      }
    } else {
      // Fallback: pending row missing, insert full record from the browser.
      const { error } = await supabaseAdmin.from("orders").insert({
        razorpay_order_id,
        razorpay_payment_id,
        status: "paid",
        confirmed_via: "verify_fallback",
        paid_at: new Date().toISOString(),
        customer_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address_line: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        notes: customer.notes || null,
        items,
        subtotal,
        shipping,
        total,
      });
      if (error) {
        console.error("Order insert failed", error, { razorpay_payment_id });
        return NextResponse.json({ verified: true, saved: false, paymentId: razorpay_payment_id });
      }
    }

    await decrementStockOnce(razorpay_order_id);

    try {
      const { data: row } = await supabaseAdmin.from("orders").select("id").eq("razorpay_order_id", razorpay_order_id).maybeSingle();
      if (row) await ensureInvoice(row.id);
    } catch (e) { console.error("Invoice failed", e); }

    try {
      await notifyOwner({
        paymentId: razorpay_payment_id,
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        items,
        total,
        notes: customer.notes,
      });
    } catch (e) {
      console.error("Notify failed", e);
    }

    return NextResponse.json({ verified: true, saved: true, paymentId: razorpay_payment_id });
  } catch (e) {
    console.error("Verify error", e);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}