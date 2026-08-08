"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submit = () => {
    if (!form.name || !form.email || !form.message) return;
    const text = `Hi, I am ${form.name}.%0A%0A${form.message}%0A%0AEmail: ${form.email}%0APhone: ${form.phone}`;
    window.open(`https://wa.me/917485001464?text=${text}`, "_blank");
    setSent(true);
  };

  const field = "w-full bg-cream/60 border border-ink/15 rounded-xl px-5 py-4 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-gold transition";
  const label = "block text-ink/50 text-[10px] tracking-tracksm uppercase mb-2.5";

  return (
    <div className="bg-white rounded-[1.5rem] border border-ink/10 p-8 md:p-11">
      <div className="mb-6">
        <label className={label} htmlFor="c-name">Name</label>
        <input id="c-name" className={field} placeholder="Your full name" value={form.name} onChange={(e) => set("name", e.target.value)} />
      </div>
      <div className="mb-6">
        <label className={label} htmlFor="c-email">Email</label>
        <input id="c-email" type="email" className={field} placeholder="your@email.com" value={form.email} onChange={(e) => set("email", e.target.value)} />
      </div>
      <div className="mb-6">
        <label className={label} htmlFor="c-phone">Phone</label>
        <input id="c-phone" className={field} placeholder="Your phone number" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
      </div>
      <div className="mb-8">
        <label className={label} htmlFor="c-msg">Message</label>
        <textarea id="c-msg" rows={5} className={field + " resize-none"} placeholder="Tell us how we can help" value={form.message} onChange={(e) => set("message", e.target.value)} />
      </div>
      <button type="button" onClick={submit} className="w-full bg-ink text-cream rounded-full py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
        Send message
      </button>
      {sent && <p className="text-mint text-sm text-center mt-5 font-light">Opening WhatsApp. If nothing happened, message us directly.</p>}
    </div>
  );
}