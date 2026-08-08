# Makheshwari Foods

E-commerce site for a roasted makhana brand in Samastipur, Bihar.

## Stack
Next.js 16 App Router, TypeScript, Tailwind v4, Supabase, Razorpay, Resend.

## Critical
- Tailwind v4: theme lives in `app/globals.css` under `@theme`. There is NO tailwind.config.ts.
- Windows PowerShell 5.1: write files with `[System.IO.File]::WriteAllText` and `UTF8Encoding $false` to avoid BOM.
- Paths containing `[slug]` need `-LiteralPath` or .NET methods; `Copy-Item` fails silently on them.

## Brand
Colours: ink #12352A, inkdeep #0C241C, gold #C9A227, cream #F7F3E9, sand #E5DAC3.
Flavour accents: peri #D8503C, mint #7FA860, salt #DB8C9E.
Fonts: Marcellus (display), Jost (body).

## Data
Products, orders, reviews, bulk enquiries and product images all live in Supabase.
`lib/products.ts` holds static copy (descriptions, ingredients, nutrition).
`lib/liveProducts.ts` merges that with live price, stock and images from the database.

## Admin
`/admin`, password in ADMIN_PASSWORD, HMAC cookie session via `lib/adminAuth.ts`.
Tabs: Orders, Products, Reviews, Enquiries.

## Compliance
FSSAI 10426330000072, GSTIN 10ERSPK0044M2ZP, entity Sonu Enterprises.
Avoid unsubstantiated nutrition claims (protein, calcium, superfood, guilt-free) - FSSAI regulated.