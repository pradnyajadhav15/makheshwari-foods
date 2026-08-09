"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { formatPrice, FREE_SHIPPING_OVER } from "@/lib/products";

declare global {
  interface Window { Razorpay: any }
}

const STATES = ["Bihar", "Uttar Pradesh", "Jharkhand", "West Bengal", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "Gujarat", "Rajasthan", "Madhya Pradesh", "Punjab", "Haryana", "Other"];

export default function Checkout() {
  const { items, subtotal, count, clear } = useCart();
  const [f, setF] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "Bihar", pincode: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const router = useRouter();

  const [codeInput, setCodeInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponMsg, setCouponMsg] = useState("");
  const [checking, setChecking] = useState(false);
  const [closed, setClosed] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings").then((r) => r.json()).then((s) => {
      if (s?.shop_open === false) setClosed(s.shop_closed_message || "We are not taking orders right now.");
    }).catch(() => {});
  }, []);

  // Free shipping is judged on the pre-discount subtotal.
  const shipping = subtotal >= FREE_SHIPPING_OVER ? 0 : 49;
  const discount = coupon?.discount ?? 0;
  const total = Math.max(1, subtotal - discount + shipping);
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  const valid = f.name.trim() && /\S+@\S+\.\S+/.test(f.email) && /^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, "")) && f.address.trim() && f.city.trim() && /^\d{6}$/.test(f.pincode);

  const lineItems = items.map((i) => ({ slug: i.product.slug, name: i.product.name, qty: i.qty, price: i.product.price ?? 0 }));

  const applyCoupon = async () => {
    const code = codeInput.trim();
    if (!code) return;
    setChecking(true);
    setCouponMsg("");
    try {
      const r = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, lineItems, phone: f.phone }),
      });
      const d = await r.json();
      if (d.valid) {
        setCoupon({ code: d.code, discount: Number(d.discount) || 0 });
        setCouponMsg("");
      } else {
        setCoupon(null);
        setCouponMsg(d.error || "That code cannot be used");
      }
    } catch {
      setCouponMsg("Could not check that code");
    }
    setChecking(false);
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCodeInput("");
    setCouponMsg("");
  };

  const loadScript = () =>
    new Promise<boolean>((resolve) => {
      if (window.Razorpay) return resolve(true);
      const s = document.createElement("script");
      s.src = "https://checkout.razorpay.com/v1/checkout.js";
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const pay = async () => {
    if (!valid) { setErr("Please check the highlighted fields"); return; }
    setBusy(true);
    setErr("");
    try {
      const ok = await loadScript();
      if (!ok) throw new Error("Could not load payment window");

      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: f, lineItems, coupon: coupon?.code || null }),
      });
      const order = await res.json();

      if (res.status === 409) {
        setErr(order.error || "Some items are out of stock");
        if (order.couponError) { setCoupon(null); setCouponMsg(order.error); }
        setBusy(false);
        return;
      }
      if (!res.ok) throw new Error(order.error || "Could not start payment");

      const rzp = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Makheshwari Foods",
        description: `${count} item${count > 1 ? "s" : ""}`,
        order_id: order.id,
        prefill: { name: f.name, email: f.email, contact: f.phone },
        theme: { color: "#12352A" },
        handler: async (r: any) => {
          const v = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...r, customer: f, items: lineItems, subtotal: order.subtotal, shipping: order.shipping, total: order.total }),
          });
          const out = await v.json();
          if (out.verified) {
            clear();
            router.push(`/order-confirmed?id=${out.paymentId}`);
          } else {
            setErr("Payment taken but not verified. Do not pay again, contact us on WhatsApp.");
            setBusy(false);
          }
        },
        modal: { ondismiss: () => setBusy(false) },
      });
      rzp.on("payment.failed", () => { setErr("Payment failed. Please try again."); setBusy(false); });
      rzp.open();
    } catch (e: any) {
      setErr(e.message || "Something went wrong");
      setBusy(false);
    }
  };

  if (count === 0) {
    return (
      <section className="bg-cream px-6 py-32 text-center">
        <h1 className="font-display text-4xl text-ink mb-5">Your cart is empty</h1>
        <Link href="/shop" className="inline-block mt-4 bg-ink text-cream rounded-full px-11 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">Shop the range</Link>
      </section>
    );
  }

  const inp = "w-full bg-cream/60 border border-ink/15 rounded-xl px-5 py-3.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold transition";
  const lbl = "block text-ink/50 text-[10px] tracking-tracksm uppercase mb-2";

  return (
    <section className="bg-cream px-6 md:px-14 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="font-display text-4xl md:text-5xl text-ink mb-10">Checkout</h1>
        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2 bg-white rounded-[1.5rem] border border-ink/10 p-8 md:p-10">
            <h2 className="font-display text-xl text-ink mb-7">Delivery address</h2>
            <div className="grid sm:grid-cols-2 gap-5 mb-5">
              <div><label className={lbl} htmlFor="k-name">Full name</label><input id="k-name" className={inp} value={f.name} onChange={(e) => set("name", e.target.value)} /></div>
              <div><label className={lbl} htmlFor="k-phone">Phone</label><input id="k-phone" className={inp} placeholder="10 digit mobile" value={f.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            </div>
            <div className="mb-5"><label className={lbl} htmlFor="k-email">Email</label><input id="k-email" type="email" className={inp} value={f.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div className="mb-5"><label className={lbl} htmlFor="k-addr">Address</label><textarea id="k-addr" rows={3} className={inp + " resize-none"} placeholder="House, street, landmark" value={f.address} onChange={(e) => set("address", e.target.value)} /></div>
            <div className="grid sm:grid-cols-3 gap-5 mb-5">
              <div><label className={lbl} htmlFor="k-city">City</label><input id="k-city" className={inp} value={f.city} onChange={(e) => set("city", e.target.value)} /></div>
              <div><label className={lbl} htmlFor="k-state">State</label><select id="k-state" className={inp} value={f.state} onChange={(e) => set("state", e.target.value)}>{STATES.map((s) => <option key={s}>{s}</option>)}</select></div>
              <div><label className={lbl} htmlFor="k-pin">PIN code</label><input id="k-pin" className={inp} placeholder="6 digits" value={f.pincode} onChange={(e) => set("pincode", e.target.value)} /></div>
            </div>
            <div><label className={lbl} htmlFor="k-notes">Delivery notes</label><input id="k-notes" className={inp} placeholder="Optional" value={f.notes} onChange={(e) => set("notes", e.target.value)} /></div>
          </div>

          <div>
            <div className="bg-white rounded-[1.5rem] border border-ink/10 p-7 sticky top-28">
              <h2 className="font-display text-xl text-ink mb-6">Summary</h2>
              <div className="space-y-3 text-sm font-light border-b border-ink/10 pb-5 mb-5">
                {items.map(({ product: p, qty }) => (
                  <div key={p.slug} className="flex justify-between gap-3"><span className="text-ink/60">{p.name} &times;{qty}</span><span className="text-ink">{formatPrice((p.price ?? 0) * qty)}</span></div>
                ))}
              </div>

              <div className="border-b border-ink/10 pb-5 mb-5">
                {coupon ? (
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex items-center gap-2 bg-gold/15 border border-gold/40 rounded-full px-4 py-2 text-[10px] tracking-tracksm uppercase text-ink">
                      {coupon.code}
                    </span>
                    <button type="button" onClick={removeCoupon} className="text-ink/40 text-[10px] tracking-tracksm uppercase hover:text-peri transition">Remove</button>
                  </div>
                ) : (
                  <>
                    <label className={lbl} htmlFor="k-code">Discount code</label>
                    <div className="flex gap-2">
                      <input
                        id="k-code"
                        className={inp + " uppercase"}
                        placeholder="Enter code"
                        value={codeInput}
                        onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                        onKeyDown={(e) => { if (e.key === "Enter") applyCoupon(); }}
                      />
                      <button
                        type="button"
                        onClick={applyCoupon}
                        disabled={checking || !codeInput.trim()}
                        className="shrink-0 border border-ink text-ink rounded-xl px-5 text-[10px] tracking-tracksm uppercase hover:bg-ink hover:text-cream transition disabled:opacity-40"
                      >
                        {checking ? "..." : "Apply"}
                      </button>
                    </div>
                  </>
                )}
                {couponMsg && <p className="text-peri text-xs mt-3 font-light">{couponMsg}</p>}
              </div>

              <div className="space-y-3 text-sm font-light border-b border-ink/10 pb-5 mb-5">
                <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span className="text-ink">{formatPrice(subtotal)}</span></div>
                {discount > 0 && (
                  <div className="flex justify-between"><span className="text-gold">Discount</span><span className="text-gold">&minus;{formatPrice(discount)}</span></div>
                )}
                <div className="flex justify-between"><span className="text-ink/60">Shipping</span><span className="text-ink">{shipping === 0 ? "Free" : formatPrice(shipping)}</span></div>
              </div>

              <div className="flex justify-between items-baseline mb-2"><span className="text-ink/60 text-sm">Total</span><span className="font-display text-2xl text-ink">{formatPrice(total)}</span></div>
              <p className="text-ink/40 text-[11px] mb-7">Inclusive of all taxes</p>
              {closed && (
                <div className="bg-gold/15 border border-gold/40 rounded-xl px-5 py-4 mb-5 text-ink/75 text-sm font-light">{closed}</div>
              )}
              <button type="button" onClick={pay} disabled={busy || Boolean(closed)} className="w-full bg-ink text-cream rounded-full py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition disabled:opacity-50">
                {busy ? "Opening payment" : `Pay ${formatPrice(total)}`}
              </button>
              {err && <p className="text-peri text-xs text-center mt-4 font-light">{err}</p>}
              <Link href="/cart" className="block text-center text-ink/50 text-[11px] tracking-tracksm uppercase mt-5 hover:text-gold transition">Back to cart</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}