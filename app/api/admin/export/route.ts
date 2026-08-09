import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed, ORDER_STATUSES } from "@/lib/adminAuth";

function cell(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const p = req.nextUrl.searchParams;
  const from = p.get("from");
  const to = p.get("to");
  const status = p.get("status") || "all";
  const paidOnly = p.get("paidOnly") === "1";

  let query = supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (from) query = query.gte("created_at", new Date(from + "T00:00:00").toISOString());
  if (to) query = query.lte("created_at", new Date(to + "T23:59:59").toISOString());

  if (status !== "all" && (ORDER_STATUSES as readonly string[]).includes(status)) {
    query = query.eq("status", status);
  } else if (paidOnly) {
    query = query.in("status", ["paid", "packed", "shipped", "delivered"]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const head = ["Date","Payment ID","Status","Name","Phone","Email","Address","City","State","PIN","Items","Subtotal","Discount","Coupon","Shipping","Total","Tracking","Courier"];
  const rows = (data || []).map((o) => [
    new Date(o.created_at).toLocaleString("en-IN"),
    o.razorpay_payment_id, o.status, o.customer_name, o.phone, o.email,
    o.address_line, o.city, o.state, o.pincode,
    (o.items || []).map((i: { name: string; qty: number }) => `${i.name} x${i.qty}`).join("; "),
    o.subtotal, o.discount ?? 0, o.coupon_code ?? "", o.shipping, o.total,
    o.tracking_id ?? "", o.courier ?? "",
  ].map(cell).join(","));

  const label = from || to ? `${from || "start"}-to-${to || "today"}` : new Date().toISOString().slice(0, 10);
  const body = [head.join(","), ...rows].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="makheshwari-orders-${label}.csv"`,
    },
  });
}