"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { AuthCard, authInput, authBtn, authLink } from "@/components/AuthCard";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const go = async () => {
    setBusy(true); setErr("");
    const { error } = await supabaseBrowser().auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) { setErr(error.message); setBusy(false); return; }
    setSent(true); setBusy(false);
  };

  if (sent) {
    return (
      <AuthCard title="Check your email" subtitle={`If an account exists for ${email}, a reset link is on its way.`}>
        <Link href="/login" className={authBtn + " block text-center"}>Back to log in</Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot password"
      subtitle="We will email you a link to set a new one"
      footer={<Link href="/login" className={authLink}>Back to log in</Link>}
    >
      <input className={authInput + " mb-7"} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />
      <button type="button" onClick={go} disabled={busy} className={authBtn}>{busy ? "Sending" : "Send reset link"}</button>
      {err && <p className="text-peri text-xs text-center mt-5">{err}</p>}
    </AuthCard>
  );
}