/**
 * The admin is rendered per request, not prerendered.
 *
 * This is what makes the nonce-based CSP in middleware.ts work: Next can
 * only stamp a per-request nonce into HTML it renders per request. A
 * prerendered admin would be served with a nonce frozen at build time while
 * the header carried a fresh one, and every script would be refused.
 *
 * The cost is nil here — the admin is one password-gated user, not traffic.
 */
export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-sand/20">{children}</div>;
}
