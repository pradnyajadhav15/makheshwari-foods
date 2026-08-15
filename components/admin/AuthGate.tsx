"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import PasswordInput from "@/components/PasswordInput";
import Shell from "@/components/admin/Shell";
import { Sk } from "@/components/admin/ui";

/**
 * Reuses the existing HMAC cookie session (lib/adminAuth.ts) — the same
 * one the current /admin uses — so signing in on either dashboard signs
 * you in on both.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState(0);

  useEffect(() => {
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => setAuthed(Boolean(d.authed)))
      .catch(() => setAuthed(false));
  }, []);

  /* Badge the Orders nav item with anything still awaiting action. */
  useEffect(() => {
    if (!authed) return;
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setPending(Number(d.needsAction) || 0))
      .catch(() => {});
  }, [authed]);

  const login = async () => {
    if (!pw) return;
    setBusy(true);
    setErr("");
    const r = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: pw }),
    });
    const d = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) {
      setErr(d.error || "Wrong password");
      return;
    }
    setPw("");
    setAuthed(true);
  };

  if (authed === null) {
    return (
      <div className="adm min-h-screen p-6" aria-busy="true">
        <div className="max-w-5xl mx-auto space-y-4">
          <Sk className="h-8 w-56" />
          <div className="grid sm:grid-cols-3 gap-4">
            <Sk className="h-28" /><Sk className="h-28" /><Sk className="h-28" />
          </div>
          <Sk className="h-72" />
        </div>
        <span className="sr-only">Checking your session</span>
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="adm min-h-screen flex items-center justify-center p-5">
        <div className="w-full max-w-sm">
          <div className="text-center mb-7">
            <Image src="/brand/logo.png" alt="Makheshwari Foods" width={200} height={116} className="h-16 w-auto mx-auto mb-4" />
            <h1 className="adm-h1 text-ink">Admin</h1>
            <p className="text-sm text-adminmuted mt-1.5">Sign in to manage the store</p>
          </div>

          <div className="adm-card adm-card-pad">
            <label className="adm-field-label" htmlFor="adm-pw">Password</label>
            <PasswordInput value={pw} onChange={setPw} onEnter={login} />

            {err && (
              <p className="text-perideep text-sm mt-3" role="alert">{err}</p>
            )}

            <button
              type="button"
              onClick={login}
              disabled={busy || !pw}
              className="adm-btn adm-btn-primary w-full mt-5"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </div>

          <p className="text-center text-xs text-adminmuted mt-5">
            Makheshwari Foods · Samastipur, Bihar
          </p>
        </div>
      </div>
    );
  }

  return <Shell pendingCount={pending}>{children}</Shell>;
}
