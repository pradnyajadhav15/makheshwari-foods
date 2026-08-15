"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function Inner() {
  const id = useSearchParams().get("id");

  return (
    <section className="wrap section-lg text-center">
      <span className="inline-flex w-16 h-16 rounded-full bg-mint/25 items-center justify-center mb-8">
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-ink" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 13l4 4L19 7" />
        </svg>
      </span>

      <h1 className="display-lg text-ink">Order confirmed</h1>

      <p className="lede text-ink/75 max-w-md mx-auto mt-6">
        Thank you. We will pack it fresh and send tracking details shortly.
      </p>

      {id && (
        <p className="text-ink/70 text-xs mt-4 break-words">
          Payment ID <span className="tabular-nums">{id}</span>
        </p>
      )}

      <div className="flex flex-wrap justify-center gap-3 mt-10">
        <Link href="/shop" className="btn btn-primary">Continue shopping</Link>
        <Link href="/account" className="btn btn-outline">Track your order</Link>
      </div>

      <p className="text-ink/70 body-text mt-10">
        Questions?{" "}
        <a
          href="https://wa.me/917485001464"
          target="_blank"
          rel="noopener noreferrer"
          className="text-golddeep underline underline-offset-2"
        >
          Message us on WhatsApp
        </a>
      </p>
    </section>
  );
}

export default function OrderConfirmed() {
  return (
    <Suspense>
      <Inner />
    </Suspense>
  );
}
