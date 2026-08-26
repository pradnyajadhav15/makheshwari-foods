import { Resend } from "resend";
const FROM = process.env.RESEND_FROM || "Makheshwari Foods <orders@makheshwarifoods.com>";

type OrderMail = {
  paymentId: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  notes?: string;
};

export async function notifyOwner(o: OrderMail) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!key || !to) return;

  const resend = new Resend(key);
  const lines = o.items.map((i) => `${i.name} x${i.qty}`).join(", ");
  const waText = encodeURIComponent(`Hi ${o.name}, your Makheshwari order (${lines}) is confirmed. We will dispatch shortly.`);
  const waLink = `https://wa.me/91${o.phone.replace(/\D/g, "").slice(-10)}?text=${waText}`;

  const rows = o.items
    .map((i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name} &times;${i.qty}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #eee">&#8377;${i.price * i.qty}</td></tr>`)
    .join("");

  await resend.emails.send({
    from: FROM,
    to,
    subject: `New order - ${o.name} - Rs ${o.total}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;color:#12352A">
<h2 style="color:#12352A">New order</h2>
<p style="font-size:22px;margin:0 0 18px"><strong>&#8377;${o.total}</strong></p>
<table width="100%" style="font-size:14px;margin-bottom:20px">${rows}</table>
<h3 style="margin-bottom:6px">Ship to</h3>
<p style="font-size:14px;line-height:1.6;margin:0 0 18px">
${o.name}<br>${o.address}<br>${o.city}, ${o.state} ${o.pincode}<br>
Phone: ${o.phone}<br>Email: ${o.email}
${o.notes ? `<br>Notes: ${o.notes}` : ""}
</p>
<a href="${waLink}" style="display:inline-block;background:#25D366;color:#fff;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px">Message customer on WhatsApp</a>
<p style="font-size:12px;color:#888;margin-top:24px">Payment ID ${o.paymentId}</p>
</div>`,
  });
}

type CancelMail = {
  paymentId: string;
  name: string;
  phone: string;
  email: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
};

/* Cancellations are refunded by hand from the Razorpay dashboard, so this
   mail carries the payment id prominently — it is the only thing needed to
   find the charge there. */
export async function notifyOwnerCancelled(o: CancelMail) {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.OWNER_EMAIL;
  if (!key || !to) return;
  const resend = new Resend(key);
  const rows = o.items
    .map((i) => `<tr><td style="padding:8px 0;border-bottom:1px solid #eee">${i.name} &times;${i.qty}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #eee">&#8377;${i.price * i.qty}</td></tr>`)
    .join("");
  await resend.emails.send({
    from: FROM,
    to,
    subject: `REFUND DUE - ${o.name} cancelled - Rs ${o.total}`,
    html: `<div style="font-family:Arial,sans-serif;max-width:560px;color:#12352A">
<h2 style="color:#A63523">Order cancelled &mdash; refund due</h2>
<p style="font-size:22px;margin:0 0 6px"><strong>&#8377;${o.total}</strong></p>
<p style="font-size:15px;margin:0 0 18px">Refund this from the Razorpay dashboard.</p>
<p style="font-size:15px;background:#F7F3E9;padding:14px 18px;margin:0 0 20px">
Payment ID<br><strong style="font-size:17px">${o.paymentId}</strong>
</p>
<table width="100%" style="font-size:14px;margin-bottom:20px">${rows}</table>
<p style="font-size:14px;line-height:1.6;margin:0">
${o.name}<br>Phone: ${o.phone}<br>Email: ${o.email}
</p>
<p style="font-size:12px;color:#888;margin-top:24px">Stock for these items has been added back automatically.</p>
</div>`,
  });
}