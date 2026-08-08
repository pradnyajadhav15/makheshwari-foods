import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { amount, items, customer, lineItems, subtotal, shipping } = await req.json();
    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    // Never take money for stock we do not have.
    if (Array.isArray(lineItems) && lineItems.length) {
      const { data: problems, error: checkErr } = await supabaseAdmin.rpc("check_stock", {
        p_items: lineItems.map((l: any) => ({ slug: l.slug, qty: l.qty })),
      });

      if (checkErr) {
        console.error("Stock check failed", checkErr);
      } else if (Array.isArray(problems) && problems.length) {
        const first = problems[0];
        const name = lineItems.find((l: any) => l.slug === first.slug)?.name || first.slug;
        const msg =
          first.available === 0
            ? `${name} just sold out. Please remove it from your cart.`
            : `Only ${first.available} left of ${name}. Please reduce the quantity.`;
        return NextResponse.json({ error: msg, outOfStock: problems }, { status: 409 });
      }
    }

    const rzp = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await rzp.orders.create({
      amount: Math.round(amount * 100),
      currency: "INR",
      receipt: `mk_${Date.now()}`,
      notes: { items: String(items ?? "") },
    });

    // Save a pending order BEFORE payment so the webhook can complete it
    // even if the customer closes the tab.
    if (customer && lineItems) {
      const { error } = await supabaseAdmin.from("orders").insert({
        razorpay_order_id: order.id,
        razorpay_payment_id: null,
        status: "pending",
        stock_decremented: false,
        customer_name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address_line: customer.address,
        city: customer.city,
        state: customer.state,
        pincode: customer.pincode,
        notes: customer.notes || null,
        items: lineItems,
        subtotal,
        shipping,
        total: amount,
      });
      if (error) console.error("Pending order save failed", error, order.id);
    }

    return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (e) {
    console.error("Razorpay order error", e);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}