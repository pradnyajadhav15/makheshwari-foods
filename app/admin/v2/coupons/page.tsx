"use client";

import { useCallback, useEffect, useState } from "react";
import { Icons } from "@/components/admin/Icons";
import { Card, PageHeader, EmptyState, TableSkeleton, useToast, Badge, Modal, ConfirmModal } from "@/components/admin/ui";
import { StatCard } from "@/components/admin/StatCard";
import { inr, shortDate } from "@/lib/admin/format";

type Coupon = {
  id: string; code: string; type: "percent" | "flat"; value: number;
  min_order: number; max_discount: number | null;
  usage_limit: number | null; used_count?: number; per_phone_limit: number | null;
  expires_at: string | null; active: boolean; created_at: string;
};

const BLANK = {
  code: "", type: "percent" as "percent" | "flat", value: "",
  min_order: "", max_discount: "", usage_limit: "", per_phone_limit: "1", expires_at: "",
};

export default function CouponsPage() {
  const { push } = useToast();
  const [rows, setRows] = useState<Coupon[] | null>(null);
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(BLANK);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<Coupon | null>(null);

  const load = useCallback(async () => {
    /* Catch the fetch itself, not just the JSON parse — a rejected fetch
       would otherwise leave the table skeleton up forever. */
    try {
      const r = await fetch("/api/admin/coupons");
      const d = await r.json().catch(() => ({}));
      setRows(d.coupons || []);
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const set = (k: keyof typeof f, v: string) => setF((p) => ({ ...p, [k]: v }));

  const create = async () => {
    setBusy(true);
    setErr("");
    const r = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: f.code, type: f.type, value: Number(f.value),
        min_order: f.min_order ? Number(f.min_order) : 0,
        max_discount: f.max_discount ? Number(f.max_discount) : null,
        usage_limit: f.usage_limit ? Number(f.usage_limit) : null,
        per_phone_limit: f.per_phone_limit === "" ? null : Number(f.per_phone_limit),
        expires_at: f.expires_at || null,
      }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(d.error || "Could not create coupon"); return; }
    push(`${f.code.toUpperCase()} created`);
    setF(BLANK);
    setOpen(false);
    load();
  };

  const toggle = async (c: Coupon) => {
    const r = await fetch("/api/admin/coupons", {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id, active: !c.active }),
    });
    if (!r.ok) { push("Could not update", "danger"); return; }
    push(c.active ? `${c.code} paused` : `${c.code} activated`);
    load();
  };

  const remove = async () => {
    if (!confirm) return;
    setBusy(true);
    const r = await fetch("/api/admin/coupons", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: confirm.id }),
    });
    setBusy(false);
    if (!r.ok) { push("Could not delete", "danger"); return; }
    push(`${confirm.code} deleted`);
    setConfirm(null);
    load();
  };

  const list = rows || [];
  const live = list.filter((c) => c.active && (!c.expires_at || new Date(c.expires_at) > new Date()));
  const totalUses = list.reduce((n, c) => n + (c.used_count || 0), 0);

  const expired = (c: Coupon) => Boolean(c.expires_at && new Date(c.expires_at) < new Date());

  return (
    <>
      <PageHeader
        title="Coupons & offers"
        subtitle="Discount codes customers can apply at checkout"
        actions={
          <button type="button" onClick={() => { setF(BLANK); setErr(""); setOpen(true); }} className="adm-btn adm-btn-primary">
            <span className="w-4 h-4 block">{Icons.plus}</span>
            New coupon
          </button>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard loading={!rows} label="Total coupons" value={String(list.length)} compare="all time" />
        <StatCard loading={!rows} label="Active now" value={String(live.length)} compare="usable at checkout" />
        <StatCard loading={!rows} label="Total redemptions" value={String(totalUses)} compare="across all codes" />
        <StatCard loading={!rows} label="Expired" value={String(list.filter(expired).length)} compare="past their end date" />
      </div>

      <Card bodyClass="">
        {rows === null ? (
          <TableSkeleton rows={5} cols={6} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.coupons}</span>}
            title="No coupons yet"
            body="Create a code and customers can apply it at checkout."
            action={<button type="button" onClick={() => setOpen(true)} className="adm-btn adm-btn-primary">New coupon</button>}
          />
        ) : (
          <div className="adm-scroll">
            <table className="adm-table min-w-[50rem]">
              <thead>
                <tr>
                  <th>Code</th><th>Discount</th><th>Minimum cart</th><th>Usage</th>
                  <th>Expires</th><th>Status</th><th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id}>
                    <td className="font-mono font-medium text-ink">{c.code}</td>
                    <td>
                      {c.type === "percent" ? `${c.value}% off` : `${inr(c.value)} off`}
                      {c.max_discount && <span className="block text-[0.7rem] text-adminmuted">max {inr(c.max_discount)}</span>}
                    </td>
                    <td className="tabular-nums">{c.min_order ? inr(c.min_order) : "—"}</td>
                    <td className="tabular-nums text-adminmuted">
                      {c.used_count ?? 0}
                      {c.usage_limit ? ` / ${c.usage_limit}` : ""}
                      {c.per_phone_limit ? <span className="block text-[0.7rem]">{c.per_phone_limit} per phone</span> : null}
                    </td>
                    <td className="text-adminmuted whitespace-nowrap">{c.expires_at ? shortDate(c.expires_at) : "No expiry"}</td>
                    <td>
                      <Badge tone={expired(c) ? "muted" : c.active ? "success" : "warn"}>
                        {expired(c) ? "Expired" : c.active ? "Active" : "Paused"}
                      </Badge>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" onClick={() => toggle(c)} className="adm-btn adm-btn-ghost adm-btn-sm">
                          {c.active ? "Pause" : "Activate"}
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirm(c)}
                          aria-label={`Delete ${c.code}`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-adminmuted hover:text-perideep hover:bg-perideep/10 transition"
                        >
                          <span className="w-4 h-4 block">{Icons.trash}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="New coupon"
        footer={
          <>
            <button type="button" onClick={() => setOpen(false)} className="adm-btn adm-btn-ghost" disabled={busy}>Cancel</button>
            <button type="button" onClick={create} className="adm-btn adm-btn-primary" disabled={busy || !f.code || !f.value}>
              {busy ? "Creating…" : "Create coupon"}
            </button>
          </>
        }
      >
        {err && <p className="text-perideep text-sm mb-4" role="alert">{err}</p>}

        <div className="space-y-4">
          <div>
            <label className="adm-field-label" htmlFor="c-code">Code *</label>
            <input
              id="c-code"
              value={f.code}
              onChange={(e) => set("code", e.target.value.toUpperCase())}
              placeholder="FIRST10"
              className="adm-input font-mono uppercase"
            />
            <p className="adm-hint">3–24 characters: letters, numbers, dash or underscore.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="adm-field-label" htmlFor="c-type">Discount type</label>
              <select id="c-type" value={f.type} onChange={(e) => set("type", e.target.value)} className="adm-select">
                <option value="percent">Percentage off</option>
                <option value="flat">Flat amount off</option>
              </select>
            </div>
            <div>
              <label className="adm-field-label" htmlFor="c-val">
                {f.type === "percent" ? "Percent off *" : "Amount off *"}
              </label>
              <input id="c-val" inputMode="numeric" value={f.value} onChange={(e) => set("value", e.target.value)} placeholder={f.type === "percent" ? "10" : "50"} className="adm-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="adm-field-label" htmlFor="c-min">Minimum cart value</label>
              <input id="c-min" inputMode="numeric" value={f.min_order} onChange={(e) => set("min_order", e.target.value)} placeholder="299" className="adm-input" />
            </div>
            <div>
              <label className="adm-field-label" htmlFor="c-max">Maximum discount</label>
              <input id="c-max" inputMode="numeric" value={f.max_discount} onChange={(e) => set("max_discount", e.target.value)} placeholder="Optional cap" className="adm-input" />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="adm-field-label" htmlFor="c-limit">Total usage limit</label>
              <input id="c-limit" inputMode="numeric" value={f.usage_limit} onChange={(e) => set("usage_limit", e.target.value)} placeholder="Blank = unlimited" className="adm-input" />
            </div>
            <div>
              <label className="adm-field-label" htmlFor="c-per">Uses per phone</label>
              <input id="c-per" inputMode="numeric" value={f.per_phone_limit} onChange={(e) => set("per_phone_limit", e.target.value)} placeholder="1" className="adm-input" />
              <p className="adm-hint">Set to 1 for a first-order-only offer.</p>
            </div>
          </div>

          <div>
            <label className="adm-field-label" htmlFor="c-exp">Expires on</label>
            <input id="c-exp" type="date" value={f.expires_at} onChange={(e) => set("expires_at", e.target.value)} className="adm-input" />
            <p className="adm-hint">Leave blank for no expiry.</p>
          </div>

          <p className="text-xs text-adminmuted border-t border-adminline pt-3">
            Product- and category-specific discounts need extra columns on the coupons table —
            the current schema scopes by cart value only.
          </p>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        busy={busy}
        danger
        confirmLabel="Delete coupon"
        title={`Delete ${confirm?.code ?? ""}?`}
        body="Customers using this code at checkout will be rejected immediately. Pausing it instead keeps the record and the usage history."
      />
    </>
  );
}
