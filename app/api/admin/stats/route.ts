import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("orders").select("total,status").limit(5000);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const byStatus: Record<string, number> = {};
  let revenue = 0;
  for (const o of data) {
    byStatus[o.status] = (byStatus[o.status] || 0) + 1;
    if (o.status !== "cancelled") revenue += o.total || 0;
  }

  return NextResponse.json({ totalOrders: data.length, revenue, byStatus });
}
