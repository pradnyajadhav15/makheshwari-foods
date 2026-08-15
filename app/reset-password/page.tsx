"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import PasswordInput from "@/components/PasswordInput";
import { AuthCard, authBtn } from "@/components/AuthCard";

export default function Reset() {
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const go = async () => {
    if (pw.length < 8) { setErr("Password must be at least 8 characters"); return; }
    if (pw !== pw2) { setErr("Passwords do not match"); return; }
    setBusy(true); setErr("");
    const { error } = await supabaseBrowser().auth.updateUser({ password: pw });
    if (error) { setErr(error.message); setBusy(false); return; }
    router.push("/account");
    router.refresh();
  };

  return (
    <AuthCard title="Set a new password" subtitle="Choose something you will remember">
      <PasswordInput value={pw} onChange={setPw} placeholder="New password" />
      <div className="mt-4 mb-7"><PasswordInput value={pw2} onChange={setPw2} placeholder="Confirm password" onEnter={go} /></div>
      <button type="button" onClick={go} disabled={busy} className={authBtn}>{busy ? "Saving" : "Save password"}</button>
      {err && <p className="text-perideep text-xs text-center mt-5">{err}</p>}
    </AuthCard>
  );
}