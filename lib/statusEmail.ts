import { Resend } from "resend";

const FROM = process.env.RESEND_FROM || "Makheshwari Foods <orders@makheshwarifoods.com>";
const WA = "https://wa.me/917485001464";

type StatusMail = {
  to: string;
  name: string;
  status: string;
  orderRef: string;
  items: { name: string; qty: number; price: number }[];
  total: number;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  trackingId?: string | null;
  courier?: string | null;
};

const COPY: Record<string, { subject: string; heading: string; body: string }> = {
  packed: {
    subject: "Your order is packed",
    heading: "Packed and ready to go",
    body: "Your makhana is sealed and waiting for pickup. We will send tracking as soon as it is handed to the courier.",
  },
  shipped: {
    subject: "Your order is on its way",
    heading: "On its way",
    body: "Your order has left our Samastipur unit and is with the courier.",
  },
  delivered: {
    subject: "Your order has been delivered",
    heading: "Delivered",
    body: "Your order has been marked delivered. We hope the roast was worth the wait.",
  },
  cancelled: {
    subject: "Your order has been cancelled",
    heading: "Order cancelled",
    body: "This order has been cancelled. If a payment was taken, the refund will reach you within 5 to 7 working days.",
  },
};

export async function notifyCustomerStatus(o: StatusMail) {
  const key = process.env.RESEND_API_KEY;
  const copy = COPY[o.status];
  if (!key || !copy || !o.to) return { sent: false };

  const resend = new Resend(key);

  const rows = (o.items || [])
    .map(
      (i) =>
        `<tr><td style="padding:9px 0;border-bottom:1px solid #eee;font-size:14px">${i.name} &times;${i.qty}</td><td align="right" style="padding:9px 0;border-bottom:1px solid #eee;font-size:14px">&#8377;${i.price * i.qty}</td></tr>`
    )
    .join("");

  const tracking =
    o.status === "shipped" && o.trackingId
      ? `<div style="background:#FDF6EC;border:1px solid #E8DCC8;border-radius:14px;padding:18px 22px;margin:24px 0">
           <p style="margin:0 0 6px;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#12352A99">Tracking</p>
           <p style="margin:0;font-size:16px;color:#12352A"><strong>${o.trackingId}</strong>${o.courier ? ` &middot; ${o.courier}` : ""}</p>
         </div>`
      : "";

  const shipTo =
    o.address
      ? `<h3 style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#12352A99;margin:28px 0 8px">Delivering to</h3>
         <p style="font-size:14px;line-height:1.7;margin:0;color:#12352A">
           ${o.name}<br>${o.address}<br>${o.city || ""}${o.state ? ", " + o.state : ""} ${o.pincode || ""}
         </p>`
      : "";

  try {
    await resend.emails.send({
      from: FROM,
      to: o.to,
      subject: `${copy.subject} - Makheshwari Foods`,
      html: `<div style="font-family:Georgia,serif;max-width:560px;margin:0 auto;color:#12352A;padding:8px">
  <div style="text-align:center;padding:28px 0 8px">
    <p style="font-size:12px;letter-spacing:.28em;text-transform:uppercase;color:#C9A227;margin:0">Makheshwari Foods</p>
    <p style="font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:#12352A66;margin:6px 0 0">Rooted in Bihar</p>
  </div>

  <div style="background:#fff;border:1px solid #E8DCC8;border-radius:20px;padding:34px 30px;margin-top:18px">
    <h1 style="font-size:26px;margin:0 0 14px;color:#12352A">${copy.heading}</h1>
    <p style="font-size:15px;line-height:1.75;color:#12352AB3;margin:0 0 4px">Hi ${o.name},</p>
    <p style="font-size:15px;line-height:1.75;color:#12352AB3;margin:8px 0 0">${copy.body}</p>

    ${tracking}

    <h3 style="font-size:13px;letter-spacing:.1em;text-transform:uppercase;color:#12352A99;margin:28px 0 4px">Your order</h3>
    <table width="100%" style="border-collapse:collapse">${rows}</table>
    <p style="text-align:right;font-size:18px;margin:16px 0 0"><strong>&#8377;${o.total}</strong></p>

    ${shipTo}

    <div style="text-align:center;margin-top:34px">
      <a href="${WA}" style="display:inline-block;background:#12352A;color:#FDF6EC;padding:14px 32px;border-radius:999px;text-decoration:none;font-size:11px;letter-spacing:.18em;text-transform:uppercase">Message us on WhatsApp</a>
    </div>
  </div>

  <p style="text-align:center;font-size:11px;color:#12352A66;margin:22px 0 6px">Order reference ${o.orderRef}</p>
  <p style="text-align:center;font-size:11px;color:#12352A66;margin:0">Sonu Enterprises, Samastipur, Bihar &middot; FSSAI 10426330000072</p>
</div>`,
    });
    return { sent: true };
  } catch (e) {
    console.error("Status email failed", e);
    return { sent: false };
  }
}