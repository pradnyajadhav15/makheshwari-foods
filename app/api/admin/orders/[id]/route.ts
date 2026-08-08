import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed, ORDER_STATUSES } from "@/lib/adminAuth";
import { notifyCustomerStatus } from "@/lib/statusEmail";

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { status, tracking_id, courier, notify } = await req.json();

  if (!(ORDER_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const patch: Record<string, unknown> = { status };
  if (tracking_id !== undefined) patch.tracking_id = tracking_id || null;
  if (courier !== undefined) patch.courier = courier || null;

  const { data, error } = await supabaseAdmin
    .from("orders")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  let emailed = false;
  if (notify !== false && data?.email) {
    const r = await notifyCustomerStatus({
      to: data.email,
      name: data.customer_name || "there",
      status,
      orderRef: data.razorpay_payment_id || data.razorpay_order_id || String(data.id),
      items: (data.items as { name: string; qty: number; price: number }[]) || [],
      total: data.total,
      address: data.address_line,
      city: data.city,
      state: data.state,
      pincode: data.pincode,
      trackingId: data.tracking_id,
      courier: data.courier,
    });
    emailed = r.sent;
  }

  return NextResponse.json({ order: data, emailed });
}