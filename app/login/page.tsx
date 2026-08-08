"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import PasswordInput from "@/components/PasswordInput";
import { AuthCard, authInput, authBtn, authLink } from "@/components/AuthCard";

export default function Login() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const go = async () => {
    setBusy(true); setErr("");
    const { error } = await supabaseBrowser().auth.signInWithPassword({ email, password: pw });
    if (error) { setErr(error.message); setBusy(false); return; }
    router.push("/account");
    router.refresh();
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Log in to your account"
      footer={<>New here? <Link href="/signup" className={authLink}>Create an account</Link></>}
    >
      <input className={authInput} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="mt-4"><PasswordInput value={pw} onChange={setPw} onEnter={go} /></div>
      <div className="text-right mt-3 mb-7">
        <Link href="/forgot-password" className="text-ink/50 text-xs hover:text-gold transition underline underline-offset-2">Forgot password?</Link>
      </div>
      <button type="button" onClick={go} disabled={busy} className={authBtn}>{busy ? "Logging in" : "Log in"}</button>
      {err && <p className="text-peri text-xs text-center mt-5">{err}</p>}
    </AuthCard>
  );
}