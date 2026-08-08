"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#FDF6EC", fontFamily: "Georgia, serif", padding: "2rem", textAlign: "center" }}>
        <div style={{ maxWidth: "34rem" }}>
          <h1 style={{ fontSize: "2.25rem", color: "#12352A", marginBottom: "1rem", lineHeight: 1.2 }}>
            Something went wrong.
          </h1>
          <p style={{ color: "rgba(18,53,42,0.65)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: "2rem" }}>
            The page could not load. Please try again, or message us on WhatsApp at +91 748 500 1464.
          </p>
          <button
            onClick={reset}
            style={{ background: "#12352A", color: "#FDF6EC", border: "none", borderRadius: "999px", padding: "1rem 2.5rem", fontSize: "0.7rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}