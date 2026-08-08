"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { formatPrice } from "@/lib/products";

type O = {
  id: string; created_at: string; razorpay_payment_id: string; status: string;
  customer_name: string; address_line: string; city: string; state: string; pincode: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number; shipping: number; total: number;
  tracking_id: string | null; courier: string | null;
};

const STEPS = ["paid", "packed", "shipped", "delivered"];
const LABEL: Record<string, string> = { paid: "Confirmed", packed: "Packed", shipped: "Shipped", delivered: "Delivered" };

export default function Account() {
  const [orders, setOrders] = useState<O[] | null>(null);
  const [me, setMe] = useState({ email: "", name: "" });
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const sb = supabaseBrowser();
      const { data } = await sb.auth.getSession();
      if (!data.session) { router.push("/login"); return; }
      const r = await fetch("/api/account/orders", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.session.access_token }),
      });
      if (!r.ok) { router.push("/login"); return; }
      const d = await r.json();
      setOrders(d.orders); setMe({ email: d.email, name: d.name });
    })();
  }, [router]);

  const out = async () => {
    await supabaseBrowser().auth.signOut();
    router.push("/");
    router.refresh();
  };

  if (!orders) return <div className="bg-cream min-h-[60vh]" />;

  return (
    <section className="bg-cream px-6 md:px-14 py-16">
      <div className="max-w-3xl mx-auto">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-4xl text-ink">{me.name ? `Hello, ${me.name.split(" ")[0]}` : "Your account"}</h1>
            <p className="text-ink/45 text-sm mt-1.5">{me.email}</p>
          </div>
          <button type="button" onClick={out} className="border border-ink/20 rounded-full px-6 py-2.5 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold transition">Log out</button>
        </div>

        <h2 className="font-display text-2xl text-ink mb-6">Orders</h2>

        {orders.length === 0 && (
          <div className="bg-white rounded-[1.5rem] border border-ink/10 p-12 text-center">
            <p className="text-ink/55 font-light mb-8">No orders yet.</p>
            <Link href="/shop" className="inline-block bg-ink text-cream rounded-full px-10 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">Shop the range</Link>
          </div>
        )}

        <div className="space-y-5">
          {orders.map((o) => {
            const at = STEPS.indexOf(o.status);
            return (
              <div key={o.id} className="bg-white rounded-[1.5rem] border border-ink/10 p-8">
                <div className="flex flex-wrap justify-between gap-4 pb-6 mb-6 border-b border-ink/10">
                  <div>
                    <p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-1.5">Order</p>
                    <p className="font-display text-lg text-ink">{o.razorpay_payment_id}</p>
                    <p className="text-ink/40 text-xs mt-1">{new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                  </div>
                  <p className="font-display text-2xl text-ink">{formatPrice(o.total)}</p>
                </div>

                {o.status === "cancelled" ? (
                  <p className="bg-peri/15 text-peri rounded-xl px-5 py-3 text-sm mb-6">Cancelled and refunded.</p>
                ) : (
                  <div className="flex items-center mb-7">
                    {STEPS.map((s, i) => (
                      <div key={s} className="flex items-center flex-1 last:flex-none">
                        <div className="flex flex-col items-center">
                          <span className={`w-3 h-3 rounded-full ${i <= at ? "bg-gold" : "bg-ink/15"}`} />
                          <span className={`text-[9px] tracking-tracksm uppercase mt-2 whitespace-nowrap ${i <= at ? "text-ink" : "text-ink/35"}`}>{LABEL[s]}</span>
                        </div>
                        {i < STEPS.length - 1 && <span className={`h-px flex-1 mx-1 ${i < at ? "bg-gold" : "bg-ink/15"}`} />}
                      </div>
                    ))}
                  </div>
                )}

                {o.tracking_id && (
                  <p className="bg-cream/70 rounded-xl px-5 py-3.5 text-sm font-light text-ink/70 mb-6">
                    Tracking: <span className="text-ink">{o.tracking_id}</span>{o.courier ? ` \u00B7 ${o.courier}` : ""}
                  </p>
                )}

                <div className="grid sm:grid-cols-2 gap-7 text-sm font-light">
                  <div>
                    <p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-3">Items</p>
                    {o.items.map((i, n) => (
                      <p key={n} className="text-ink/70 flex justify-between gap-4 mb-1.5">
                        <span>{i.name} {"\u00D7"}{i.qty}</span>
                        <span>{formatPrice(i.price * i.qty)}</span>
                      </p>
                    ))}
                  </div>
                  <div>
                    <p className="text-ink/45 text-[10px] tracking-tracksm uppercase mb-3">Delivered to</p>
                    <p className="text-ink/70 leading-relaxed">{o.customer_name}<br />{o.address_line}<br />{o.city}, {o.state} {o.pincode}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mt-7 pt-6 border-t border-ink/10">
                  <a href={`https://wa.me/917485001464?text=${encodeURIComponent(`Hi, I have a question about my order ${o.razorpay_payment_id}`)}`} target="_blank" rel="noopener noreferrer" className="bg-mint/20 border border-mint/50 rounded-full px-6 py-2.5 text-[10px] tracking-tracksm uppercase text-ink hover:bg-mint/35 transition">Need help</a>
                  <Link href="/shop" className="border border-ink/20 rounded-full px-6 py-2.5 text-[10px] tracking-tracksm uppercase text-ink/70 hover:border-gold transition">Order again</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}