# Makheshwari Foods

D2C e-commerce storefront for premium roasted makhana (fox nuts) from Samastipur, Bihar. Roasted, never fried.

**Live:** [makheshwarifoods.com](https://makheshwarifoods.com)

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS with custom design tokens |
| Database & Auth | Supabase (Postgres, Row Level Security) |
| Payments | Razorpay |
| Hosting | Vercel |
| Monitoring | Sentry, Vercel Analytics, Speed Insights |
| Type | Marcellus (display), Jost (body) |

## Features

### Storefront
- Product catalogue with three flavours: Peri Peri, Garden Mint, Himalayan Pink Salt
- Cart with persistent drawer and coupon support
- Razorpay checkout with order confirmation emails
- Customer accounts with order history
- Recipes, brand story, and makhana education pages
- Bulk order enquiry form
- WhatsApp quick-contact button
- SEO: dynamic sitemap, robots directives, per-page metadata, Open Graph tags

### Admin dashboard (`/admin`)
Password-protected panel with eight sections:

- **Dashboard** — revenue and order overview
- **Orders** — search, status filters, date ranges, archive, CSV export, invoice PDFs, shipment tracking, one-click WhatsApp and email customer updates
- **Products** — catalogue management
- **Coupons** — discount codes
- **Customers** — customer records
- **Reviews** — moderation
- **Enquiries** — bulk order leads
- **Settings** — store configuration

## Getting started

```bash
npm install
npm run dev
```

Runs at `http://localhost:3000`.

```bash
npm run build    # production build
npm run start    # serve the production build
npm run lint     # lint
```

## Environment variables

Create `.env.local` in the project root:
Supabase

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

Razorpay

NEXT_PUBLIC_RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=

Email (Resend)

RESEND_API_KEY=
OWNER_EMAIL=
Admin

ADMIN_PASSWORD=

Monitoring

NEXT_PUBLIC_SENTRY_DSN=



Variables prefixed `NEXT_PUBLIC_` are exposed to the browser. The rest are server-only and must never be committed — `SUPABASE_SERVICE_ROLE_KEY` in particular bypasses Row Level Security entirely.

The same set must be configured in the Vercel project settings for production builds.

## Project structure
app/
admin/ Admin dashboard
api/ Route handlers (orders, auth, invoices, export)
shop/ Catalogue and product detail pages
recipes/ Recipe index and detail pages
layout.tsx Root layout, fonts, metadata
sitemap.ts Dynamic sitemap
robots.ts Crawl directives
components/ Shared and admin UI components
lib/ Products, recipes, Supabase clients, message helpers
public/ Static assets

## Security

- Content Security Policy restricting script, style, frame, and connect sources
- Permissions-Policy disabling camera, microphone, geolocation, and FLoC
- Admin routes gated by server-side session verification
- `/admin`, `/api/`, `/checkout`, and `/cart` excluded from crawling

## Deployment

Deployed on Vercel with automatic builds from `main`.

The apex domain serves production; `www` issues a 308 redirect to it.

## Licence

Proprietary. All rights reserved.

---

Built by [AI Forge](https://ai-forgeco.vercel.app)