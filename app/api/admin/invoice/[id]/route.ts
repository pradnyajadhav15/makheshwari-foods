import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";
import { ensureInvoice } from "@/lib/invoice";
import { buildInvoicePdf } from "@/lib/invoicePdf";

export const runtime = "nodejs";

export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  const inv = await ensureInvoice(id);
  if (!inv) return NextResponse.json({ error: "No invoice for this order yet" }, { status: 404 });

  const { data: order, error } = await supabaseAdmin.from("orders").select("*").eq("id", id).single();
  if (error || !order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  const bytes = await buildInvoicePdf(order, inv.invoice_no);

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${inv.invoice_no.replace(/\//g, "-")}.pdf"`,
    },
  });
}