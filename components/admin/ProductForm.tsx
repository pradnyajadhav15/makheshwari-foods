"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Icons } from "@/components/admin/Icons";
import { Modal, useToast } from "@/components/admin/ui";
import { inr } from "@/lib/admin/format";
import type { Product } from "@/app/admin/v2/products/page";

const TABS = ["Basics", "Pricing", "Inventory", "Images", "Details", "SEO"] as const;
type Tab = (typeof TABS)[number];

type Category = { id: string; name: string; active: boolean };
type NutritionRow = { label: string; value: string };

const NUTRITION_ROWS = ["Energy", "Protein", "Carbohydrate", "of which sugars", "Total fat", "Sodium"];

/**
 * Every field here maps to a real column. The ones under Details and SEO were
 * added by supabase/01_product_fields.sql; Category comes from 02_categories.sql.
 * If those have not been run, the API saves the core fields and returns a
 * warning rather than failing, so nothing is silently lost.
 */
export default function ProductForm({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { push } = useToast();
  const isNew = !product;
  const [tab, setTab] = useState<Tab>("Basics");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [f, setF] = useState({
    name: product?.name ?? "",
    price: product?.price != null ? String(product.price) : "",
    mrp: product?.mrp != null ? String(product.mrp) : "",
    weight_g: product?.weight_g != null ? String(product.weight_g) : "",
    stock: product?.stock != null ? String(product.stock) : "0",
    in_stock: product?.in_stock ?? true,
    sku: product?.sku ?? "",
    brand: product?.brand ?? "Makheshwari",
    category_id: product?.category_id ?? "",
    short_description: product?.short_description ?? "",
    description: product?.description ?? "",
    ingredients: product?.ingredients ?? "",
    allergens: product?.allergens ?? "",
    shelf_life: product?.shelf_life ?? "",
    storage: product?.storage ?? "",
    batch_number: product?.batch_number ?? "",
    low_stock_threshold: product?.low_stock_threshold != null ? String(product.low_stock_threshold) : "5",
    cost_price: product?.cost_price != null ? String(product.cost_price) : "",
    gst_rate: product?.gst_rate != null ? String(product.gst_rate) : "5",
    meta_title: product?.meta_title ?? "",
    meta_description: product?.meta_description ?? "",
  });

  const [nutrition, setNutrition] = useState<NutritionRow[]>(() => {
    const existing = (product?.nutrition as NutritionRow[] | null) || [];
    return NUTRITION_ROWS.map((label) => ({
      label,
      value: existing.find((r) => r.label === label)?.value ?? "",
    }));
  });

  const [images, setImages] = useState<string[]>(product?.images ?? []);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d?.categories && setCategories(d.categories))
      .catch(() => {});
  }, []);

  const set = (k: keyof typeof f, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  const priceN = Number(f.price) || 0;
  const mrpN = Number(f.mrp) || 0;
  const costN = Number(f.cost_price) || 0;
  const discount = mrpN > priceN && mrpN > 0 ? Math.round(((mrpN - priceN) / mrpN) * 100) : 0;
  const margin = costN > 0 && priceN > 0 ? Math.round(((priceN - costN) / priceN) * 100) : null;

  const valid = f.name.trim() && priceN > 0 && Number(f.weight_g) > 0;

  const upload = async (files: FileList | null) => {
    if (!files?.length || !product) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", product.slug);
      const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const d = await r.json().catch(() => ({}));
      if (r.ok && d.url) setImages((p) => [...p, d.url]);
      else push(d.error || `Could not upload ${file.name}`, "danger");
    }
    setUploading(false);
  };

  const save = async (publish: boolean) => {
    if (!valid) { setErr("Name, price and weight are required."); setTab("Basics"); return; }
    setBusy(true);
    setErr("");

    const payload: Record<string, unknown> = {
      name: f.name.trim(),
      price: priceN,
      mrp: f.mrp === "" ? null : mrpN,
      weight_g: Number(f.weight_g),
      stock: Number(f.stock) || 0,
      sku: f.sku.trim(),
      brand: f.brand.trim(),
      category_id: f.category_id || null,
      short_description: f.short_description.trim(),
      description: f.description.trim(),
      ingredients: f.ingredients.trim(),
      allergens: f.allergens.trim(),
      shelf_life: f.shelf_life.trim(),
      storage: f.storage.trim(),
      batch_number: f.batch_number.trim(),
      low_stock_threshold: f.low_stock_threshold,
      cost_price: f.cost_price,
      gst_rate: f.gst_rate,
      meta_title: f.meta_title.trim(),
      meta_description: f.meta_description.trim(),
      // Drop empty rows so a blank panel stores [] rather than six blanks.
      nutrition: nutrition.filter((n) => n.value.trim()),
    };

    const r = isNew
      ? await fetch("/api/admin/products", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
        })
      : await fetch("/api/admin/products", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...payload, slug: product!.slug, in_stock: publish }),
        });

    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(d.error || "Could not save"); return; }
    if (d.warning) push(d.warning, "danger");
    else push(isNew ? "Product created" : publish ? "Product published" : "Saved as draft");
    onSaved();
  };

  return (
    <Modal
      open
      onClose={onClose}
      wide
      title={isNew ? "Add product" : `Edit ${product!.name}`}
      footer={
        <>
          <button type="button" onClick={onClose} className="adm-btn adm-btn-ghost" disabled={busy}>Cancel</button>
          {!isNew && (
            <button type="button" onClick={() => save(false)} className="adm-btn adm-btn-ghost" disabled={busy}>
              Save as draft
            </button>
          )}
          <button type="button" onClick={() => save(true)} className="adm-btn adm-btn-primary" disabled={busy || !valid}>
            {busy ? "Saving…" : isNew ? "Create product" : "Publish product"}
          </button>
        </>
      }
    >
      <div className="flex gap-1 flex-wrap border-b border-adminline -mt-1 mb-5">
        {TABS.map((t) => (
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

      {err && <p className="text-perideep text-sm mb-4" role="alert">{err}</p>}

      {tab === "Basics" && (
        <div className="space-y-4">
          <div>
            <label className="adm-field-label" htmlFor="p-name">Product name *</label>
            <input id="p-name" value={f.name} onChange={(e) => set("name", e.target.value)} className="adm-input" placeholder="e.g. Peri Peri Makhana" />
            {isNew && <p className="adm-hint">The URL slug is generated from this and cannot be changed later.</p>}
          </div>

          {!isNew && (
            <div>
              <label className="adm-field-label" htmlFor="p-slug">URL slug</label>
              <input id="p-slug" value={product!.slug} disabled className="adm-input opacity-55 cursor-not-allowed font-mono text-xs" />
              <p className="adm-hint">Changing this would break existing links and past orders.</p>
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="adm-field-label" htmlFor="p-sku">SKU</label>
              <input id="p-sku" value={f.sku} onChange={(e) => set("sku", e.target.value)} className="adm-input font-mono text-xs" placeholder="MK-PERI-60" />
              <p className="adm-hint">Optional, but must be unique across products.</p>
            </div>
            <div>
              <label className="adm-field-label" htmlFor="p-cat">Category</label>
              <select id="p-cat" value={f.category_id} onChange={(e) => set("category_id", e.target.value)} className="adm-select">
                <option value="">Uncategorised</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}{c.active ? "" : " (hidden)"}</option>
                ))}
              </select>
              {categories.length === 0 && (
                <p className="adm-hint">No categories yet — run supabase/02_categories.sql.</p>
              )}
            </div>
          </div>

          <div>
            <label className="adm-field-label" htmlFor="p-brand">Brand</label>
            <input id="p-brand" value={f.brand} onChange={(e) => set("brand", e.target.value)} className="adm-input" />
          </div>

          <div>
            <label className="adm-field-label" htmlFor="p-short">Short description</label>
            <input id="p-short" value={f.short_description} onChange={(e) => set("short_description", e.target.value)} className="adm-input" placeholder="One line for cards and search results" />
          </div>

          <div>
            <label className="adm-field-label" htmlFor="p-desc">Full description</label>
            <textarea id="p-desc" rows={4} value={f.description} onChange={(e) => set("description", e.target.value)} className="adm-textarea" placeholder="Long-form copy for the product page" />
          </div>

          <label className="flex items-center gap-2.5 text-sm">
            <input type="checkbox" checked={f.in_stock} onChange={(e) => set("in_stock", e.target.checked)} className="accent-ink w-4 h-4" />
            <span>Visible in the shop</span>
          </label>
          <p className="adm-hint -mt-2">
            Stock is the source of truth — a product with 0 stock stays off sale even when this is ticked.
          </p>
        </div>
      )}

      {tab === "Pricing" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="adm-field-label" htmlFor="p-mrp">MRP</label>
              <input id="p-mrp" inputMode="numeric" value={f.mrp} onChange={(e) => set("mrp", e.target.value)} className="adm-input" placeholder="179" />
            </div>
            <div>
              <label className="adm-field-label" htmlFor="p-price">Selling price *</label>
              <input id="p-price" inputMode="numeric" value={f.price} onChange={(e) => set("price", e.target.value)} className="adm-input" placeholder="149" />
            </div>
          </div>

          <div className="adm-card adm-card-pad bg-sandsoft/40">
            <div className="flex items-baseline justify-between">
              <span className="adm-label">Customer pays</span>
              <span className="adm-num text-ink">{inr(priceN)}</span>
            </div>
            {discount > 0 && (
              <p className="text-sm text-mintdeep mt-2">
                {discount}% off MRP — saves the customer {inr(mrpN - priceN)}
              </p>
            )}
            {margin !== null && (
              <p className="text-sm text-adminmuted mt-1">
                Margin {margin}% — {inr(priceN - costN)} per unit over cost
              </p>
            )}
            {mrpN > 0 && mrpN < priceN && (
              <p className="text-sm text-perideep mt-2">
                MRP is below the selling price. Selling above MRP is not permitted under Legal Metrology rules.
              </p>
            )}
            <p className="adm-hint mt-2">Prices are stored inclusive of GST, matching what the storefront shows.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="adm-field-label" htmlFor="p-cost">Cost price</label>
              <input id="p-cost" inputMode="decimal" value={f.cost_price} onChange={(e) => set("cost_price", e.target.value)} className="adm-input" placeholder="For margin reporting" />
              <p className="adm-hint">Internal only — never shown on the storefront.</p>
            </div>
            <div>
              <label className="adm-field-label" htmlFor="p-gst">GST rate (%)</label>
              <input id="p-gst" inputMode="decimal" value={f.gst_rate} onChange={(e) => set("gst_rate", e.target.value)} className="adm-input" placeholder="5" />
            </div>
          </div>
        </div>
      )}

      {tab === "Inventory" && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="adm-field-label" htmlFor="p-stock">Stock quantity</label>
              <input id="p-stock" inputMode="numeric" value={f.stock} onChange={(e) => set("stock", e.target.value)} className="adm-input" />
              <p className="adm-hint">Decremented automatically when an order is paid.</p>
            </div>
            <div>
              <label className="adm-field-label" htmlFor="p-weight">Net weight (g) *</label>
              <input id="p-weight" inputMode="numeric" value={f.weight_g} onChange={(e) => set("weight_g", e.target.value)} className="adm-input" placeholder="60" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="adm-field-label" htmlFor="p-low">Low-stock threshold</label>
              <input id="p-low" inputMode="numeric" value={f.low_stock_threshold} onChange={(e) => set("low_stock_threshold", e.target.value)} className="adm-input" placeholder="5" />
              <p className="adm-hint">Drives the low-stock alert on the dashboard.</p>
            </div>
            <div>
              <label className="adm-field-label" htmlFor="p-batch">Batch number</label>
              <input id="p-batch" value={f.batch_number} onChange={(e) => set("batch_number", e.target.value)} className="adm-input font-mono text-xs" placeholder="B-2026-08-15" />
            </div>
          </div>
        </div>
      )}

      {tab === "Images" && (
        <div className="space-y-4">
          {isNew ? (
            <p className="text-sm text-adminmuted">Create the product first, then reopen it to upload images.</p>
          ) : (
            <>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={(e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); }}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition ${
                  dragging ? "border-gold bg-gold/5" : "border-adminline"
                }`}
              >
                <span className="inline-flex w-10 h-10 rounded-full bg-sandsoft items-center justify-center text-ink/50 mb-3">
                  <span className="w-5 h-5 block">{Icons.download}</span>
                </span>
                <p className="text-sm text-ink">Drag images here, or</p>
                <button type="button" onClick={() => fileRef.current?.click()} className="adm-btn adm-btn-ghost adm-btn-sm mt-3" disabled={uploading}>
                  {uploading ? "Uploading…" : "Choose files"}
                </button>
                <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
                <p className="adm-hint mt-3">First image is used as the main product shot.</p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((src, i) => (
                    <div key={src} className="relative aspect-square rounded-lg border border-adminline bg-white overflow-hidden">
                      <Image src={src} alt="" fill sizes="120px" className="object-contain p-2" />
                      {i === 0 && <span className="absolute top-1.5 left-1.5 adm-badge adm-badge-info text-[0.6rem]">Main</span>}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {tab === "Details" && (
        <div className="space-y-4">
          <div>
            <label className="adm-field-label" htmlFor="p-ing">Ingredients</label>
            <textarea id="p-ing" rows={2} value={f.ingredients} onChange={(e) => set("ingredients", e.target.value)} className="adm-textarea" placeholder="Makhana (fox nut), edible vegetable oil, seasoning, iodised salt" />
          </div>

          <div>
            <label className="adm-field-label" htmlFor="p-all">Allergen information</label>
            <input id="p-all" value={f.allergens} onChange={(e) => set("allergens", e.target.value)} className="adm-input" placeholder="Packed in a facility that also handles nuts and milk" />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="adm-field-label" htmlFor="p-shelf">Shelf life</label>
              <input id="p-shelf" value={f.shelf_life} onChange={(e) => set("shelf_life", e.target.value)} className="adm-input" placeholder="6-8 months from packing" />
            </div>
            <div>
              <label className="adm-field-label" htmlFor="p-storage">Storage instructions</label>
              <input id="p-storage" value={f.storage} onChange={(e) => set("storage", e.target.value)} className="adm-input" placeholder="Cool, dry place away from sunlight" />
            </div>
          </div>

          <div>
            <span className="adm-field-label">Nutritional information (per 100 g)</span>
            <div className="adm-card divide-y divide-adminline">
              {nutrition.map((row, i) => (
                <div key={row.label} className="flex items-center gap-3 px-3 py-2">
                  <span className="text-sm text-ink/80 flex-1">{row.label}</span>
                  <input
                    aria-label={row.label}
                    value={row.value}
                    onChange={(e) =>
                      setNutrition((p) => p.map((r, n) => (n === i ? { ...r, value: e.target.value } : r)))
                    }
                    className="adm-input w-32 text-sm"
                    placeholder="—"
                  />
                </div>
              ))}
            </div>
            <p className="adm-hint">
              Leave blank rather than guessing. A nutrition panel is FSSAI-regulated and needs real lab figures.
            </p>
          </div>
        </div>
      )}

      {tab === "SEO" && (
        <div className="space-y-4">
          <div>
            <label className="adm-field-label" htmlFor="p-mt">Meta title</label>
            <input id="p-mt" value={f.meta_title} onChange={(e) => set("meta_title", e.target.value)} className="adm-input" placeholder={`${f.name || "Product"} Roasted Makhana - ${f.weight_g || "60"}g`} />
            <p className="adm-hint">
              {f.meta_title.length}/60 characters. Blank falls back to the product name.
            </p>
          </div>
          <div>
            <label className="adm-field-label" htmlFor="p-md">Meta description</label>
            <textarea id="p-md" rows={3} value={f.meta_description} onChange={(e) => set("meta_description", e.target.value)} className="adm-textarea" placeholder="Shown under the title in search results" />
            <p className="adm-hint">
              {f.meta_description.length}/155 characters. Blank falls back to the full description.
            </p>
          </div>

          <div className="adm-card adm-card-pad bg-sandsoft/40">
            <p className="adm-label mb-2">Search preview</p>
            <p className="text-[#1a0dab] text-sm truncate">
              {f.meta_title || `${f.name || "Product"} Roasted Makhana - ${f.weight_g || "60"}g`}
            </p>
            <p className="text-mintdeep text-xs mt-0.5">
              makheshwarifoods.com › shop › makhana › {product?.slug ?? "…"}
            </p>
            <p className="text-adminmuted text-xs mt-1 line-clamp-2">
              {f.meta_description || f.description || f.short_description || "No description yet."}
            </p>
          </div>
        </div>
      )}
    </Modal>
  );
}
