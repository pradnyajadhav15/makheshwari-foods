import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";

function cell(v: unknown) {
  const s = String(v ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const head = ["Date","Payment ID","Status","Name","Phone","Email","Address","City","State","PIN","Items","Subtotal","Shipping","Total"];
  const rows = (data || []).map((o) => [
    new Date(o.created_at).toLocaleString("en-IN"),
    o.razorpay_payment_id, o.status, o.customer_name, o.phone, o.email,
    o.address_line, o.city, o.state, o.pincode,
    (o.items || []).map((i: { name: string; qty: number }) => `${i.name} x${i.qty}`).join("; "),
    o.subtotal, o.shipping, o.total,
  ].map(cell).join(","));

  const body = [head.join(","), ...rows].join("\n");

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="makheshwari-orders-${new Date().toISOString().slice(0,10)}.csv"`,
    },
  });
}