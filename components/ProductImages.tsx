"use client";

import { useRef, useState } from "react";

export default function ProductImages({ slug, images, onChange }: { slug: string; images: string[]; onChange: (imgs: string[]) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const mainRef = useRef<HTMLInputElement>(null);
  const extraRef = useRef<HTMLInputElement>(null);

  const main = images[0] || null;
  const extras = images.slice(1);

  const put = async (next: string[]) => {
    const r = await fetch("/api/admin/upload", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, images: next }),
    });
    if (r.ok) onChange((await r.json()).images);
  };

  const send = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("slug", slug);
    const r = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const d = await r.json();
    if (!r.ok) throw new Error(d.error || "Upload failed");
    return d.images as string[];
  };

  const wipe = async (url: string) => {
    const r = await fetch("/api/admin/upload", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug, url }),
    });
    if (r.ok) onChange((await r.json()).images);
  };

  const setMain = async (file: File) => {
    setBusy(true); setErr("");
    try {
      const after = await send(file);
      const added = after[after.length - 1];
      const rest = after.filter((u) => u !== added && u !== main);
      await put([added, ...rest]);
      if (main) await wipe(main);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    }
    setBusy(false);
    if (mainRef.current) mainRef.current.value = "";
  };

  const addExtras = async (files: FileList) => {
    setBusy(true); setErr("");
    try {
      let latest = images;
      for (const f of Array.from(files)) latest = await send(f);
      onChange(latest);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    }
    setBusy(false);
    if (extraRef.current) extraRef.current.value = "";
  };

  const removeOne = async (url: string) => {
    setBusy(true);
    await wipe(url);
    setBusy(false);
  };

  const removeAllExtras = async () => {
    setBusy(true);
    for (const u of extras) await wipe(u);
    setBusy(false);
  };

  const promote = (url: string) => put([url, ...images.filter((u) => u !== url)]);

  const file = "block w-full text-sm text-ink/70 file:mr-4 file:rounded-lg file:border-0 file:bg-ink file:px-5 file:py-2.5 file:text-[10px] file:tracking-tracksm file:uppercase file:text-cream hover:file:bg-gold hover:file:text-ink file:cursor-pointer file:transition";
  const del = "border border-peri/40 text-peri rounded-full px-4 py-1.5 text-[9px] tracking-tracksm uppercase hover:bg-peri/10 transition disabled:opacity-40";

  return (
    <div className="w-full border-t border-ink/10 pt-6 mt-5">
      <p className="text-ink/60 text-sm mb-3">Main photo</p>
      {main ? (
        <div className="mb-4">
          <img src={main} alt="" className="w-28 h-28 object-cover rounded-lg border border-ink/15 mb-3" />
          <button type="button" disabled={busy} onClick={() => removeOne(main)} className={del}>Remove main photo</button>
        </div>
      ) : (
        <div className="w-28 h-28 rounded-lg border border-dashed border-ink/25 mb-4 flex items-center justify-center text-ink/35 text-[10px] tracking-tracksm uppercase">None</div>
      )}
      <div className="bg-cream/60 border border-ink/15 rounded-xl p-4 mb-2">
        <input ref={mainRef} type="file" accept="image/jpeg,image/png,image/webp" disabled={busy} className={file} onChange={(e) => e.target.files?.[0] && setMain(e.target.files[0])} />
      </div>
      <p className="text-ink/40 text-xs mb-8">Leave empty to keep the current photo. Replacing it deletes the old one.</p>

      <div className="flex items-center justify-between mb-3">
        <p className="text-ink/60 text-sm">Additional photos</p>
        {extras.length > 0 && (
          <button type="button" disabled={busy} onClick={removeAllExtras} className={del}>Remove all</button>
        )}
      </div>

      {extras.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {extras.map((url) => (
            <div key={url} className="w-24">
              <div className="relative group w-24 h-24 rounded-lg overflow-hidden border border-ink/15">
                <img src={url} alt="" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-ink/75 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <button type="button" onClick={() => promote(url)} className="bg-gold text-ink rounded px-2 py-1 text-[9px] tracking-tracksm uppercase hover:opacity-80 transition">Set main</button>
                </div>
              </div>
              <button type="button" disabled={busy} onClick={() => removeOne(url)} className="w-full mt-2 border border-peri/40 text-peri rounded-full py-1.5 text-[9px] tracking-tracksm uppercase hover:bg-peri/10 transition disabled:opacity-40">Remove</button>
            </div>
          ))}
        </div>
      )}

      <div className="bg-cream/60 border border-ink/15 rounded-xl p-4 mb-2">
        <input ref={extraRef} type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy} className={file} onChange={(e) => e.target.files?.length && addExtras(e.target.files)} />
      </div>
      <p className="text-ink/40 text-xs">New photos are added to the gallery. Leave empty to keep the current ones.</p>

      {busy && <p className="text-ink/50 text-xs mt-3">Working...</p>}
      {err && <p className="text-peri text-xs mt-3">{err}</p>}
    </div>
  );
}