import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";

const EARNED = ["paid", "packed", "shipped", "delivered"];

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("customer_name,phone,email,city,state,total,status,created_at,items")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Phone is the identity key: the same person may use different emails.
  const map: Record<string, {
    phone: string; name: string; email: string | null; city: string | null; state: string | null;
    orders: number; spent: number; first: string; last: string; units: number;
  }> = {};

  for (const o of data) {
    if (!EARNED.includes(o.status) || !o.phone) continue;
    const key = String(o.phone).replace(/\D/g, "").slice(-10);
    if (!key) continue;

    const units = ((o.items as { qty: number }[]) || []).reduce((n, i) => n + (i.qty || 0), 0);

    if (!map[key]) {
      map[key] = {
        phone: key, name: o.customer_name || "Unknown", email: o.email, city: o.city, state: o.state,
        orders: 0, spent: 0, first: o.created_at, last: o.created_at, units: 0,
      };
    }
    const c = map[key];
    c.orders += 1;
    c.spent += Number(o.total) || 0;
    c.units += units;
    if (o.created_at < c.first) c.first = o.created_at;
    if (o.created_at > c.last) c.last = o.created_at;
  }

  const customers = Object.values(map).sort((a, b) => b.spent - a.spent);

  return NextResponse.json({
    customers,
    total: customers.length,
    repeat: customers.filter((c) => c.orders > 1).length,
  });
}