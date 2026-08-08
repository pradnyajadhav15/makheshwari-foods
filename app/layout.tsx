import type { Metadata } from "next";
import { Marcellus, Jost } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import { ADDRESS, EMAIL, INSTAGRAM } from "@/lib/products";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const display = Marcellus({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-marcellus",
  display: "swap",
});

const body = Jost({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const SITE = "https://makheshwarifoods.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "Makheshwari Foods - Roasted makhana from Mithila, Bihar",
    template: "%s | Makheshwari Foods",
  },
  description:
    "Premium roasted makhana from Samastipur, Bihar. Roasted, never fried. Peri Peri, Garden Mint and Himalayan Pink Salt.",
  keywords: [
    "makhana",
    "roasted makhana",
    "fox nut",
    "Mithila makhana",
    "Bihar makhana",
    "flavoured makhana",
    "healthy snack India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE,
    siteName: "Makheshwari Foods",
    title: "Makheshwari Foods - Roasted makhana from Mithila, Bihar",
    description: "Roasted in Samastipur, never fried. Three flavours, one honest crunch.",
  },
  robots: { index: true, follow: true },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Makheshwari Foods",
  url: SITE,
  email: EMAIL,
  sameAs: [INSTAGRAM],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Samastipur",
    addressRegion: "Bihar",
    postalCode: "848101",
    addressCountry: "IN",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="bg-cream text-ink font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        <CartProvider><Header />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton /></CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

