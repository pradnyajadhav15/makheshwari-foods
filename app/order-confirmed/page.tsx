"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Inner() {
  const id = useSearchParams().get("id");
  return (
    <section className="bg-cream px-6 py-32 text-center">
      <div className="w-16 h-16 rounded-full bg-mint/25 flex items-center justify-center mx-auto mb-8">
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="#12352A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
      </div>
      <h1 className="font-display text-4xl md:text-5xl text-ink mb-5">Order confirmed</h1>
      <p className="text-ink/60 font-light max-w-md mx-auto leading-relaxed mb-3">
        Thank you. We will pack it fresh and send tracking details shortly.
      </p>
      {id && <p className="text-ink/40 text-xs mb-10">Payment ID {id}</p>}
      <Link href="/shop" className="inline-block bg-ink text-cream rounded-full px-11 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
        Continue shopping
      </Link>
    </section>
  );
}

export default function OrderConfirmed() {
  return <Suspense><Inner /></Suspense>;
}