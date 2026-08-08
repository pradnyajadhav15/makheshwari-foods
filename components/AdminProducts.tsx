"use client";

import { useEffect, useState } from "react";
import ProductImages from "@/components/ProductImages";
import Toast from "@/components/Toast";

type P = { slug: string; name: string; price: number; mrp: number | null; weight_g: number; stock: number; in_stock: boolean; images: string[] | null };

const blank = { name: "", price: "", mrp: "", weight_g: "", stock: "" };

export default function AdminProducts() {
  const [rows, setRows] = useState<P[] | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [err, setErr] = useState("");
  const [adding, setAdding] = useState(false);
  const [nu, setNu] = useState(blank);
  const [confirm, setConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ m: string; t: "ok" | "error" } | null>(null);

  const load = async () => {
    const r = await fetch("/api/admin/products");
    if (!r.ok) { setErr("Could not load products"); return; }
    setRows((await r.json()).products);
  };

  useEffect(() => { load(); }, []);

  const save = async (slug: string, patch: Partial<P>) => {
    setSaving(slug); setErr("");
    const r = await fetch("/api/admin/products", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, ...patch }),
    });
    if (!r.ok) { setErr((await r.json()).error || "Save failed"); setToast({ m: "Could not save", t: "error" }); } else setToast({ m: "Saved", t: "ok" });
    await load();
    setSaving(null);
  };

  const create = async () => {
    setErr("");
    const r = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nu),
    });
    const d = await r.json();
    if (!r.ok) { setErr(d.error || "Could not create"); return; }
    setNu(blank); setAdding(false); load(); setToast({ m: "Product created", t: "ok" });
  };

  const del = async (slug: string) => {
    setSaving(slug);
    await fetch("/api/admin/products", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    });
    setConfirm(null); await load(); setSaving(null); setToast({ m: "Product deleted", t: "ok" });
  };

  const edit = (slug: string, key: keyof P, value: string | number) =>
    setRows((prev) => prev!.map((p) => (p.slug === slug ? { ...p, [key]: value } : p)));

  if (!rows) return null;

  const inp = "bg-cream/60 border border-ink/15 rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-gold transition";
  const lbl = "block text-ink/45 text-[10px] tracking-tracksm uppercase mb-2";

  return (
    <section>
      <div className="flex items-end justify-between mb-7">
        <h2 className="font-display text-3xl text-ink">Products</h2>
        <button type="button" onClick={() => setAdding(!adding)} className="bg-ink text-cream rounded-full px-7 py-2.5 text-[10px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
          {adding ? "Cancel" : "+ Add product"}
        </button>
      </div>

      {err && <p className="text-peri text-sm mb-4">{err}</p>}

      {adding && (
        <div className="bg-white rounded-[1.25rem] border border-gold/50 p-7 mb-5">
          <p className="font-display text-xl text-ink mb-6">New product</p>
          <div className="grid sm:grid-cols-5 gap-4 mb-6">
            <div className="sm:col-span-2"><label className={lbl}>Name</label><input className={inp + " w-full"} placeholder="Cheese Herb" value={nu.name} onChange={(e) => setNu({ ...nu, name: e.target.value })} /></div>
            <div><label className={lbl}>Price</label><input type="number" className={inp + " w-full"} value={nu.price} onChange={(e) => setNu({ ...nu, price: e.target.value })} /></div>
            <div><label className={lbl}>MRP</label><input type="number" className={inp + " w-full"} value={nu.mrp} onChange={(e) => setNu({ ...nu, mrp: e.target.value })} /></div>
            <div><label className={lbl}>Weight g</label><input type="number" className={inp + " w-full"} value={nu.weight_g} onChange={(e) => setNu({ ...nu, weight_g: e.target.value })} /></div>
          </div>
          <button type="button" onClick={create} className="bg-ink text-cream rounded-full px-9 py-3 text-[10px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">Create product</button>
        </div>
      )}

      <div className="space-y-4">
        {rows.map((p) => (
          <div key={p.slug} className="bg-white rounded-[1.25rem] border border-ink/10 p-6">
            <div className="flex flex-wrap items-end gap-5">
              <img src={p.images?.[0] || `/products/${p.slug === "himalayan-pink-salt" ? "pink-salt" : p.slug}.jpg`} alt={p.name} className="w-16 h-16 object-contain shrink-0" />
              <div className="min-w-[9rem] flex-1"><label className={lbl}>Name</label><input className={inp + " w-full"} value={p.name} onChange={(e) => edit(p.slug, "name", e.target.value)} /></div>
              <div><label className={lbl}>Price</label><input type="number" className={inp + " w-20"} value={p.price} onChange={(e) => edit(p.slug, "price", Number(e.target.value))} /></div>
              <div><label className={lbl}>MRP</label><input type="number" className={inp + " w-20"} value={p.mrp ?? 0} onChange={(e) => edit(p.slug, "mrp", Number(e.target.value))} /></div>
              <div><label className={lbl}>Weight</label><input type="number" className={inp + " w-20"} value={p.weight_g} onChange={(e) => edit(p.slug, "weight_g", Number(e.target.value))} /></div>
              <div><label className={lbl}>Stock</label><input type="number" className={inp + " w-20" + (p.stock < 10 ? " border-peri text-peri" : "")} value={p.stock} onChange={(e) => edit(p.slug, "stock", Number(e.target.value))} /></div>
              <button type="button" onClick={() => save(p.slug, { in_stock: !p.in_stock })} className={`rounded-full px-5 py-2.5 text-[10px] tracking-tracksm uppercase transition ${p.in_stock ? "bg-mint/25 text-ink hover:bg-mint/40" : "bg-peri/20 text-peri hover:bg-peri/30"}`}>
                {p.in_stock ? "In stock" : "Out of stock"}
              </button>
              <button type="button" disabled={saving === p.slug} onClick={() => save(p.slug, { name: p.name, price: p.price, mrp: p.mrp, weight_g: p.weight_g, stock: p.stock })} className="bg-ink text-cream rounded-full px-7 py-2.5 text-[10px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition disabled:opacity-50">
                {saving === p.slug ? "Saving" : "Save"}
              </button>
              {confirm === p.slug ? (
                <span className="flex gap-2">
                  <button type="button" onClick={() => del(p.slug)} className="bg-peri text-cream rounded-full px-5 py-2.5 text-[10px] tracking-tracksm uppercase">Confirm</button>
                  <button type="button" onClick={() => setConfirm(null)} className="border border-ink/20 rounded-full px-5 py-2.5 text-[10px] tracking-tracksm uppercase text-ink/60">No</button>
                </span>
              ) : (
                <button type="button" onClick={() => setConfirm(p.slug)} className="border border-peri/40 text-peri rounded-full px-5 py-2.5 text-[10px] tracking-tracksm uppercase hover:bg-peri/10 transition">Delete</button>
              )}
            </div>

            <ProductImages slug={p.slug} images={p.images || []} onChange={(imgs) => setRows((prev) => prev!.map((x) => (x.slug === p.slug ? { ...x, images: imgs } : x)))} />
          </div>
        ))}
      </div>
      {toast && <Toast message={toast.m} tone={toast.t} onDone={() => setToast(null)} />}
    </section>
  );
}

