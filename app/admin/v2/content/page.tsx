"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, PageHeader, useToast, Sk } from "@/components/admin/ui";
import { CONTENT_SCHEMA, type ContentBlock } from "@/lib/content";

type Settings = { announcement: string; announcement_active: boolean; instagram: string };

const BLOCK_KEYS = Object.keys(CONTENT_SCHEMA);

export default function ContentPage() {
  const { push } = useToast();
  const [content, setContent] = useState<Record<string, ContentBlock> | null>(null);
  const [settings, setSettings] = useState<Settings | null>(null);
  const [migrated, setMigrated] = useState(true);
  const [active, setActive] = useState(BLOCK_KEYS[0]);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const [c, s] = await Promise.all([
      fetch("/api/admin/content").then((r) => (r.ok ? r.json() : null)).catch(() => null),
      fetch("/api/admin/settings").then((r) => (r.ok ? r.json() : null)).catch(() => null),
    ]);
    if (c) { setContent(c.content); setMigrated(c.migrated !== false); }
    if (s) setSettings(s);
  }, []);

  useEffect(() => { load(); }, [load]);

  const setField = (block: string, field: string, v: string) => {
    setContent((p) => (p ? { ...p, [block]: { ...p[block], [field]: v } } : p));
    setDirty(true);
  };

  const setSetting = <K extends keyof Settings>(k: K, v: Settings[K]) => {
    setSettings((p) => (p ? { ...p, [k]: v } : p));
    setDirty(true);
  };

  const save = async () => {
    setBusy(true);
    const [c, s] = await Promise.all([
      content
        ? fetch("/api/admin/content", {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content),
          })
        : Promise.resolve(null),
      settings
        ? fetch("/api/admin/settings", {
            method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings),
          })
        : Promise.resolve(null),
    ]);
    setBusy(false);

    if (c && !c.ok) {
      const d = await c.json().catch(() => ({}));
      push(d.error || "Could not save content", "danger");
      return;
    }
    if (s && !s.ok) { push("Could not save settings", "danger"); return; }

    setDirty(false);
    push("Content saved — live on the site now");
    load();
  };

  if (!content) {
    return (
      <>
        <PageHeader title="Website content" />
        <div className="space-y-4 max-w-3xl"><Sk className="h-10" /><Sk className="h-64" /></div>
      </>
    );
  }

  const schema = CONTENT_SCHEMA[active];
  const block = content[active] || {};

  return (
    <>
      <PageHeader
        title="Website content"
        subtitle="Edit storefront copy without touching code"
        actions={
          <button type="button" onClick={save} disabled={busy || !dirty} className="adm-btn adm-btn-primary">
            {busy ? "Saving…" : dirty ? "Save changes" : "Saved"}
          </button>
        }
      />

      {!migrated && (
        <Card className="mb-5">
          <p className="adm-h2 text-ink mb-2">Not set up yet</p>
          <p className="text-sm text-ink/80 leading-relaxed">
            The <code className="font-mono text-xs">content</code> table does not exist, so edits
            here cannot be saved. Run <code className="font-mono text-xs">supabase/03_content.sql</code>{" "}
            in the Supabase SQL editor. It seeds every block with the copy currently hard-coded in
            the page components, so the storefront reads identically before and after.
          </p>
        </Card>
      )}

      <div className="grid xl:grid-cols-[15rem_1fr] gap-5">
        <nav aria-label="Content blocks" className="adm-card p-2 h-fit">
          {BLOCK_KEYS.map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setActive(k)}
              aria-current={active === k ? "true" : undefined}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${
                active === k ? "bg-ink text-cream" : "text-ink/80 hover:bg-sandsoft"
              }`}
            >
              {CONTENT_SCHEMA[k].label}
            </button>
          ))}
          <div className="border-t border-adminline mt-2 pt-2">
            <button
              type="button"
              onClick={() => setActive("__banner")}
              aria-current={active === "__banner" ? "true" : undefined}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition ${
                active === "__banner" ? "bg-ink text-cream" : "text-ink/80 hover:bg-sandsoft"
              }`}
            >
              Banner &amp; social
            </button>
          </div>
        </nav>

        <div className="space-y-5">
          {active === "__banner" ? (
            <Card title="Announcement banner and social links">
              {!settings ? (
                <Sk className="h-24" />
              ) : (
                <div className="space-y-4">
                  <label className="flex items-center gap-2.5 text-sm">
                    <input type="checkbox" checked={settings.announcement_active} onChange={(e) => setSetting("announcement_active", e.target.checked)} className="accent-ink w-4 h-4" />
                    Show the banner
                  </label>
                  <div>
                    <label className="adm-field-label" htmlFor="b-text">Banner text</label>
                    <input id="b-text" value={settings.announcement} onChange={(e) => setSetting("announcement", e.target.value)} className="adm-input" />
                  </div>
                  <div>
                    <label className="adm-field-label" htmlFor="b-ig">Instagram URL</label>
                    <input id="b-ig" value={settings.instagram} onChange={(e) => setSetting("instagram", e.target.value)} className="adm-input" />
                  </div>

                  <div>
                    <p className="adm-label mb-2">Live preview</p>
                    <div className={`rounded-lg bg-inkdeep px-4 py-2.5 text-center ${settings.announcement_active ? "" : "opacity-35"}`}>
                      <span className="text-goldsoft text-[0.68rem] tracking-[0.18em] uppercase">
                        {settings.announcement || "Your message here"}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ) : (
            <>
              <Card title={schema.label}>
                <div className="space-y-4">
                  {Object.entries(schema.fields).map(([field, meta]) => (
                    <div key={field}>
                      <label className="adm-field-label" htmlFor={`f-${field}`}>{meta.label}</label>
                      {meta.multiline ? (
                        <textarea
                          id={`f-${field}`}
                          rows={field === "heading" ? 2 : 3}
                          value={block[field] ?? ""}
                          onChange={(e) => setField(active, field, e.target.value)}
                          className="adm-textarea"
                        />
                      ) : (
                        <input
                          id={`f-${field}`}
                          value={block[field] ?? ""}
                          onChange={(e) => setField(active, field, e.target.value)}
                          className="adm-input"
                        />
                      )}
                      {field === "heading" && (
                        <p className="adm-hint">A line break here becomes a line break on the site.</p>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Live preview">
                <div className={active === "hero" || active === "origin" ? "bg-inkdeep p-6 sm:p-9 rounded-lg" : "bg-sandsoft/60 p-6 sm:p-9 rounded-lg"}>
                  {block.eyebrow && (
                    <p className={`marker ${active === "hero" || active === "origin" ? "marker-light" : ""} mb-4`}>
                      {block.eyebrow}
                    </p>
                  )}
                  {block.heading && (
                    <p className={`display-md ${active === "hero" || active === "origin" ? "text-cream" : "text-ink"} whitespace-pre-line`}>
                      {block.heading}
                    </p>
                  )}
                  {block.body && (
                    <p className={`lede mt-4 max-w-lg ${active === "hero" || active === "origin" ? "text-cream/70" : "text-ink/70"}`}>
                      {block.body}
                    </p>
                  )}
                  {block.body2 && (
                    <p className={`body-text mt-3 max-w-lg ${active === "origin" ? "text-cream/60" : "text-ink/70"}`}>
                      {block.body2}
                    </p>
                  )}
                  {block.ctaLabel && (
                    <span className={`btn ${active === "hero" ? "btn-light" : "btn-primary"} mt-6`}>
                      {block.ctaLabel}
                    </span>
                  )}
                  {block.footnote && (
                    <p className="text-cream/70 text-[0.7rem] tracking-tracksm uppercase mt-6">{block.footnote}</p>
                  )}
                </div>
                <p className="adm-hint mt-3">
                  Rendered with the real storefront styles, so this is what visitors will see.
                </p>
              </Card>
            </>
          )}
        </div>
      </div>
    </>
  );
}
