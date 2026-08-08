import { Resend } from "resend";

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
    from: "Makheshwari Orders <onboarding@resend.dev>",
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