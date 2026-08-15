"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Icons } from "@/components/admin/Icons";
import { Card, PageHeader, EmptyState, TableSkeleton, useToast, Badge, ConfirmModal } from "@/components/admin/ui";
import { StatCard } from "@/components/admin/StatCard";
import { dateTime, relative } from "@/lib/admin/format";

type Enquiry = {
  id: string; created_at: string; name: string; company: string | null;
  city: string | null; phone: string; business_type: string | null;
  product: string | null; quantity: string | null; notes: string | null; status: string;
};

const STATUSES = [
  { key: "new", label: "New", tone: "warn" as const },
  { key: "contacted", label: "Contacted", tone: "info" as const },
  { key: "quoted", label: "Quoted", tone: "info" as const },
  { key: "won", label: "Won", tone: "success" as const },
  { key: "lost", label: "Lost", tone: "muted" as const },
];

const FILTERS = [{ key: "all", label: "All" }, ...STATUSES.map((s) => ({ key: s.key, label: s.label }))];

function toneFor(status: string) {
  return STATUSES.find((s) => s.key === status)?.tone ?? "neutral";
}

export default function EnquiriesPage() {
  const { push } = useToast();
  const [rows, setRows] = useState<Enquiry[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState<Enquiry | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/enquiries");
      const d = await r.json().catch(() => ({}));
      setRows(d.enquiries || []);
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const mark = async (e: Enquiry, status: string) => {
    const r = await fetch("/api/admin/enquiries", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: e.id, status }),
    });
    if (!r.ok) { push("Could not update", "danger"); return; }
    push(`${e.name} marked ${status}`);
    load();
  };

  const remove = async () => {
    if (!confirm) return;
    setBusy(true);
    const r = await fetch("/api/admin/enquiries", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: confirm.id }),
    });
    setBusy(false);
    if (!r.ok) { push("Could not delete", "danger"); return; }
    push("Enquiry deleted");
    setConfirm(null);
    load();
  };

  const all = rows || [];
  const view = useMemo(
    () => (filter === "all" ? all : all.filter((e) => e.status === filter)),
    [all, filter]
  );

  const count = (k: string) => all.filter((e) => e.status === k).length;

  return (
    <>
      <PageHeader
        title="Bulk enquiries"
        subtitle="Wholesale and reseller leads from the bulk orders form"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard loading={!rows} label="Total enquiries" value={String(all.length)} compare="all time" />
        <StatCard loading={!rows} label="New" value={String(count("new"))} compare="awaiting a reply" tone={count("new") ? "warn" : "neutral"} />
        <StatCard loading={!rows} label="In progress" value={String(count("contacted") + count("quoted"))} compare="contacted or quoted" />
        <StatCard loading={!rows} label="Won" value={String(count("won"))} compare="converted to business" />
      </div>

      <Card
        bodyClass=""
        action={
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                type="button"
                onClick={() => setFilter(f.key)}
                aria-pressed={filter === f.key}
                className={`px-2.5 py-1.5 rounded-full text-xs border transition ${
                  filter === f.key ? "bg-ink text-cream border-ink" : "border-adminline text-adminmuted hover:text-ink"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        }
        title="Enquiries"
      >
        {rows === null ? (
          <TableSkeleton rows={4} cols={4} />
        ) : view.length === 0 ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.customers}</span>}
            title={all.length === 0 ? "No enquiries yet" : "Nothing in this filter"}
            body={
              all.length === 0
                ? "Submissions from the bulk orders page land here."
                : "Try another status filter."
            }
          />
        ) : (
          <ul className="divide-y divide-adminline">
            {view.map((e) => (
              <li key={e.id} className={`p-4 sm:p-5 ${e.status === "new" ? "bg-gold/5" : ""}`}>
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-medium text-ink">{e.name}</span>
                      <Badge tone={toneFor(e.status)}>
                        {STATUSES.find((s) => s.key === e.status)?.label ?? e.status}
                      </Badge>
                    </div>
                    <p className="text-[0.72rem] text-adminmuted mt-1">
                      {e.company || "No business name"}
                      {e.city ? ` · ${e.city}` : ""} · {relative(e.created_at)}
                    </p>
                  </div>

                  <select
                    value={e.status}
                    onChange={(ev) => mark(e, ev.target.value)}
                    aria-label={`Status for ${e.name}`}
                    className="adm-select w-auto min-w-[9rem] text-xs"
                  >
                    {STATUSES.map((s) => (
                      <option key={s.key} value={s.key}>{s.label}</option>
                    ))}
                  </select>
                </div>

                <dl className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-2 text-sm">
                  <div>
                    <dt className="adm-label">Phone</dt>
                    <dd className="text-ink">{e.phone}</dd>
                  </div>
                  <div>
                    <dt className="adm-label">Business type</dt>
                    <dd className="text-ink">{e.business_type || "—"}</dd>
                  </div>
                  <div>
                    <dt className="adm-label">Product</dt>
                    <dd className="text-ink">{e.product || "—"}</dd>
                  </div>
                  <div>
                    <dt className="adm-label">Quantity</dt>
                    <dd className="text-ink">{e.quantity || "—"}</dd>
                  </div>
                </dl>

                {e.notes && (
                  <p className="text-sm text-ink/80 mt-3 bg-sandsoft/50 rounded-lg px-3.5 py-2.5">{e.notes}</p>
                )}

                <div className="flex flex-wrap gap-2 mt-4">
                  <a
                    href={`https://wa.me/91${String(e.phone).replace(/\D/g, "").slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="adm-btn adm-btn-ghost adm-btn-sm"
                  >
                    WhatsApp
                  </a>
                  <a href={`tel:${e.phone}`} className="adm-btn adm-btn-ghost adm-btn-sm">Call</a>
                  <button type="button" onClick={() => setConfirm(e)} className="adm-btn adm-btn-danger adm-btn-sm">
                    Delete
                  </button>
                </div>

                <p className="text-[0.68rem] text-adminmuted mt-3">{dateTime(e.created_at)}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <ConfirmModal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        busy={busy}
        danger
        confirmLabel="Delete enquiry"
        title={`Delete ${confirm?.name ?? ""}'s enquiry?`}
        body="This permanently removes the lead and its contact details. Marking it Lost keeps the record instead."
      />
    </>
  );
}
