"use client";

import { useEffect, useState } from "react";
import { Card, PageHeader, useToast, Sk, DemoNotice } from "@/components/admin/ui";
import { FSSAI, GSTIN, LEGAL_ENTITY } from "@/lib/products";

type Settings = {
  announcement: string; announcement_active: boolean;
  whatsapp: string; support_email: string; support_phone: string; instagram: string;
  shop_open: boolean; shop_closed_message: string; min_order: number;
};

const SECTIONS = ["Store", "Storefront", "Orders", "Compliance", "Security"] as const;
type Section = (typeof SECTIONS)[number];

export default function SettingsPage() {
  const { push } = useToast();
  const [s, setS] = useState<Settings | null>(null);
  const [tab, setTab] = useState<Section>("Store");
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setS(d))
      .catch(() => {});
  }, []);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setS((p) => (p ? { ...p, [k]: v } : p));
    setDirty(true);
  };

  const save = async () => {
    if (!s) return;
    setBusy(true);
    const r = await fetch("/api/admin/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(s),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { push(d.error || "Could not save", "danger"); return; }
    setS(d);
    setDirty(false);
    push("Settings saved");
  };

  if (!s) {
    return (
      <>
        <PageHeader title="Settings" />
        <div className="space-y-4 max-w-2xl">
          <Sk className="h-10 w-full" /><Sk className="h-32 w-full" /><Sk className="h-32 w-full" />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Store configuration used by the live storefront"
        actions={
          <button type="button" onClick={save} disabled={busy || !dirty} className="adm-btn adm-btn-primary">
            {busy ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        }
      />

      <div className="flex gap-1 flex-wrap border-b border-adminline mb-5">
        {SECTIONS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-pressed={tab === t}
            className={`px-3 py-2 text-sm border-b-2 -mb-px transition ${
              tab === t ? "border-gold text-ink font-medium" : "border-transparent text-adminmuted hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-3xl space-y-5">
        {tab === "Store" && (
          <Card title="Contact details">
            <div className="space-y-4">
              <div>
                <label className="adm-field-label" htmlFor="s-wa">WhatsApp number</label>
                <input id="s-wa" value={s.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} className="adm-input" />
                <p className="adm-hint">Country code without +, e.g. 917485001464. Used by the floating button and every WhatsApp link.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="adm-field-label" htmlFor="s-email">Support email</label>
                  <input id="s-email" type="email" value={s.support_email} onChange={(e) => set("support_email", e.target.value)} className="adm-input" />
                </div>
                <div>
                  <label className="adm-field-label" htmlFor="s-phone">Support phone</label>
                  <input id="s-phone" value={s.support_phone} onChange={(e) => set("support_phone", e.target.value)} className="adm-input" />
                </div>
              </div>
              <div>
                <label className="adm-field-label" htmlFor="s-ig">Instagram URL</label>
                <input id="s-ig" value={s.instagram} onChange={(e) => set("instagram", e.target.value)} className="adm-input" />
              </div>
            </div>
          </Card>
        )}

        {tab === "Storefront" && (
          <>
            <Card title="Announcement bar">
              <div className="space-y-4">
                <label className="flex items-center gap-2.5 text-sm">
                  <input type="checkbox" checked={s.announcement_active} onChange={(e) => set("announcement_active", e.target.checked)} className="accent-ink w-4 h-4" />
                  Show the announcement bar
                </label>
                <div>
                  <label className="adm-field-label" htmlFor="s-ann">Message</label>
                  <input id="s-ann" value={s.announcement} onChange={(e) => set("announcement", e.target.value)} className="adm-input" />
                  <p className="adm-hint">Appears at the very top of every storefront page.</p>
                </div>
                <div className="rounded-lg bg-inkdeep px-4 py-3 text-center">
                  <span className="text-goldsoft text-[0.7rem] tracking-[0.18em] uppercase">
                    {s.announcement || "Your message here"}
                  </span>
                </div>
              </div>
            </Card>

            <Card title="Shop availability">
              <div className="space-y-4">
                <label className="flex items-center gap-2.5 text-sm">
                  <input type="checkbox" checked={s.shop_open} onChange={(e) => set("shop_open", e.target.checked)} className="accent-ink w-4 h-4" />
                  Accepting orders
                </label>
                <div>
                  <label className="adm-field-label" htmlFor="s-closed">Closed message</label>
                  <input id="s-closed" value={s.shop_closed_message} onChange={(e) => set("shop_closed_message", e.target.value)} className="adm-input" />
                  <p className="adm-hint">Shown on checkout when orders are switched off. The Pay button is disabled.</p>
                </div>
              </div>
            </Card>
          </>
        )}

        {tab === "Orders" && (
          <>
            <Card title="Order rules">
              <div>
                <label className="adm-field-label" htmlFor="s-min">Minimum order value (₹)</label>
                <input id="s-min" inputMode="numeric" value={String(s.min_order)} onChange={(e) => set("min_order", Number(e.target.value) || 0)} className="adm-input max-w-xs" />
                <p className="adm-hint">Customers below this cannot check out. Set to 0 to disable.</p>
              </div>
            </Card>

            <Card title="Shipping & tax">
              <dl className="divide-y divide-adminline text-sm">
                <div className="flex justify-between py-3"><dt className="text-adminmuted">Flat shipping</dt><dd>₹49</dd></div>
                <div className="flex justify-between py-3"><dt className="text-adminmuted">Free shipping over</dt><dd>₹499</dd></div>
                <div className="flex justify-between py-3"><dt className="text-adminmuted">Tax handling</dt><dd>GST inclusive in listed price</dd></div>
              </dl>
              <p className="adm-hint mt-3">
                These are constants in <code className="font-mono text-xs">lib/products.ts</code> and
                <code className="font-mono text-xs"> app/checkout/page.tsx</code>. Making them editable needs new settings keys.
              </p>
            </Card>

            <Card title="Email notifications">
              <DemoNotice what="Order status emails already send via Resend on every status change. There is no per-event toggle stored yet." />
              <dl className="divide-y divide-adminline text-sm mt-4">
                {[
                  ["Order confirmation", "Sent on payment"],
                  ["Status change", "Sent when you update an order"],
                  ["Owner alert", "Sent to OWNER_EMAIL"],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-3"><dt className="text-adminmuted">{k}</dt><dd>{v}</dd></div>
                ))}
              </dl>
            </Card>
          </>
        )}

        {tab === "Compliance" && (
          <Card title="Legal & compliance">
            <dl className="divide-y divide-adminline text-sm">
              <div className="flex justify-between gap-4 py-3"><dt className="text-adminmuted">Legal entity</dt><dd>{LEGAL_ENTITY}</dd></div>
              <div className="flex justify-between gap-4 py-3"><dt className="text-adminmuted">FSSAI licence</dt><dd className="font-mono text-xs">{FSSAI}</dd></div>
              <div className="flex justify-between gap-4 py-3"><dt className="text-adminmuted">GSTIN</dt><dd className="font-mono text-xs">{GSTIN}</dd></div>
              <div className="flex justify-between gap-4 py-3"><dt className="text-adminmuted">Registered address</dt><dd className="text-right">Samastipur, Bihar 848101</dd></div>
            </dl>
            <p className="adm-hint mt-4">
              These are constants in <code className="font-mono text-xs">lib/products.ts</code> and appear on invoices,
              the footer and every legal page. Changing them is a code edit on purpose — they are regulated identifiers.
            </p>
          </Card>
        )}

        {tab === "Security" && (
          <Card title="Admin access">
            <dl className="divide-y divide-adminline text-sm">
              <div className="flex justify-between py-3"><dt className="text-adminmuted">Authentication</dt><dd>Single shared password</dd></div>
              <div className="flex justify-between py-3"><dt className="text-adminmuted">Session</dt><dd>HMAC-signed cookie, 7 days</dd></div>
              <div className="flex justify-between py-3"><dt className="text-adminmuted">Password source</dt><dd className="font-mono text-xs">ADMIN_PASSWORD</dd></div>
            </dl>

            <div className="mt-5 rounded-lg border border-golddeep/30 bg-gold/10 px-4 py-3">
              <p className="text-sm text-ink font-medium mb-1">Changing the password</p>
              <p className="text-sm text-ink/80 leading-relaxed">
                The password lives in the <code className="font-mono text-xs">ADMIN_PASSWORD</code> environment
                variable, not the database, so it is changed in your hosting dashboard and takes effect on redeploy.
                Rotating it invalidates every existing session, because the same value signs the cookie.
              </p>
            </div>

            <p className="adm-hint mt-4">
              Per-user admin accounts, roles and 2FA would need a real user table — worth doing before more
              than one person has access.
            </p>
          </Card>
        )}
      </div>
    </>
  );
}
