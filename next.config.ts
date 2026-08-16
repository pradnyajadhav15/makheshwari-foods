import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * Content Security Policy.
 *
 * Every host below is here because something on the site actually loads
 * from it — the list was checked against real page loads, not guessed.
 *
 *  - Razorpay        checkout script, its iframe, and its XHRs
 *  - Supabase        product images from storage, and the browser client
 *  - Sentry          error ingest
 *  - Vercel          analytics and speed-insights beacons
 *  - Google Maps     the embedded map on /contact
 *  - jsDelivr        dotLottie fetches its WASM decoder from there
 *
 * 'unsafe-inline' and 'unsafe-eval' on script-src are required by Next's
 * hydration bootstrap. Removing them needs nonce-based CSP via middleware,
 * which is a bigger change than this one.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.razorpay.com https://*.sentry.io https://cdn.jsdelivr.net",
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
].join("; ");

/**
 * Set CSP_REPORT_ONLY=1 to ship the policy without enforcing it: violations
 * are logged to the browser console but nothing is blocked. Useful for
 * verifying a policy change against real traffic before it can break
 * checkout.
 *
 * This is read at BUILD time, not run time — Next serialises headers() into
 * routes-manifest.json — so it must be set on the build command (or as a
 * Vercel build environment variable) and needs a redeploy to change.
 */
const cspHeaderKey =
  process.env.CSP_REPORT_ONLY === "1"
    ? "Content-Security-Policy-Report-Only"
    : "Content-Security-Policy";

const securityHeaders = [
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: cspHeaderKey, value: csp },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" }],
  },
  // This array existed but was never wired to a headers() function, so none
  // of the policies above were ever sent.
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      // The admin should never be framed or indexed, whatever the referrer.
      {
        source: "/admin/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow" },
          { key: "Cache-Control", value: "no-store, max-age=0" },
        ],
      },
    ];
  },
};

export default withSentryConfig(nextConfig, {
  silent: true,
  widenClientFileUpload: true,
});
