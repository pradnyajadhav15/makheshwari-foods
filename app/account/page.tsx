"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { formatPrice } from "@/lib/products";
import { Skeleton, OrderSkeleton } from "@/components/Skeleton";

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

  /* The old build rendered an empty div here, so the page looked broken
     for the whole round trip. */
  if (!orders) {
    return (
      <section className="wrap-mid section" aria-busy="true">
        <p className="marker mb-4">Your account</p>
        <Skeleton className="h-10 w-64 mb-3" />
        <Skeleton className="h-4 w-48 mb-10" />
        <Skeleton className="h-6 w-24 mb-7" />
        <div className="space-y-6">
          <OrderSkeleton />
          <OrderSkeleton />
        </div>
        <span className="sr-only">Loading your orders</span>
      </section>
    );
  }

  return (
    <section className="wrap-mid section">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="marker mb-4">Your account</p>
          <h1 className="display-md text-ink">
            {me.name ? `Hello, ${me.name.split(" ")[0]}` : "Your account"}
          </h1>
          <p className="text-ink/70 text-sm mt-2 break-words">{me.email}</p>
        </div>
        <button type="button" onClick={out} className="btn btn-outline">
          Log out
        </button>
      </div>

      <h2 className="display-sm text-ink pb-4 border-b border-ink/15 mb-7">Orders</h2>

      {orders.length === 0 && (
        <div className="border border-ink/12 bg-paper p-10 md:p-14 text-center">
          <p className="text-ink/70 body-text mb-7">No orders yet.</p>
          <Link href="/shop" className="btn btn-primary">Shop the range</Link>
        </div>
      )}

      <div className="space-y-6">
        {orders.map((o) => {
          const at = STEPS.indexOf(o.status);
          return (
            <article key={o.id} className="border border-ink/12 bg-paper p-6 sm:p-8">
              <div className="flex flex-wrap justify-between gap-4 pb-6 mb-6 border-b border-ink/12">
                <div className="min-w-0">
                  <p className="text-ink/70 text-[0.62rem] tracking-tracksm uppercase mb-1.5">Order</p>
                  <p className="font-display text-lg text-ink break-words">{o.razorpay_payment_id}</p>
                  <p className="text-ink/70 text-xs mt-1">
                    {new Date(o.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>
                <p className="font-display text-2xl text-ink shrink-0">{formatPrice(o.total)}</p>
              </div>

              {o.status === "cancelled" ? (
                <p className="border border-peri/40 bg-peri/10 text-peri px-5 py-3 text-sm mb-6">
                  Cancelled and refunded.
                </p>
              ) : (
                <div className="flex items-start mb-7">
                  {STEPS.map((s, i) => (
                    <div key={s} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <span className={`w-3 h-3 rounded-full shrink-0 ${i <= at ? "bg-gold" : "bg-ink/15"}`} />
                        <span className={`text-[0.55rem] sm:text-[0.6rem] tracking-tracksm uppercase mt-2 whitespace-nowrap ${i <= at ? "text-ink" : "text-ink/70"}`}>
                          {LABEL[s]}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <span className={`h-px flex-1 mx-1 mt-1.5 self-start ${i < at ? "bg-gold" : "bg-ink/15"}`} />
                      )}
                    </div>
                  ))}
                </div>
              )}

              {o.tracking_id && (
                <p className="bg-sandsoft/70 px-5 py-3.5 body-text text-ink/70 mb-6">
                  Tracking: <span className="text-ink">{o.tracking_id}</span>
                  {o.courier ? ` · ${o.courier}` : ""}
                </p>
              )}

              <div className="grid sm:grid-cols-2 gap-7">
                <div>
                  <p className="text-ink/70 text-[0.62rem] tracking-tracksm uppercase mb-3">Items</p>
                  {o.items.map((i, n) => (
                    <p key={n} className="text-ink/70 body-text flex justify-between gap-4">
                      <span>{i.name} ×{i.qty}</span>
                      <span className="shrink-0">{formatPrice(i.price * i.qty)}</span>
                    </p>
                  ))}
                </div>
                <div>
                  <p className="text-ink/70 text-[0.62rem] tracking-tracksm uppercase mb-3">Delivered to</p>
                  <p className="text-ink/70 body-text">
                    {o.customer_name}
                    <br />
                    {o.address_line}
                    <br />
                    {o.city}, {o.state} {o.pincode}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-7 pt-6 border-t border-ink/12">
                <a
                  href={`https://wa.me/917485001464?text=${encodeURIComponent(`Hi, I have a question about my order ${o.razorpay_payment_id}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline min-h-0 py-2.5 px-6"
                >
                  Need help
                </a>
                <Link href="/shop" className="btn btn-outline min-h-0 py-2.5 px-6">
                  Order again
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
