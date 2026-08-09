import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { ensureInvoice } from "@/lib/invoice";
import { buildInvoicePdf } from "@/lib/invoicePdf";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limit = await rateLimit("invoice:ip", clientIp(req), 20, 60 * 60);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const { orderId, phone } = await req.json();
  const num = String(phone || "").replace(/\D/g, "").slice(-10);

  if (!orderId || !/^[6-9]\d{9}$/.test(num)) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // The phone must match the order, so one customer cannot pull another's invoice.
  const { data: order } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .maybeSingle();

  if (!order || String(order.phone || "").replace(/\D/g, "").slice(-10) !== num) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const inv = await ensureInvoice(orderId);
  if (!inv) return NextResponse.json({ error: "Invoice not available yet" }, { status: 404 });

  const bytes = await buildInvoicePdf(order, inv.invoice_no);

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${inv.invoice_no.replace(/\//g, "-")}.pdf"`,
    },
  });
}