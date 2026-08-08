export type MsgOrder = {
  customer_name: string;
  phone: string;
  status: string;
  total: number;
  items: { name: string; qty: number }[];
  city?: string;
  tracking_id?: string | null;
  courier?: string | null;
};

const BRAND = "Makheshwari Foods";
const SUPPORT = "+91 7485 001 464";

export function waMessage(o: MsgOrder) {
  const first = o.customer_name.split(" ")[0];
  const list = o.items.map((i) => `${i.name} x${i.qty}`).join(", ");
  const track = o.tracking_id ? `\n\nTracking: ${o.tracking_id}${o.courier ? ` (${o.courier})` : ""}` : "";

  switch (o.status) {
    case "paid":
      return `Namaste ${first},\n\nThank you for your order with ${BRAND}.\n\n${list}\nTotal: Rs ${o.total}\n\nWe are packing it fresh and will dispatch within 2 working days. We will send you tracking details as soon as it ships.\n\n- ${BRAND}, Samastipur`;

    case "packed":
      return `Namaste ${first},\n\nYour order is packed and ready to go out.\n\n${list}\n\nIt will be handed to the courier shortly and we will share tracking with you then.\n\n- ${BRAND}`;

    case "shipped":
      return `Namaste ${first},\n\nYour order has been dispatched.${track}\n\n${list}\n\nDelivery usually takes 3 to 7 working days. Store in a cool dry place and reseal after opening.\n\nAny questions, just reply here.\n\n- ${BRAND}`;

    case "delivered":
      return `Namaste ${first},\n\nWe can see your order has been delivered. We hope you enjoy it.\n\nIf anything is not right, message us within 48 hours with a photo and we will sort it out.\n\nIf you liked it, a review would mean a lot to a small team in Samastipur.\n\n- ${BRAND}`;

    case "cancelled":
      return `Namaste ${first},\n\nYour order has been cancelled and a full refund of Rs ${o.total} has been initiated. It should reach your account in 5 to 7 working days.\n\nSorry for the trouble. Call ${SUPPORT} if you need anything.\n\n- ${BRAND}`;

    default:
      return `Namaste ${first},\n\nAn update on your ${BRAND} order.\n\n${list}\n\n- ${BRAND}`;
  }
}

export function waLink(o: MsgOrder) {
  const num = o.phone.replace(/\D/g, "").slice(-10);
  return `https://wa.me/91${num}?text=${encodeURIComponent(waMessage(o))}`;
}

export function mailLink(o: MsgOrder, email: string) {
  const subjects: Record<string, string> = {
    paid: "Your Makheshwari order is confirmed",
    packed: "Your order is packed",
    shipped: "Your order has shipped",
    delivered: "Your order has been delivered",
    cancelled: "Your order has been cancelled",
  };
  const subject = subjects[o.status] || "Update on your Makheshwari order";
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(waMessage(o))}`;
}