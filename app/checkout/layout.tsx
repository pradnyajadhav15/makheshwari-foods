import type { Metadata } from "next";

/* The page itself is a client component and cannot export metadata, so the
   title and robots directive live here. Private or mid-funnel pages are
   useful to customers, not to search. */
export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}