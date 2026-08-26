import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { computeTax, GST_RATE, HSN } from "@/lib/gst";
import { GSTIN, FSSAI, LEGAL_ENTITY, EMAIL } from "@/lib/products";

const INK = rgb(0.07, 0.21, 0.16);
const GREY = rgb(0.42, 0.45, 0.44);
const LINE = rgb(0.85, 0.85, 0.83);
const GOLD = rgb(0.79, 0.64, 0.15);

type OrderRow = {
  order_number?: number | null;
  razorpay_payment_id: string | null;
  razorpay_order_id: string | null;
  created_at: string;
  customer_name: string;
  phone: string;
  email: string | null;
  address_line: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  shipping: number;
  discount?: number | null;
  coupon_code?: string | null;
  total: number;
};

const money = (n: number) => "Rs " + (Number(n) || 0).toFixed(2);

export async function buildInvoicePdf(order: OrderRow, invoiceNo: string): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([595, 842]); // A4
  const reg = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  const M = 46;
  let y = 792;

  const text = (s: string, x: number, yy: number, size = 9, font = reg, color = INK) =>
    page.drawText(s, { x, y: yy, size, font, color });

  const right = (s: string, xEnd: number, yy: number, size = 9, font = reg, color = INK) =>
    page.drawText(s, { x: xEnd - font.widthOfTextAtSize(s, size), y: yy, size, font, color });

  const rule = (yy: number, color = LINE, thickness = 0.7) =>
    page.drawLine({ start: { x: M, y: yy }, end: { x: 595 - M, y: yy }, thickness, color });

  // ---------- header ----------
  text("MAKHESHWARI FOODS", M, y, 16, bold);
  y -= 14;
  text("Rooted in Bihar", M, y, 8, reg, GOLD);

  right("TAX INVOICE", 595 - M, 792, 13, bold);
  right(invoiceNo, 595 - M, 776, 9);
  right(new Date(order.created_at).toLocaleDateString("en-IN"), 595 - M, 764, 9, reg, GREY);

  y -= 22;
  rule(y, GOLD, 1.2);
  y -= 20;

  // ---------- seller ----------
  text(LEGAL_ENTITY, M, y, 10, bold);
  y -= 13;
  for (const l of [
    "Hasanpur Sarsuna, P.O. Bangra",
    "Dist. Samastipur, Bihar",
    `GSTIN: ${GSTIN}`,
    `FSSAI: ${FSSAI}`,
    EMAIL,
  ]) {
    text(l, M, y, 8.5, reg, GREY);
    y -= 11;
  }

  // ---------- buyer ----------
  let by = y + 68;
  text("BILL TO", 320, by, 8, bold, GREY);
  by -= 14;
  text(order.customer_name || "-", 320, by, 10, bold);
  by -= 12;
  for (const l of [
    order.address_line || "",
    [order.city, order.state, order.pincode].filter(Boolean).join(", "),
    order.phone || "",
    order.email || "",
  ].filter(Boolean)) {
    text(String(l).slice(0, 46), 320, by, 8.5, reg, GREY);
    by -= 11;
  }

  y = Math.min(y, by) - 16;

  const tax = computeTax(order.total, order.state);
  text(`Place of supply: ${order.state || "-"}`, M, y, 8.5, reg, GREY);
  y -= 20;

  // ---------- table head ----------
  page.drawRectangle({ x: M, y: y - 4, width: 595 - M * 2, height: 20, color: rgb(0.96, 0.95, 0.92) });
  text("DESCRIPTION", M + 8, y + 2, 8, bold, GREY);
  text("HSN", 300, y + 2, 8, bold, GREY);
  right("QTY", 390, y + 2, 8, bold, GREY);
  right("RATE", 460, y + 2, 8, bold, GREY);
  right("AMOUNT", 595 - M - 8, y + 2, 8, bold, GREY);
  y -= 26;

  for (const it of order.items || []) {
    text(String(it.name).slice(0, 40), M + 8, y, 9);
    text(HSN, 300, y, 8.5, reg, GREY);
    right(String(it.qty), 390, y, 9);
    right((Number(it.price) || 0).toFixed(2), 460, y, 9);
    right(((Number(it.price) || 0) * it.qty).toFixed(2), 595 - M - 8, y, 9);
    y -= 17;
  }

  y -= 4;
  rule(y);
  y -= 18;

  // ---------- totals ----------
  const row = (label: string, value: string, strong = false) => {
    const f = strong ? bold : reg;
    right(label, 470, y, strong ? 10 : 9, f, strong ? INK : GREY);
    right(value, 595 - M - 8, y, strong ? 10 : 9, f);
    y -= 15;
  };

  row("Subtotal", money(order.subtotal));
  if (order.discount && order.discount > 0) {
    row(`Discount${order.coupon_code ? " (" + order.coupon_code + ")" : ""}`, "-" + money(order.discount));
  }
  if (order.shipping > 0) row("Shipping", money(order.shipping));

  y -= 4;
  rule(y);
  y -= 16;

  row(`Taxable value`, money(tax.taxable));
  if (tax.intra) {
    row(`CGST @ ${(GST_RATE * 50).toFixed(0)}%`, money(tax.cgst));
    row(`SGST @ ${(GST_RATE * 50).toFixed(0)}%`, money(tax.sgst));
  } else {
    row(`IGST @ ${(GST_RATE * 100).toFixed(0)}%`, money(tax.igst));
  }

  y -= 4;
  rule(y, INK, 1);
  y -= 18;
  row("Total", money(order.total), true);

  y -= 6;
  right("All prices are inclusive of GST", 595 - M - 8, y, 7.5, reg, GREY);

  // ---------- footer ----------
  const fy = 96;
  rule(fy + 34, LINE);
  text("Payment reference", M, fy + 18, 8, bold, GREY);
  text(order.razorpay_payment_id || order.razorpay_order_id || "-", M, fy + 6, 8.5);

  /* The customer quotes this, not the payment reference. Placed on the same
     baselines in the gap between the reference block and the signatory block
     on the right, so nothing shifts. */
  if (order.order_number) {
    text("Order", M + 170, fy + 18, 8, bold, GREY);
    text(`MF-${order.order_number}`, M + 170, fy + 6, 8.5);
  }

  text("This is a computer generated invoice and does not require a signature.", M, fy - 16, 7.5, reg, GREY);
  text(`For ${LEGAL_ENTITY}`, 595 - M - 130, fy + 18, 8, bold, GREY);
  text("Authorised signatory", 595 - M - 130, fy - 16, 7.5, reg, GREY);

  return await pdf.save();
}