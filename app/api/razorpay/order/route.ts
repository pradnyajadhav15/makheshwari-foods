import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase";
import { getLiveProducts } from "@/lib/liveProducts";
import { FREE_SHIPPING_OVER } from "@/lib/products";

export async function POST(req: Request) {
  try {
    const { customer, lineItems } = await req.json();

    if (!Array.isArray(lineItems) || !lineItems.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Prices come from the database, never from the browser.
    const live = await getLiveProducts();

    let subtotal = 0;
    const priced: { slug: string; name: string; qty: number; price: number }[] = [];
    const problems: { slug: string; requested: number; available: number }[] = [];

    for (const l of lineItems) {
      const qty = Math.max(1, Math.min(20, Number(l.qty) || 1));
      const p = live.find((x) => x.slug === l.slug);

      if (!p) {
        return NextResponse.json({ error: "One of the items is no longer available" }, { status: 409 });
      }
      if (!p.inStock) {
        problems.push({ slug: p.slug, requested: qty, available: 0 });
        continue;
      }
      if (p.stock > 0 && p.stock < qty) {
        problems.push({ slug: p.slug, requested: qty, available: p.stock });
        continue;
      }

      const price = p.price ?? 0;
      if (price <= 0) {
        return NextResponse.json({ error: "Pricing unavailable, please try again" }, { status: 409 });
      }

      subtotal += price * qty;
      priced.push({ slug: p.slug, name: p.name, qty, price });
    }

    if (problems.length) {
      const first = problems[0];
      const name = live.find((x) => x.slug === first.slug)?.name || first.slug;
      const msg =
        first.available === 0
          ? `${name} just sold out. Please remove it from your cart.`
          : `Only ${first.available} left of ${name}. Please reduce the quantity.`;
      return NextResponse.json({ error: msg, outOfStock: problems }, { status: 409 });
    }

    const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : 49;
    const total = subtotal + shipping;

    if (total < 1) {
      return NextResponse.json({ error: "Invalid order total" }, { status: 400 });
    }

    const rzp = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    });

    const order = await rzp.orders.create({
      amount: Math.round(total * 100),
      currency: "INR",
      receipt: `mk_${Date.now()}`,
      notes: { items: priced.map((l) => `${l.name} x${l.qty}`).join(", ") },
    });

    if (customer) {
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
        items: priced,
        subtotal,
        shipping,
        total,
      });
      if (error) console.error("Pending order save failed", error, order.id);
    }

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      subtotal,
      shipping,
      total,
    });
  } catch (e) {
    console.error("Razorpay order error", e);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}