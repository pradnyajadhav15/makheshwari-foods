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
    <section className="wrap-mid section-lg text-center">
      <span className="inline-flex w-16 h-16 rounded-full bg-gold/15 items-center justify-center mb-8">
        <svg viewBox="0 0 24 24" className="w-7 h-7 text-golddeep" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
          <path d="M12 8v5M12 16.5v.5" />
          <circle cx="12" cy="12" r="9" />
        </svg>
      </span>

      <h1 className="display-lg text-ink">Something went wrong.</h1>

      <p className="lede text-ink/75 mt-6">We have been told about it. Try again in a moment.</p>

      <p className="text-ink/70 body-text mt-4 max-w-lg mx-auto">
        If you were placing an order and money has left your account, do not pay again. Message us on
        WhatsApp at{" "}
        <a
          href="https://wa.me/917485001464"
          target="_blank"
          rel="noopener noreferrer"
          className="text-golddeep underline underline-offset-2"
        >
          +91 74850 01464
        </a>{" "}
        and we will sort it out.
      </p>

      <div className="flex flex-wrap justify-center gap-3 mt-10">
        <button type="button" onClick={reset} className="btn btn-primary">Try again</button>
        <Link href="/" className="btn btn-outline">Back home</Link>
      </div>

      {error.digest && (
        <p className="text-ink/70 text-[0.62rem] tracking-tracksm uppercase mt-12">
          Reference {error.digest}
        </p>
      )}
    </section>
  );
}
