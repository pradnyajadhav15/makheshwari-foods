"use client";

import { useState } from "react";

const PHONE_RAW = "917485001464";

export default function BulkForm() {
  const [f, setF] = useState({ name: "", company: "", city: "", phone: "", type: "Retailer", product: "Mixed", qty: "", notes: "" });
  const [sent, setSent] = useState(false);

  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  const submit = () => {
    if (!f.name || !f.phone || !f.qty) return;
    fetch("/api/bulk-enquiry", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(f) }).catch(() => {});
    const t = `Bulk enquiry%0A%0AName: ${f.name}%0ABusiness: ${f.company}%0ACity: ${f.city}%0APhone: ${f.phone}%0AType: ${f.type}%0AProduct: ${f.product}%0AQuantity: ${f.qty}%0A%0A${f.notes}`;
    
    setSent(true);
  };

  const inp = "w-full bg-cream/60 border border-ink/15 rounded-xl px-5 py-3.5 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold transition";
  const lbl = "block text-ink/50 text-[10px] tracking-tracksm uppercase mb-2";

  return (
    <div className="bg-white rounded-[1.5rem] border border-ink/10 p-8 md:p-11">
      <div className="grid sm:grid-cols-2 gap-5 mb-5">
        <div>
          <label className={lbl} htmlFor="b-name">Your name</label>
          <input id="b-name" className={inp} placeholder="Full name" value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className={lbl} htmlFor="b-co">Business name</label>
          <input id="b-co" className={inp} placeholder="Shop or company" value={f.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label className={lbl} htmlFor="b-city">City</label>
          <input id="b-city" className={inp} placeholder="City and state" value={f.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div>
          <label className={lbl} htmlFor="b-ph">Phone</label>
          <input id="b-ph" className={inp} placeholder="WhatsApp number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className={lbl} htmlFor="b-type">Business type</label>
          <select id="b-type" className={inp} value={f.type} onChange={(e) => set("type", e.target.value)}>
            <option>Retailer</option>
            <option>Distributor</option>
            <option>Corporate gifting</option>
            <option>Exporter</option>
            <option>Private label</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className={lbl} htmlFor="b-prod">Product</label>
          <select id="b-prod" className={inp} value={f.product} onChange={(e) => set("product", e.target.value)}>
            <option>Mixed</option>
            <option>Peri Peri</option>
            <option>Garden Mint</option>
            <option>Himalayan Pink Salt</option>
            <option>Raw makhana</option>
          </select>
        </div>
      </div>
      <div className="mb-5">
        <label className={lbl} htmlFor="b-qty">Approximate quantity</label>
        <input id="b-qty" className={inp} placeholder="e.g. 200 packs per month" value={f.qty} onChange={(e) => set("qty", e.target.value)} />
      </div>
      <div className="mb-8">
        <label className={lbl} htmlFor="b-notes">Anything else</label>
        <textarea id="b-notes" rows={4} className={inp + " resize-none"} placeholder="Delivery timeline, packaging needs, questions" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>
      <button type="button" onClick={submit} className="w-full bg-ink text-cream rounded-full py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
        Send enquiry
      </button>
      {sent && <p className="bg-mint/15 border border-mint/40 rounded-xl px-6 py-5 text-center mt-6"><span className="block font-display text-xl text-ink mb-2">Enquiry received</span><span className="block text-ink/60 text-sm font-light">We have it on record and will send pricing today. WhatsApp should have opened too.</span></p>}
    </div>
  );
}