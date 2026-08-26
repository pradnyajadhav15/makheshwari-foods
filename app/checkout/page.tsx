"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { formatPrice, FREE_SHIPPING_OVER } from "@/lib/products";
import { Skeleton } from "@/components/Skeleton";

declare global {
  interface Window { Razorpay: any }
}

const STATES = ["Bihar", "Uttar Pradesh", "Jharkhand", "West Bengal", "Delhi", "Maharashtra", "Karnataka", "Tamil Nadu", "Telangana", "Gujarat", "Rajasthan", "Madhya Pradesh", "Punjab", "Haryana", "Other"];

export default function Checkout() {
  const { items, subtotal, count, clear, ready } = useCart();
  const [f, setF] = useState({ name: "", email: "", phone: "", address: "", city: "", state: "Bihar", pincode: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [showErrors, setShowErrors] = useState(false);
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

  const fieldErrors: Record<string, string> = {};
  if (!f.name.trim()) fieldErrors.name = "Enter your full name";
  if (!/\S+@\S+\.\S+/.test(f.email)) fieldErrors.email = "Enter a valid email address";
  if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, ""))) fieldErrors.phone = "Enter a 10 digit mobile number";
  if (!f.address.trim()) fieldErrors.address = "Enter your delivery address";
  if (!f.city.trim()) fieldErrors.city = "Enter your city";
  if (!/^\d{6}$/.test(f.pincode)) fieldErrors.pincode = "Enter a 6 digit PIN code";

  const valid = Object.keys(fieldErrors).length === 0;
  /* Errors stay hidden until the first failed submit, so the form does not
     scold someone who has simply not finished typing yet. */
  const errFor = (k: string) => (showErrors ? fieldErrors[k] : undefined);

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
    if (!valid) {
      setShowErrors(true);
      setErr("");
      const ids: Record<string, string> = { name: "k-name", phone: "k-phone", email: "k-email", address: "k-addr", city: "k-city", pincode: "k-pin" };
      document.getElementById(ids[Object.keys(fieldErrors)[0]])?.focus();
      return;
    }
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

  /* Wait for the cart to rehydrate before deciding it is empty, or a
     customer arriving straight on /checkout sees the empty state. */
  if (!ready) {
    return (
      <section className="wrap section" aria-busy="true">
        <p className="marker mb-5">Step 2 of 2</p>
        <Skeleton className="h-10 w-52 mb-9" />
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12 items-start">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-80 w-full" />
        </div>
        <span className="sr-only">Loading checkout</span>
      </section>
    );
  }

  if (count === 0) {
    return (
      <section className="wrap section-lg text-center">
        <h1 className="display-lg text-ink">Your cart is empty</h1>
        <Link href="/shop" className="btn btn-primary mt-8">Shop the range</Link>
      </section>
    );
  }

  return (
    <section className="wrap section">
      <p className="marker mb-5">Step 2 of 2</p>
      <h1 className="display-lg text-ink mb-9">Checkout</h1>

      <div className="grid lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12 items-start">
        <div className="border border-ink/12 bg-paper p-6 sm:p-8 md:p-10">
          <h2 className="display-sm text-ink mb-7">Delivery address</h2>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="field-label" htmlFor="k-name">Full name</label>
              <input id="k-name" autoComplete="name" className={`field ${errFor("name") ? "border-perideep" : ""}`} aria-invalid={!!errFor("name")} value={f.name} onChange={(e) => set("name", e.target.value)} />
              {errFor("name") && <p className="text-perideep text-[0.7rem] mt-1.5">{errFor("name")}</p>}
            </div>
            <div>
              <label className="field-label" htmlFor="k-phone">Phone</label>
              <input id="k-phone" type="tel" inputMode="numeric" autoComplete="tel" className={`field ${errFor("phone") ? "border-perideep" : ""}`} aria-invalid={!!errFor("phone")} placeholder="10 digit mobile" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
              {errFor("phone") && <p className="text-perideep text-[0.7rem] mt-1.5">{errFor("phone")}</p>}
            </div>
          </div>

          <div className="mt-5">
            <label className="field-label" htmlFor="k-email">Email</label>
            <input id="k-email" type="email" inputMode="email" autoComplete="email" className={`field ${errFor("email") ? "border-perideep" : ""}`} aria-invalid={!!errFor("email")} value={f.email} onChange={(e) => set("email", e.target.value)} />
              {errFor("email") && <p className="text-perideep text-[0.7rem] mt-1.5">{errFor("email")}</p>}
          </div>

          <div className="mt-5">
            <label className="field-label" htmlFor="k-addr">Address</label>
            <textarea id="k-addr" rows={3} autoComplete="street-address" className={`field resize-none ${errFor("address") ? "border-perideep" : ""}`} aria-invalid={!!errFor("address")} placeholder="House, street, landmark" value={f.address} onChange={(e) => set("address", e.target.value)} />
              {errFor("address") && <p className="text-perideep text-[0.7rem] mt-1.5">{errFor("address")}</p>}
          </div>

          <div className="grid sm:grid-cols-3 gap-5 mt-5">
            <div>
              <label className="field-label" htmlFor="k-city">City</label>
              <input id="k-city" autoComplete="address-level2" className={`field ${errFor("city") ? "border-perideep" : ""}`} aria-invalid={!!errFor("city")} value={f.city} onChange={(e) => set("city", e.target.value)} />
              {errFor("city") && <p className="text-perideep text-[0.7rem] mt-1.5">{errFor("city")}</p>}
            </div>
            <div>
              <label className="field-label" htmlFor="k-state">State</label>
              <select id="k-state" autoComplete="address-level1" className="field" value={f.state} onChange={(e) => set("state", e.target.value)}>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="k-pin">PIN code</label>
              <input id="k-pin" inputMode="numeric" autoComplete="postal-code" maxLength={6} className={`field ${errFor("pincode") ? "border-perideep" : ""}`} aria-invalid={!!errFor("pincode")} placeholder="6 digits" value={f.pincode} onChange={(e) => set("pincode", e.target.value)} />
              {errFor("pincode") && <p className="text-perideep text-[0.7rem] mt-1.5">{errFor("pincode")}</p>}
            </div>
          </div>

          <div className="mt-5">
            <label className="field-label" htmlFor="k-notes">Delivery notes</label>
            <input id="k-notes" className="field" placeholder="Optional" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
          </div>
        </div>

        <div className="lg:sticky lg:top-28">
          <div className="border border-ink/12 bg-paper p-6 sm:p-7">
            <h2 className="display-sm text-ink mb-6">Summary</h2>

            <div className="space-y-3 body-text border-b border-ink/12 pb-5 mb-5">
              {items.map(({ product: p, qty }) => (
                <div key={p.slug} className="flex justify-between gap-3">
                  <span className="text-ink/70">{p.name} ×{qty}</span>
                  <span className="text-ink shrink-0">{formatPrice((p.price ?? 0) * qty)}</span>
                </div>
              ))}
            </div>

            <div className="border-b border-ink/12 pb-5 mb-5">
              {coupon ? (
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 bg-gold/15 border border-gold/45 rounded-full px-4 py-2 text-[0.64rem] tracking-tracksm uppercase text-ink">
                    {coupon.code}
                  </span>
                  <button type="button" onClick={removeCoupon} className="text-ink/70 text-[0.64rem] tracking-tracksm uppercase hover:text-perideep transition py-2">
                    Remove
                  </button>
                </div>
              ) : (
                <>
                  <label className="field-label" htmlFor="k-code">Discount code</label>
                  <div className="flex gap-2">
                    <input
                      id="k-code"
                      className="field uppercase"
                      placeholder="Enter code"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                      onKeyDown={(e) => { if (e.key === "Enter") applyCoupon(); }}
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={checking || !codeInput.trim()}
                      className="shrink-0 border border-ink text-ink px-5 rounded-lg text-[0.64rem] tracking-tracksm uppercase hover:bg-ink hover:text-cream transition disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {checking ? "…" : "Apply"}
                    </button>
                  </div>
                </>
              )}
              {couponMsg && <p className="text-perideep text-xs mt-3 font-light" role="alert">{couponMsg}</p>}
            </div>

            <div className="space-y-3 body-text border-b border-ink/12 pb-5 mb-5">
              <div className="flex justify-between">
                <span className="text-ink/70">Subtotal</span>
                <span className="text-ink">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-golddeep">
                  <span>Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-ink/70">Shipping</span>
                <span className="text-ink">{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-ink/70 text-sm">Total</span>
              <span className="font-display text-2xl md:text-3xl text-ink">{formatPrice(total)}</span>
            </div>
            <p className="text-ink/70 text-[11px] mt-1 mb-7">Inclusive of all taxes</p>

            {closed && (
              <div className="border border-gold/45 bg-gold/10 px-5 py-4 mb-5 text-ink/75 body-text">
                {closed}
              </div>
            )}

            <button
              type="button"
              onClick={pay}
              disabled={busy || Boolean(closed)}
              className="btn btn-primary btn-block"
            >
              {busy ? "Opening payment" : `Pay ${formatPrice(total)}`}
            </button>

            {err && <p className="text-perideep text-xs text-center mt-4 font-light" role="alert">{err}</p>}

            <p className="flex items-center justify-center gap-2 text-ink/70 text-[11px] mt-5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M12 3l7 3v6c0 4-3 7.5-7 9-4-1.5-7-5-7-9V6l7-3z" strokeLinejoin="round" />
              </svg>
              Secure payment via Razorpay
            </p>

            <Link href="/cart" className="block text-center text-ink/70 text-[0.66rem] tracking-tracksm uppercase mt-4 py-2 hover:text-golddeep transition">
              Back to cart
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
