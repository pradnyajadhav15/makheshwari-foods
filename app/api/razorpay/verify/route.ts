import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase";
import { notifyOwner } from "@/lib/notify";

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

    const { error } = await supabaseAdmin.from("orders").insert({
      razorpay_order_id,
      razorpay_payment_id,
      status: "paid",
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
      console.error("Order save failed", error, { razorpay_payment_id });
      return NextResponse.json({ verified: true, saved: false, paymentId: razorpay_payment_id });
    }

    try { await notifyOwner({ paymentId: razorpay_payment_id, name: customer.name, phone: customer.phone, email: customer.email, address: customer.address, city: customer.city, state: customer.state, pincode: customer.pincode, items, total, notes: customer.notes }); } catch (e) { console.error("Notify failed", e); }

    return NextResponse.json({ verified: true, saved: true, paymentId: razorpay_payment_id });
  } catch (e) {
    console.error("Verify error", e);
    return NextResponse.json({ verified: false }, { status: 500 });
  }
}