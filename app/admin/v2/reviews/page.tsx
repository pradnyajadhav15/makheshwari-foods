"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Icons } from "@/components/admin/Icons";
import { Card, PageHeader, EmptyState, TableSkeleton, useToast, Badge, ConfirmModal } from "@/components/admin/ui";
import { StatCard } from "@/components/admin/StatCard";
import { ShareBars } from "@/components/admin/Charts";
import { shortDate } from "@/lib/admin/format";

type Review = {
  id: string; created_at: string; product_slug: string; name: string;
  city: string | null; rating: number; body: string;
  approved: boolean; verified: boolean;
};

const FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Awaiting approval" },
  { key: "approved", label: "Published" },
];

function Stars({ n }: { n: number }) {
  return (
    <span className="text-golddeep text-sm tracking-wide whitespace-nowrap" aria-label={`${n} out of 5`}>
      {"★".repeat(n)}
      <span className="text-ink/20">{"★".repeat(Math.max(0, 5 - n))}</span>
    </span>
  );
}

export default function ReviewsPage() {
  const { push } = useToast();
  const [rows, setRows] = useState<Review[] | null>(null);
  const [filter, setFilter] = useState("all");
  const [confirm, setConfirm] = useState<Review | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    /* Catch the fetch itself, not just the JSON parse — a rejected fetch
       would otherwise leave the skeleton up forever. */
    try {
      const r = await fetch("/api/admin/reviews");
      const d = await r.json().catch(() => ({}));
      setRows(d.reviews || []);
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const patch = async (id: string, body: Record<string, unknown>, msg: string) => {
    const r = await fetch("/api/admin/reviews", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, ...body }),
    });
    if (!r.ok) { push("Update failed", "danger"); return; }
    push(msg);
    load();
  };

  const remove = async () => {
    if (!confirm) return;
    setBusy(true);
    const r = await fetch("/api/admin/reviews", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: confirm.id }),
    });
    setBusy(false);
    if (!r.ok) { push("Could not delete", "danger"); return; }
    push("Review deleted");
    setConfirm(null);
    load();
  };

  const view = useMemo(() => {
    const l = rows || [];
    if (filter === "pending") return l.filter((r) => !r.approved);
    if (filter === "approved") return l.filter((r) => r.approved);
    return l;
  }, [rows, filter]);

  const all = rows || [];
  const approved = all.filter((r) => r.approved);
  const avg = approved.length ? approved.reduce((n, r) => n + r.rating, 0) / approved.length : 0;
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    label: `${star} star`,
    value: approved.filter((r) => r.rating === star).length,
    hint: `${approved.filter((r) => r.rating === star).length}`,
  }));

  return (
    <>
      <PageHeader title="Reviews" subtitle="Moderate customer reviews before they appear on the storefront" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard loading={!rows} label="Total reviews" value={String(all.length)} compare="all time" />
        <StatCard loading={!rows} label="Awaiting approval" value={String(all.length - approved.length)} compare="not yet public" tone={all.length - approved.length ? "warn" : "neutral"} />
        <StatCard loading={!rows} label="Published" value={String(approved.length)} compare="live on the site" />
        <StatCard loading={!rows} label="Average rating" value={approved.length ? avg.toFixed(1) : "—"} compare="from published reviews" />
      </div>

      <div className="grid xl:grid-cols-[1fr_1.6fr] gap-5">
        <Card title="Rating distribution">
          {!rows ? (
            <div className="h-40" />
          ) : approved.length === 0 ? (
            <p className="text-sm text-adminmuted">No published reviews yet.</p>
          ) : (
            <ShareBars rows={dist} />
          )}
        </Card>

        <Card bodyClass="" title="All reviews" action={
          <div className="flex gap-1.5">
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
        }>
          {rows === null ? (
            <TableSkeleton rows={5} cols={4} />
          ) : view.length === 0 ? (
            <EmptyState
              icon={<span className="w-5 h-5 block">{Icons.reviews}</span>}
              title={all.length === 0 ? "No reviews yet" : "Nothing in this filter"}
              body={all.length === 0 ? "Reviews submitted on product pages land here for approval." : "Try another filter."}
            />
          ) : (
            <ul className="divide-y divide-adminline">
              {view.map((r) => (
                <li key={r.id} className="p-4 sm:p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-medium text-ink">{r.name}</span>
                        <Stars n={r.rating} />
                        {r.verified && <Badge tone="success">Verified buyer</Badge>}
                        <Badge tone={r.approved ? "info" : "warn"}>{r.approved ? "Published" : "Pending"}</Badge>
                      </div>
                      <p className="text-[0.7rem] text-adminmuted mt-1">
                        {r.product_slug} · {r.city || "—"} · {shortDate(r.created_at)}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-ink/85 leading-relaxed">{r.body}</p>

                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      type="button"
                      onClick={() => patch(r.id, { approved: !r.approved }, r.approved ? "Hidden from the site" : "Published")}
                      className="adm-btn adm-btn-ghost adm-btn-sm"
                    >
                      {r.approved ? "Hide" : "Approve"}
                    </button>
                    <button
                      type="button"
                      onClick={() => patch(r.id, { verified: !r.verified }, r.verified ? "Verified badge removed" : "Marked verified")}
                      className="adm-btn adm-btn-ghost adm-btn-sm"
                    >
                      {r.verified ? "Unverify" : "Mark verified"}
                    </button>
                    <button type="button" onClick={() => setConfirm(r)} className="adm-btn adm-btn-danger adm-btn-sm">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <ConfirmModal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        busy={busy}
        danger
        confirmLabel="Delete review"
        title="Delete this review?"
        body={`This permanently removes ${confirm?.name ?? "this"}'s review. It cannot be undone — hiding it instead keeps the record.`}
      />
    </>
  );
}
