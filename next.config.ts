import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

/**
 * CSP is NOT set here any more — it moved to middleware.ts, which mints a
 * per-request nonce. Two CSP headers on one response are intersected by the
 * browser, so a leftover static policy here would silently override the
 * nonce policy and break every script on the site.
 *
 * Everything below is static and safe to serve from the config.
 */
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
