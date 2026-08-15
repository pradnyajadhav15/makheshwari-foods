"use client";

import { useEffect, useRef, useState, createContext, useContext, useCallback } from "react";
import { badgeClass, statusMeta } from "@/lib/admin/format";

/* ============================================================
   Status badge
   ============================================================ */

export function StatusBadge({ status }: { status: string | null | undefined }) {
  const m = statusMeta(status);
  return (
    <span className={badgeClass(m.tone)} title={m.help || undefined}>
      {m.label}
    </span>
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "info" | "warn" | "success" | "danger" | "muted";
  children: React.ReactNode;
}) {
  return <span className={badgeClass(tone)}>{children}</span>;
}

/* ============================================================
   Section shell
   ============================================================ */

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        <h1 className="adm-h1 text-ink">{title}</h1>
        {subtitle && <p className="text-sm text-adminmuted mt-1.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  title,
  action,
  children,
  className = "",
  bodyClass = "adm-card-pad",
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClass?: string;
}) {
  return (
    <section className={`adm-card ${className}`}>
      {(title || action) && (
        <header className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-adminline">
          {title && <h2 className="adm-h2 text-ink">{title}</h2>}
          {action}
        </header>
      )}
      <div className={bodyClass}>{children}</div>
    </section>
  );
}

/* ============================================================
   Empty + loading states
   ============================================================ */

export function EmptyState({
  title,
  body,
  action,
  icon,
}: {
  title: string;
  body?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="text-center py-12 px-6">
      {icon && (
        <span className="inline-flex w-12 h-12 rounded-full bg-sandsoft items-center justify-center text-ink/50 mb-4">
          {icon}
        </span>
      )}
      <p className="adm-h2 text-ink">{title}</p>
      {body && <p className="text-sm text-adminmuted mt-2 max-w-sm mx-auto">{body}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function Sk({ className = "" }: { className?: string }) {
  return <span className={`skel block ${className}`} aria-hidden="true" />;
}

export function TableSkeleton({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="p-4" aria-busy="true">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 py-3 border-b border-adminline last:border-0">
          {Array.from({ length: cols }).map((_, c) => (
            <Sk key={c} className={`h-4 ${c === 0 ? "w-1/4" : "flex-1"}`} />
          ))}
        </div>
      ))}
      <span className="sr-only">Loading</span>
    </div>
  );
}

/* ============================================================
   Toasts
   ============================================================ */

type Toast = { id: number; msg: string; tone: "success" | "danger" | "info" };
type ToastCtx = { push: (msg: string, tone?: Toast["tone"]) => void };

const ToastContext = createContext<ToastCtx | null>(null);

export function useToast() {
  const c = useContext(ToastContext);
  if (!c) throw new Error("useToast must be used inside ToastProvider");
  return c;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);
  const seq = useRef(0);

  const push = useCallback((msg: string, tone: Toast["tone"] = "success") => {
    const id = ++seq.current;
    setList((l) => [...l, { id, msg, tone }]);
    setTimeout(() => setList((l) => l.filter((t) => t.id !== id)), 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[80] flex flex-col gap-2 w-[min(22rem,calc(100vw-2rem))]"
        role="status"
        aria-live="polite"
      >
        {list.map((t) => (
          <div
            key={t.id}
            className={`adm-toast adm-card px-4 py-3 text-sm shadow-lg flex items-start gap-3 ${
              t.tone === "danger"
                ? "border-perideep/40 text-perideep"
                : t.tone === "info"
                ? "text-ink"
                : "border-mintdeep/40 text-mintdeep"
            }`}
          >
            <span className="mt-0.5 shrink-0">
              {t.tone === "danger" ? (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16v.5" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12.5l5 5L20 6.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            <span className="flex-1">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/* ============================================================
   Modal + confirm
   ============================================================ */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  wide = false,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[75] flex items-center justify-center p-4">
      <div aria-hidden="true" onClick={onClose} className="absolute inset-0 bg-inkdeep/50 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative adm-card w-full ${wide ? "max-w-3xl" : "max-w-md"} max-h-[88vh] flex flex-col shadow-2xl`}
      >
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-adminline shrink-0">
          <h2 className="adm-h2 text-ink">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 -mr-1.5 flex items-center justify-center text-adminmuted hover:text-ink transition"
          >
            <svg viewBox="0 0 24 24" className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>
        <div className="overflow-y-auto adm-card-pad flex-1">{children}</div>
        {footer && (
          <footer className="flex justify-end gap-2 px-5 py-4 border-t border-adminline shrink-0 bg-adminbg/60">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
}

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  body,
  confirmLabel = "Confirm",
  danger = false,
  busy = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  body: string;
  confirmLabel?: string;
  danger?: boolean;
  busy?: boolean;
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button type="button" onClick={onClose} className="adm-btn adm-btn-ghost" disabled={busy}>
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={busy}
            className={`adm-btn ${danger ? "adm-btn-danger" : "adm-btn-primary"}`}
          >
            {busy ? "Working…" : confirmLabel}
          </button>
        </>
      }
    >
      <p className="text-sm text-ink/80 leading-relaxed">{body}</p>
    </Modal>
  );
}

/* ============================================================
   Pagination
   ============================================================ */

export function Pagination({
  page,
  pageSize,
  total,
  onPage,
}: {
  page: number;
  pageSize: number;
  total: number;
  onPage: (p: number) => void;
}) {
  const last = Math.max(1, Math.ceil(total / pageSize));
  if (total === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-adminline">
      <p className="text-xs text-adminmuted tabular-nums">
        {from}–{to} of {total.toLocaleString("en-IN")}
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPage(page - 1)}
          disabled={page <= 1}
          className="adm-btn adm-btn-ghost adm-btn-sm"
        >
          Previous
        </button>
        <span className="text-xs text-adminmuted tabular-nums px-1">
          {page} / {last}
        </span>
        <button
          type="button"
          onClick={() => onPage(page + 1)}
          disabled={page >= last}
          className="adm-btn adm-btn-ghost adm-btn-sm"
        >
          Next
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   Demo-data notice — shown wherever numbers are not from the
   live database, so nobody mistakes sample figures for real ones.
   ============================================================ */

export function DemoNotice({ what }: { what: string }) {
  return (
    <p className="flex items-start gap-2 text-[0.72rem] text-adminmuted bg-sandsoft/60 border border-adminline rounded-lg px-3 py-2">
      <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 mt-0.5 shrink-0" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9" /><path d="M12 11v5M12 7.5v.5" strokeLinecap="round" />
      </svg>
      <span>
        <strong className="font-medium">Sample data.</strong> {what}
      </span>
    </p>
  );
}
