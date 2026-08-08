"use client";

import { useEffect } from "react";

export default function Toast({ message, tone = "ok", onDone }: { message: string; tone?: "ok" | "error"; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3000);
    return () => clearTimeout(t);
  }, [onDone]);

  const styles = tone === "ok" ? "bg-ink text-cream border-gold/40" : "bg-peri text-cream border-peri";

  return (
    <div role="status" aria-live="polite" className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-3 rounded-full border px-7 py-4 shadow-[0_20px_45px_-15px_rgba(18,53,42,0.6)] ${styles}`} style={{ animation: "toastIn 0.35s cubic-bezier(0.2,0.7,0.2,1)" }}>
      {tone === "ok" ? (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="#C9A227" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
      ) : (
        <svg viewBox="0 0 24 24" className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 8v5M12 17v.5" /><circle cx="12" cy="12" r="9" /></svg>
      )}
      <span className="text-[11px] tracking-tracksm uppercase">{message}</span>
    </div>
  );
}