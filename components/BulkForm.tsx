"use client";

import { useState } from "react";

const PHONE_RAW = "917485001464";

export default function BulkForm() {
  const [f, setF] = useState({
    name: "",
    company: "",
    city: "",
    phone: "",
    type: "Retailer",
    product: "Mixed",
    qty: "",
    notes: "",
  });
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");

  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  const submit = () => {
    if (!f.name || !f.phone || !f.qty) {
      setErr("Please fill in your name, phone number and approximate quantity.");
      return;
    }
    setErr("");

    fetch("/api/bulk-enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(f),
    }).catch(() => {});

    // The confirmation below tells the customer WhatsApp will open, so it
    // has to actually open.
    const t = `Bulk enquiry%0A%0AName: ${f.name}%0ABusiness: ${f.company}%0ACity: ${f.city}%0APhone: ${f.phone}%0AType: ${f.type}%0AProduct: ${f.product}%0AQuantity: ${f.qty}%0A%0A${f.notes}`;
    window.open(`https://wa.me/${PHONE_RAW}?text=${t}`, "_blank");

    setSent(true);
  };

  return (
    <div className="bg-paper border border-ink/12 p-6 sm:p-9 md:p-11">
      <p className="marker mb-6">Bulk enquiry</p>

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="field-label" htmlFor="b-name">Your name</label>
          <input id="b-name" autoComplete="name" className="field" placeholder="Full name" value={f.name} onChange={(e) => set("name", e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="b-co">Business name</label>
          <input id="b-co" autoComplete="organization" className="field" placeholder="Shop or company" value={f.company} onChange={(e) => set("company", e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="b-city">City</label>
          <input id="b-city" autoComplete="address-level2" className="field" placeholder="City and state" value={f.city} onChange={(e) => set("city", e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="b-ph">Phone</label>
          <input id="b-ph" type="tel" inputMode="tel" autoComplete="tel" className="field" placeholder="WhatsApp number" value={f.phone} onChange={(e) => set("phone", e.target.value)} />
        </div>
        <div>
          <label className="field-label" htmlFor="b-type">Business type</label>
          <select id="b-type" className="field" value={f.type} onChange={(e) => set("type", e.target.value)}>
            <option>Retailer</option>
            <option>Distributor</option>
            <option>Corporate gifting</option>
            <option>Exporter</option>
            <option>Private label</option>
            <option>Other</option>
          </select>
        </div>
        <div>
          <label className="field-label" htmlFor="b-prod">Product</label>
          <select id="b-prod" className="field" value={f.product} onChange={(e) => set("product", e.target.value)}>
            <option>Mixed</option>
            <option>Peri Peri</option>
            <option>Garden Mint</option>
            <option>Himalayan Pink Salt</option>
            <option>Raw makhana</option>
          </select>
        </div>
      </div>

      <div className="mt-5">
        <label className="field-label" htmlFor="b-qty">Approximate quantity</label>
        <input id="b-qty" className="field" placeholder="e.g. 200 packs per month" value={f.qty} onChange={(e) => set("qty", e.target.value)} />
      </div>

      <div className="mt-5">
        <label className="field-label" htmlFor="b-notes">Anything else</label>
        <textarea id="b-notes" rows={4} className="field resize-none" placeholder="Delivery timeline, packaging needs, questions" value={f.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>

      {err && <p className="text-peri text-sm mt-5" role="alert">{err}</p>}

      <button type="button" onClick={submit} className="btn btn-primary btn-block mt-7">
        Send enquiry
      </button>

      {sent && (
        <div className="border border-mint/50 bg-mint/10 px-6 py-5 text-center mt-6" role="status">
          <p className="font-display text-xl text-ink mb-2">Enquiry received</p>
          <p className="text-ink/65 body-text">
            We have it on record and will send pricing today. WhatsApp should have opened too.
          </p>
        </div>
      )}
    </div>
  );
}
