"use client";

import { useEffect } from "react";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
    console.error(error);
  }, [error]);

  return (
    <section className="bg-cream px-6 md:px-14 py-28">
      <div className="max-w-2xl mx-auto text-center">
        <span className="inline-flex w-16 h-16 rounded-full bg-gold/15 items-center justify-center mb-8">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-gold" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
            <path d="M12 8v5M12 16.5v.5" />
            <circle cx="12" cy="12" r="9" />
          </svg>
        </span>

        <h1 className="font-display text-4xl md:text-5xl text-ink mb-5 leading-tight">
          Something went wrong.
        </h1>
        <p className="text-ink/60 text-lg font-light leading-relaxed mb-3">
          We have been told about it. Try again in a moment.
        </p>
        <p className="text-ink/60 font-light leading-relaxed mb-12">
          If you were placing an order and money has left your account, do not pay again. Message us
          on WhatsApp at{" "}
          <a href="https://wa.me/917485001464" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">
            +91 748 500 1464
          </a>{" "}
          and we will sort it out.
        </p>

        <div className="flex flex-wrap justify-center gap-3">
          <button type="button" onClick={reset} className="bg-ink text-cream rounded-full px-10 py-4 text-[11px] tracking-tracksm uppercase hover:bg-gold hover:text-ink transition">
            Try again
          </button>
          <Link href="/" className="border border-ink text-ink rounded-full px-10 py-4 text-[11px] tracking-tracksm uppercase hover:bg-ink hover:text-cream transition">
            Back home
          </Link>
        </div>

        {error.digest && (
          <p className="text-ink/35 text-[10px] tracking-tracksm uppercase mt-12">
            Reference {error.digest}
          </p>
        )}
      </div>
    </section>
  );
}