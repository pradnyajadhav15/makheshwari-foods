import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: Request) {
  try {
    const { amount, items } = await req.json();

    if (!amount || amount < 1) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
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

    return NextResponse.json({ id: order.id, amount: order.amount, currency: order.currency });
  } catch (e) {
    console.error("Razorpay order error", e);
    return NextResponse.json({ error: "Could not create order" }, { status: 500 });
  }
}