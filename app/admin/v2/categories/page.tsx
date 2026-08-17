"use client";

import { useCallback, useEffect, useState } from "react";
import { Icons } from "@/components/admin/Icons";
import {
  Card, PageHeader, Badge, TableSkeleton, EmptyState, useToast, Modal, ConfirmModal,
} from "@/components/admin/ui";
import { num } from "@/lib/admin/format";

type Category = {
  id: string; slug: string; name: string; description: string | null;
  sort_order: number; active: boolean;
};

type Counts = Record<string, { total: number; live: number }>;

const BLANK = { name: "", slug: "", description: "", sort_order: "0", active: true };

export default function CategoriesPage() {
  const { push } = useToast();
  const [rows, setRows] = useState<Category[] | null>(null);
  const [counts, setCounts] = useState<Counts>({});
  const [uncategorised, setUncategorised] = useState(0);
  const [migrated, setMigrated] = useState(true);
  const [editing, setEditing] = useState<Category | "new" | null>(null);
  const [f, setF] = useState(BLANK);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState<Category | null>(null);

  const load = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/categories");
      const d = await r.json().catch(() => ({}));
      setRows(d.categories || []);
      setCounts(d.counts || {});
      setUncategorised(d.uncategorised || 0);
      setMigrated(d.migrated !== false);
    } catch {
      setRows([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const open = (c: Category | "new") => {
    setErr("");
    setEditing(c);
    setF(
      c === "new"
        ? BLANK
        : {
            name: c.name,
            slug: c.slug,
            description: c.description ?? "",
            sort_order: String(c.sort_order),
            active: c.active,
          }
    );
  };

  const save = async () => {
    if (!f.name.trim()) { setErr("Name is required."); return; }
    setBusy(true);
    setErr("");

    const isNew = editing === "new";
    const r = await fetch("/api/admin/categories", {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        isNew
          ? { name: f.name, slug: f.slug, description: f.description, sort_order: f.sort_order, active: f.active }
          : { id: (editing as Category).id, name: f.name, description: f.description, sort_order: f.sort_order, active: f.active }
      ),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(d.error || "Could not save"); return; }
    push(isNew ? "Category created" : "Category updated");
    setEditing(null);
    load();
  };

  const remove = async () => {
    if (!confirm) return;
    setBusy(true);
    const r = await fetch("/api/admin/categories", {
      method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: confirm.id }),
    });
    setBusy(false);
    if (!r.ok) { push("Could not delete", "danger"); return; }
    push(`${confirm.name} deleted — its products are now uncategorised`);
    setConfirm(null);
    load();
  };

  const list = rows || [];

  return (
    <>
      <PageHeader
        title="Categories"
        subtitle="How the shop page groups the catalogue"
        actions={
          migrated && (
            <button type="button" onClick={() => open("new")} className="adm-btn adm-btn-primary">
              <span className="w-4 h-4 block">{Icons.plus}</span>
              New category
            </button>
          )
        }
      />

      {!migrated && (
        <Card className="mb-5">
          <p className="adm-h2 text-ink mb-2">Not set up yet</p>
          <p className="text-sm text-ink/80 leading-relaxed">
            The <code className="font-mono text-xs">categories</code> table does not exist. Run{" "}
            <code className="font-mono text-xs">supabase/02_categories.sql</code> in the Supabase SQL
            editor, then reload this page. It seeds the three categories the shop page currently
            hard-codes and files every existing product under Flavoured makhana, so nothing on the
            storefront changes.
          </p>
        </Card>
      )}

      {migrated && uncategorised > 0 && (
        <Card className="mb-5">
          <p className="text-sm text-ink">
            <strong className="font-medium">{uncategorised}</strong> product
            {uncategorised === 1 ? " has" : "s have"} no category. They still appear in the shop —
            assign one from the product editor.
          </p>
        </Card>
      )}

      <Card bodyClass="">
        {rows === null ? (
          <TableSkeleton rows={3} cols={5} />
        ) : list.length === 0 ? (
          <EmptyState
            icon={<span className="w-5 h-5 block">{Icons.categories}</span>}
            title={migrated ? "No categories yet" : "Nothing to show"}
            body={migrated ? "Create one to start grouping the catalogue." : "Run the migration above first."}
            action={
              migrated ? (
                <button type="button" onClick={() => open("new")} className="adm-btn adm-btn-primary">New category</button>
              ) : undefined
            }
          />
        ) : (
          <div className="adm-scroll">
            <table className="adm-table min-w-[44rem]">
              <thead>
                <tr>
                  <th>Category</th><th>Slug</th><th className="text-right">Products</th>
                  <th className="text-right">Order</th><th>Status</th><th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <span className="font-medium text-ink block">{c.name}</span>
                      {c.description && (
                        <span className="text-[0.7rem] text-adminmuted line-clamp-1">{c.description}</span>
                      )}
                    </td>
                    <td className="font-mono text-[0.7rem] text-adminmuted">{c.slug}</td>
                    <td className="text-right tabular-nums">
                      {num(counts[c.id]?.total ?? 0)}
                      {counts[c.id] && counts[c.id].live !== counts[c.id].total && (
                        <span className="block text-[0.68rem] text-adminmuted">{counts[c.id].live} visible</span>
                      )}
                    </td>
                    <td className="text-right tabular-nums text-adminmuted">{c.sort_order}</td>
                    <td><Badge tone={c.active ? "success" : "muted"}>{c.active ? "Live" : "Hidden"}</Badge></td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => open(c)} aria-label={`Edit ${c.name}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-adminmuted hover:text-ink hover:bg-sandsoft transition">
                          <span className="w-4 h-4 block">{Icons.edit}</span>
                        </button>
                        <button type="button" onClick={() => setConfirm(c)} aria-label={`Delete ${c.name}`} className="w-8 h-8 flex items-center justify-center rounded-lg text-adminmuted hover:text-perideep hover:bg-perideep/10 transition">
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
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={editing === "new" ? "New category" : editing ? `Edit ${editing.name}` : "Category"}
        footer={
          <>
            <button type="button" onClick={() => setEditing(null)} className="adm-btn adm-btn-ghost" disabled={busy}>Cancel</button>
            <button type="button" onClick={save} className="adm-btn adm-btn-primary" disabled={busy || !f.name.trim()}>
              {busy ? "Saving…" : "Save"}
            </button>
          </>
        }
      >
        {err && <p className="text-perideep text-sm mb-4" role="alert">{err}</p>}
        <div className="space-y-4">
          <div>
            <label className="adm-field-label" htmlFor="c-name">Name *</label>
            <input id="c-name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className="adm-input" placeholder="Flavoured makhana" />
          </div>

          {editing === "new" ? (
            <div>
              <label className="adm-field-label" htmlFor="c-slug">Slug</label>
              <input id="c-slug" value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} className="adm-input font-mono text-xs" placeholder="Leave blank to derive from the name" />
            </div>
          ) : (
            <div>
              <label className="adm-field-label" htmlFor="c-slug-ro">Slug</label>
              <input id="c-slug-ro" value={f.slug} disabled className="adm-input opacity-55 cursor-not-allowed font-mono text-xs" />
              <p className="adm-hint">Fixed after creation so links stay stable.</p>
            </div>
          )}

          <div>
            <label className="adm-field-label" htmlFor="c-desc">Description</label>
            <textarea id="c-desc" rows={2} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className="adm-textarea" />
          </div>

          <div>
            <label className="adm-field-label" htmlFor="c-sort">Sort order</label>
            <input id="c-sort" inputMode="numeric" value={f.sort_order} onChange={(e) => setF({ ...f, sort_order: e.target.value })} className="adm-input max-w-[8rem]" />
            <p className="adm-hint">Lower numbers appear first.</p>
          </div>

          <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" checked={f.active} onChange={(e) => setF({ ...f, active: e.target.checked })} className="accent-ink w-4 h-4" />
            <span>Live on the shop page</span>
          </label>
        </div>
      </Modal>

      <ConfirmModal
        open={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={remove}
        busy={busy}
        danger
        confirmLabel="Delete category"
        title={`Delete ${confirm?.name ?? ""}?`}
        body={`Its ${counts[confirm?.id ?? ""]?.total ?? 0} product(s) are not deleted — they become uncategorised and stay on sale. Hiding the category instead keeps the grouping.`}
      />
    </>
  );
}
