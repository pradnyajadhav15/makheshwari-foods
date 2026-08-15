"use client";

import { useState } from "react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  const submit = () => {
    if (!form.name || !form.email || !form.message) {
      setErr("Please fill in your name, email and message.");
      return;
    }
    setErr("");
    const text = `Hi, I am ${form.name}.%0A%0A${form.message}%0A%0AEmail: ${form.email}%0APhone: ${form.phone}`;
    window.open(`https://wa.me/917485001464?text=${text}`, "_blank");
    setSent(true);
  };

  return (
    <div className="bg-paper border border-ink/12 p-6 sm:p-9 md:p-11">
      <p className="marker mb-6">Send a message</p>

      <div className="space-y-5">
        <div>
          <label className="field-label" htmlFor="c-name">Name</label>
          <input
            id="c-name"
            className="field"
            autoComplete="name"
            placeholder="Your full name"
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="field-label" htmlFor="c-email">Email</label>
            <input
              id="c-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              className="field"
              placeholder="your@email.com"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div>
            <label className="field-label" htmlFor="c-phone">Phone</label>
            <input
              id="c-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              className="field"
              placeholder="Your phone number"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="c-msg">Message</label>
          <textarea
            id="c-msg"
            rows={5}
            className="field resize-none"
            placeholder="Tell us how we can help"
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
          />
        </div>
      </div>

      {err && <p className="text-perideep text-sm mt-5" role="alert">{err}</p>}

      <button type="button" onClick={submit} className="btn btn-primary btn-block mt-7">
        Send message
      </button>

      {sent && (
        <p className="text-ink/70 text-sm text-center mt-5 font-light" role="status">
          Opening WhatsApp. If nothing happened, message us directly on +91 74850 01464.
        </p>
      )}
    </div>
  );
}
