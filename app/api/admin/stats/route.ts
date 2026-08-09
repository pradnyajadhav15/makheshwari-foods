import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";

const EARNED = ["paid", "packed", "shipped", "delivered"];

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("total,status,created_at,paid_at,customer_name,phone,items,coupon_code,discount,razorpay_payment_id,id")
    .order("created_at", { ascending: false })
    .limit(5000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfDay);
  startOfWeek.setDate(startOfWeek.getDate() - 6);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const byStatus: Record<string, number> = {};
  let revenue = 0;
  let revenueToday = 0;
  let revenueWeek = 0;
  let revenueMonth = 0;
  let ordersToday = 0;
  let paidCount = 0;

  // Only orders that were actually paid count as revenue.
  // Pending rows are abandoned checkouts, not income.
  for (const o of data) {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    if (!EARNED.includes(o.status)) continue;

    const amt = Number(o.total) || 0;
    revenue += amt;
    paidCount += 1;

    const when = new Date(o.paid_at || o.created_at);
    if (when >= startOfDay) { revenueToday += amt; ordersToday += 1; }
    if (when >= startOfWeek) revenueWeek += amt;
    if (when >= startOfMonth) revenueMonth += amt;
  }

  // Units sold per flavour, paid orders only.
  const unitsBySlug: Record<string, { name: string; units: number; revenue: number }> = {};
  for (const o of data) {
    if (!EARNED.includes(o.status)) continue;
    for (const l of (o.items as { slug: string; name: string; qty: number; price: number }[]) || []) {
      if (!unitsBySlug[l.slug]) unitsBySlug[l.slug] = { name: l.name, units: 0, revenue: 0 };
      unitsBySlug[l.slug].units += l.qty;
      unitsBySlug[l.slug].revenue += (l.price || 0) * l.qty;
    }
  }
  const topProducts = Object.entries(unitsBySlug)
    .map(([slug, v]) => ({ slug, ...v }))
    .sort((a, b) => b.units - a.units);

  // Repeat customers by phone.
  const byPhone: Record<string, number> = {};
  for (const o of data) {
    if (!EARNED.includes(o.status) || !o.phone) continue;
    const k = String(o.phone).replace(/\D/g, "").slice(-10);
    byPhone[k] = (byPhone[k] || 0) + 1;
  }
  const customers = Object.keys(byPhone).length;
  const repeatCustomers = Object.values(byPhone).filter((n) => n > 1).length;

  const { data: prods } = await supabaseAdmin
    .from("products")
    .select("slug,name,stock,in_stock,price")
    .order("stock", { ascending: true });

  const lowStock = (prods || []).filter((p) => (p.stock ?? 0) <= 5);

  const { count: pendingReviews } = await supabaseAdmin
    .from("reviews")
    .select("id", { count: "exact", head: true })
    .eq("approved", false);

  const recent = data
    .filter((o) => EARNED.includes(o.status))
    .slice(0, 6)
    .map((o) => ({
      id: o.id,
      name: o.customer_name,
      total: o.total,
      status: o.status,
      created_at: o.created_at,
      paymentId: o.razorpay_payment_id,
    }));

  const needsAction = (byStatus["paid"] || 0) + (byStatus["packed"] || 0);

  return NextResponse.json({
    totalOrders: paidCount,
    revenue,
    revenueToday,
    revenueWeek,
    revenueMonth,
    ordersToday,
    avgOrder: paidCount ? Math.round(revenue / paidCount) : 0,
    byStatus,
    needsAction,
    topProducts,
    customers,
    repeatCustomers,
    lowStock,
    pendingReviews: pendingReviews ?? 0,
    recent,
  });
}