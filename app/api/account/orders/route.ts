import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const { token } = await req.json();
  if (!token) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const anon = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
  const { data: userData, error } = await anon.auth.getUser(token);
  if (error || !userData.user?.email) return NextResponse.json({ error: "Not signed in" }, { status: 401 });

  const { data: orders } = await supabaseAdmin
    .from("orders")
    .select("id,order_number,created_at,razorpay_payment_id,status,customer_name,address_line,city,state,pincode,items,subtotal,shipping,total,tracking_id,courier")
    .ilike("email", userData.user.email)
    .order("created_at", { ascending: false });

  return NextResponse.json({ orders: orders || [], email: userData.user.email, name: userData.user.user_metadata?.full_name || "" });
}