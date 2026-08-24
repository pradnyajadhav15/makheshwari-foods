import { NextRequest, NextResponse } from "next/server";

/**
 * Content Security Policy.
 *
 * Two policies, because one size genuinely does not fit here.
 *
 * ── Why not a nonce everywhere ───────────────────────────────────────────
 * A nonce has to be minted per request and stamped into the HTML of that
 * same response. Next can only do that while rendering the page — so a
 * nonce policy forces every route it covers to be dynamically rendered.
 *
 * All 48 storefront routes are statically prerendered today. Serving them
 * with a rotating nonce header does not "mostly work"; it blocks every
 * script on the site, because the nonce frozen into the cached HTML never
 * matches the nonce in the header. This was measured, not assumed: 177
 * violations across 11 routes, every Next chunk refused.
 *
 * Forcing the whole storefront dynamic to fix that would trade the site's
 * static delivery — its single biggest speed win — for a policy the
 * storefront barely benefits from. The storefront holds no session and no
 * customer data in the page; its inline scripts are Next's own hydration
 * bootstrap.
 *
 * ── So: nonce where it pays for itself ───────────────────────────────────
 * /admin/* is password-gated, carries the mk_admin session cookie, and
 * renders orders, customer names, addresses and phone numbers. An XSS there
 * is worth far more to an attacker than one on /faq. It is also the one
 * area where dynamic rendering costs nothing — a handful of daily page
 * views by one person. `export const dynamic = "force-dynamic"` in
 * app/admin/layout.tsx is what makes the nonce reach the HTML; without it
 * this policy would break the admin exactly as described above.
 *
 * Admin therefore gets: no 'unsafe-inline', no 'unsafe-eval', a fresh nonce
 * per request, and 'strict-dynamic' so nonced scripts can load Next's
 * chunks.
 *
 * The storefront keeps 'unsafe-inline' on script-src — unavoidable while it
 * is prerendered — but 'unsafe-eval' is gone in production, which is a real
 * narrowing: nothing on the site needs it, and it removes a whole class of
 * string-to-code gadget.
 *
 * ── style-src ────────────────────────────────────────────────────────────
 * Keeps 'unsafe-inline' on both policies. The app uses inline style
 * attributes for animation delays, progress-bar widths and chart geometry,
 * and CSP has no nonce mechanism for style *attributes* — only for <style>
 * elements. Removing it means removing every inline style first. Style
 * injection is a much smaller risk than script injection, so this is a
 * reasonable place to stop.
 */

const isDev = process.env.NODE_ENV === "development";

/** Hosts something on the site actually loads from — checked, not guessed. */
const SHARED = [
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https://*.supabase.co https://*.razorpay.com https://maps.gstatic.com https://*.googleapis.com https://*.ggpht.com",
  // vitals.vercel-insights.com is where @vercel/analytics and speed-insights
  // POST to. Without it both fail silently and you lose all traffic data.
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://*.razorpay.com https://lumberjack.razorpay.com https://*.ingest.us.sentry.io https://*.ingest.sentry.io https://vitals.vercel-insights.com https://cdn.jsdelivr.net",
  "worker-src 'self' blob:",
  "frame-src https://checkout.razorpay.com https://*.razorpay.com https://api.razorpay.com https://www.google.com https://maps.google.com",
  "form-action 'self' https://*.razorpay.com",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests",
];

function join(directives: string[]) {
  return directives.join("; ").replace(/\s{2,}/g, " ").trim();
}

/** Strict, nonce-based. Only valid on dynamically rendered responses. */
function adminCsp(nonce: string) {
  return join([
    "default-src 'self'",
    // 'strict-dynamic' makes browsers that support it ignore the host list
    // and 'self' entirely, trusting only the nonce and whatever those
    // scripts go on to load. https: is the fallback for CSP2-era browsers,
    // which ignore 'strict-dynamic' and use the list instead.
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https: ${isDev ? "'unsafe-eval'" : ""}`,
    ...SHARED,
  ]);
}

/** Storefront: prerendered, so no nonce is possible. No 'unsafe-eval'. */
function siteCsp() {
  return join([
    "default-src 'self'",
    `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval'" : ""} https://checkout.razorpay.com https://*.razorpay.com https://*.sentry.io https://cdn.jsdelivr.net https://va.vercel-scripts.com`,
    ...SHARED,
  ]);
}

const IS_ADMIN = /^\/admin(?:\/|$)/;

export function middleware(request: NextRequest) {
  const admin = IS_ADMIN.test(request.nextUrl.pathname);

  const requestHeaders = new Headers(request.headers);
  // Strip any client-supplied x-nonce so a request cannot dictate the nonce
  // Next stamps into the HTML.
  requestHeaders.delete("x-nonce");

  let csp: string;
  if (admin) {
    const nonce = crypto.randomUUID().replace(/-/g, "");
    csp = adminCsp(nonce);
    // Next reads x-nonce and applies it to every script tag it renders.
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", csp);
  } else {
    csp = siteCsp();
  }

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // Report-only is opt-in per deploy: violations are logged to the console
  // but nothing is blocked. Unlike the old next.config.ts version this is
  // read at RUN time, so flipping it needs a redeploy but not a rebuild.
  const key =
    process.env.CSP_REPORT_ONLY === "1"
      ? "Content-Security-Policy-Report-Only"
      : "Content-Security-Policy";
  response.headers.set(key, csp);

  return response;
}

export const config = {
  matcher: [
    /**
     * Every document request, but not static assets — they carry no HTML,
     * so a CSP on them does nothing except add per-request work.
     */
    {
      source: "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|mp4|webm|woff2?)$).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};
