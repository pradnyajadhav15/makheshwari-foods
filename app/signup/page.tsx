"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import PasswordInput from "@/components/PasswordInput";
import { AuthCard, authInput, authBtn, authLink } from "@/components/AuthCard";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const go = async () => {
    if (pw.length < 8) { setErr("Password must be at least 8 characters"); return; }
    setBusy(true); setErr("");
    const { data, error } = await supabaseBrowser().auth.signUp({
      email,
      password: pw,
      options: { data: { full_name: name } },
    });
    if (error) { setErr(error.message); setBusy(false); return; }
    if (data.session) { router.push("/account"); router.refresh(); return; }
    setSent(true); setBusy(false);
  };

  if (sent) {
    return (
      <AuthCard title="Check your email" subtitle={`We sent a confirmation link to ${email}.`}>
        <Link href="/login" className={authBtn + " block text-center"}>Back to log in</Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Create account"
      subtitle="Track your orders and reorder faster"
      footer={<>Already have one? <Link href="/login" className={authLink}>Log in</Link></>}
    >
      <input className={authInput} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={authInput + " mt-4"} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="mt-4 mb-7"><PasswordInput value={pw} onChange={setPw} placeholder="Password, at least 8 characters" onEnter={go} /></div>
      <button type="button" onClick={go} disabled={busy} className={authBtn}>{busy ? "Creating" : "Create account"}</button>
      {err && <p className="text-perideep text-xs text-center mt-5">{err}</p>}
    </AuthCard>
  );
}