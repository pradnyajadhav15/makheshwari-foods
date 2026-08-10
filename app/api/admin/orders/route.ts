import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed, ORDER_STATUSES } from "@/lib/adminAuth";

const PAGE_SIZE = 20;

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const params = req.nextUrl.searchParams;
  const q = params.get("q")?.trim() || "";
  const status = params.get("status") || "all";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const from = params.get("from");
  const to = params.get("to");
  const showArchived = params.get("archived") === "1";

  let query = supabaseAdmin
    .from("orders")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  query = query.eq("archived", showArchived);

  if (status !== "all" && (ORDER_STATUSES as readonly string[]).includes(status)) {
    query = query.eq("status", status);
  }

  if (q) {
    const like = `%${q}%`;
    query = query.or(
      `customer_name.ilike.${like},phone.ilike.${like},email.ilike.${like},razorpay_payment_id.ilike.${like}`
    );
  }

  if (from) query = query.gte("created_at", new Date(from + "T00:00:00").toISOString());
  if (to) query = query.lte("created_at", new Date(to + "T23:59:59").toISOString());

  const offset = (page - 1) * PAGE_SIZE;
  query = query.range(offset, offset + PAGE_SIZE - 1);

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ orders: data, total: count ?? 0, page, pageSize: PAGE_SIZE });
}
