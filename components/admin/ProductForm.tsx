"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icons } from "@/components/admin/Icons";
import { Modal, useToast } from "@/components/admin/ui";
import { inr } from "@/lib/admin/format";
import type { Product } from "@/app/admin/v2/products/page";

const TABS = ["Basics", "Pricing", "Inventory", "Images", "Details", "SEO"] as const;
type Tab = (typeof TABS)[number];

/**
 * Fields the `products` table actually has: slug, name, price, mrp,
 * weight_g, stock, in_stock, images. Everything under Details and SEO —
 * SKU, category, brand, batch, nutrition, meta tags — has no column yet,
 * so those inputs are shown but disabled rather than silently discarding
 * what the admin types. Adding the columns is a small migration.
 */
const NEEDS_MIGRATION = "Needs a database column before it can be saved.";

/* Declared at module scope, not inside ProductForm — a component defined
   during render is a new type every render, so React remounts it and any
   focused input loses focus on every keystroke. */
function Disabled({
  label,
  placeholder,
  textarea = false,
}: {
  label: string;
  placeholder: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="adm-field-label flex items-center gap-2">
        {label}
        <span className="adm-badge adm-badge-muted text-[0.6rem]">Not stored yet</span>
      </label>
      {textarea ? (
        <textarea disabled rows={3} placeholder={placeholder} className="adm-textarea opacity-55 cursor-not-allowed" />
      ) : (
        <input disabled placeholder={placeholder} className="adm-input opacity-55 cursor-not-allowed" />
      )}
      <p className="adm-hint">{NEEDS_MIGRATION}</p>
    </div>
  );
}

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

  const [f, setF] = useState({
    name: product?.name ?? "",
    price: product?.price != null ? String(product.price) : "",
    mrp: product?.mrp != null ? String(product.mrp) : "",
    weight_g: product?.weight_g != null ? String(product.weight_g) : "",
    stock: product?.stock != null ? String(product.stock) : "0",
    in_stock: product?.in_stock ?? true,
  });
  const [images, setImages] = useState<string[]>(product?.images ?? []);

  const set = (k: keyof typeof f, v: string | boolean) => setF((p) => ({ ...p, [k]: v }));

  const priceN = Number(f.price) || 0;
  const mrpN = Number(f.mrp) || 0;
  const discount = mrpN > priceN && mrpN > 0 ? Math.round(((mrpN - priceN) / mrpN) * 100) : 0;

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
    };

    let r: Response;
    if (isNew) {
      r = await fetch("/api/admin/products", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
    } else {
      r = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, slug: product!.slug, in_stock: publish }),
      });
    }

    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setErr(d.error || "Could not save"); return; }
    push(isNew ? "Product created" : publish ? "Product published" : "Saved as draft");
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
            <Disabled label="SKU" placeholder="MK-PERI-60" />
            <Disabled label="Category" placeholder="Flavoured makhana" />
          </div>
          <Disabled label="Short description" placeholder="One line for cards and search results" />
          <Disabled label="Full description" placeholder="Long-form copy for the product page" textarea />
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
            {mrpN > 0 && mrpN < priceN && (
              <p className="text-sm text-perideep mt-2">
                MRP is below the selling price. Selling above MRP is not permitted under Legal Metrology rules.
              </p>
            )}
            <p className="adm-hint mt-2">Prices are stored inclusive of GST, matching what the storefront shows.</p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Disabled label="Cost price" placeholder="For margin reporting" />
            <Disabled label="GST rate" placeholder="5%" />
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
            <Disabled label="Low-stock threshold" placeholder="5" />
            <Disabled label="Batch number" placeholder="B-2026-08-15" />
          </div>
        </div>
      )}

      {tab === "Images" && (
        <div className="space-y-4">
          {isNew ? (
            <p className="text-sm text-adminmuted">
              Create the product first, then reopen it to upload images.
            </p>
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
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={(e) => upload(e.target.files)}
                />
                <p className="adm-hint mt-3">First image is used as the main product shot.</p>
              </div>

              {images.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {images.map((src, i) => (
                    <div key={src} className="relative aspect-square rounded-lg border border-adminline bg-white overflow-hidden">
                      <Image src={src} alt="" fill sizes="120px" className="object-contain p-2" />
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 adm-badge adm-badge-info text-[0.6rem]">Main</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
              <p className="adm-hint">
                Uploads save to Supabase storage immediately. Removing an image needs the delete endpoint extended.
              </p>
            </>
          )}
        </div>
      )}

      {tab === "Details" && (
        <div className="space-y-4">
          <p className="text-sm text-adminmuted">
            This copy currently lives in <code className="font-mono text-xs">lib/products.ts</code> and is edited in code.
            Moving it into the database would make it editable here.
          </p>
          <Disabled label="Ingredients" placeholder="Makhana, edible vegetable oil, seasoning, iodised salt" textarea />
          <Disabled label="Nutritional information" placeholder="Energy, protein, carbohydrate, fat, sodium per 100g" textarea />
          <Disabled label="Allergen information" placeholder="Packed in a facility that also handles nuts and milk" />
          <div className="grid sm:grid-cols-2 gap-4">
            <Disabled label="Shelf life" placeholder="6-8 months from packing" />
            <Disabled label="Storage instructions" placeholder="Cool, dry place away from sunlight" />
          </div>
        </div>
      )}

      {tab === "SEO" && (
        <div className="space-y-4">
          <p className="text-sm text-adminmuted">
            Meta tags are generated from the product name and description in
            <code className="font-mono text-xs"> app/shop/makhana/[slug]/page.tsx</code>.
          </p>
          <Disabled label="Meta title" placeholder="Peri Peri Roasted Makhana - 60g" />
          <Disabled label="Meta description" placeholder="155 characters for search results" textarea />
        </div>
      )}
    </Modal>
  );
}
