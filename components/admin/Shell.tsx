"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Icons, type IconName } from "@/components/admin/Icons";
import { useToast } from "@/components/admin/ui";

const BASE = "/admin/v2";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: BASE, label: "Dashboard", icon: "dashboard" },
  { href: `${BASE}/products`, label: "Products", icon: "products" },
  { href: `${BASE}/orders`, label: "Orders", icon: "orders" },
  { href: `${BASE}/customers`, label: "Customers", icon: "customers" },
  { href: `${BASE}/enquiries`, label: "Bulk enquiries", icon: "content" },
  { href: `${BASE}/inventory`, label: "Inventory", icon: "inventory" },
  { href: `${BASE}/categories`, label: "Categories", icon: "categories" },
  { href: `${BASE}/coupons`, label: "Coupons & Offers", icon: "coupons" },
  { href: `${BASE}/reviews`, label: "Reviews", icon: "reviews" },
  { href: `${BASE}/content`, label: "Website Content", icon: "content" },
  { href: `${BASE}/analytics`, label: "Analytics", icon: "analytics" },
  { href: `${BASE}/settings`, label: "Settings", icon: "settings" },
];

export default function Shell({
  children,
  pendingCount = 0,
}: {
  children: React.ReactNode;
  pendingCount?: number;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { push } = useToast();

  const [collapsed, setCollapsed] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [bell, setBell] = useState(false);
  const [q, setQ] = useState("");

  /* Remember the collapsed preference between visits. */
  useEffect(() => {
    setCollapsed(localStorage.getItem("mk-adm-collapsed") === "1");
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      localStorage.setItem("mk-adm-collapsed", c ? "0" : "1");
      return !c;
    });
  };

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawer]);

  const isActive = (href: string) =>
    href === BASE ? pathname === BASE : pathname?.startsWith(href);

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    push("Signed out", "info");
    router.replace(BASE);
    router.refresh();
  };

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const term = q.trim();
    if (!term) return;
    // Orders is the broadest index (name, phone, email, payment id).
    router.push(`${BASE}/orders?q=${encodeURIComponent(term)}`);
    setDrawer(false);
  };

  const sidebar = (
    <div className="flex flex-col h-full bg-inkdeep text-cream">
      <div className={`flex items-center gap-3 h-16 shrink-0 border-b border-cream/10 ${collapsed ? "justify-center px-2" : "px-4"}`}>
        <Link href={BASE} className="flex items-center gap-2.5 min-w-0" onClick={() => setDrawer(false)}>
          {/* The sidebar is bg-inkdeep, so this needs the reversed logo — the
              standard one has a dark green wordmark that disappears on it. */}
          <Image src="/brand/logo-light.png" alt="" width={120} height={70} className="h-12 w-auto shrink-0" />
          {!collapsed && (
            <span className="font-display text-cream text-sm leading-tight truncate">
              Makheshwari
              <span className="block text-[0.6rem] tracking-[0.18em] uppercase text-cream/50">Admin</span>
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5" aria-label="Admin sections">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            onClick={() => setDrawer(false)}
            aria-current={isActive(n.href) ? "page" : undefined}
            title={collapsed ? n.label : undefined}
            className={`adm-nav ${collapsed ? "justify-center" : ""}`}
          >
            {Icons[n.icon]}
            {!collapsed && <span className="truncate">{n.label}</span>}
            {!collapsed && n.label === "Orders" && pendingCount > 0 && (
              <span className="ml-auto text-[0.62rem] bg-gold text-ink rounded-full px-1.5 py-0.5 tabular-nums font-medium">
                {pendingCount}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="p-2 border-t border-cream/10 shrink-0">
        <button
          type="button"
          onClick={logout}
          title={collapsed ? "Logout" : undefined}
          className={`adm-nav w-full ${collapsed ? "justify-center" : ""}`}
        >
          {Icons.logout}
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="adm min-h-screen flex">
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 transition-[width] duration-200 ${
          collapsed ? "w-[4.5rem]" : "w-64"
        }`}
      >
        <div className="fixed inset-y-0 left-0 z-30 transition-[width] duration-200"
             style={{ width: collapsed ? "4.5rem" : "16rem" }}>
          {sidebar}
        </div>
      </aside>

      {/* Mobile drawer */}
      <div
        className={`lg:hidden fixed inset-0 z-[65] transition-opacity duration-250 ${
          drawer ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!drawer}
      >
        <div aria-hidden="true" onClick={() => setDrawer(false)} className="absolute inset-0 bg-inkdeep/60 backdrop-blur-sm" />
        <div
          className={`absolute inset-y-0 left-0 w-[17rem] max-w-[85%] transition-transform duration-250 ${
            drawer ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {sidebar}
        </div>
      </div>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top navbar */}
        <header className="sticky top-0 z-40 bg-adminbg/95 backdrop-blur border-b border-adminline">
          <div className="flex items-center gap-2 sm:gap-3 h-16 px-3 sm:px-5">
            <button
              type="button"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              className="lg:hidden w-10 h-10 flex items-center justify-center text-ink shrink-0"
            >
              <span className="w-5 h-5 block">{Icons.menu}</span>
            </button>

            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="hidden lg:flex w-10 h-10 items-center justify-center text-adminmuted hover:text-ink transition shrink-0"
            >
              <span className={`w-5 h-5 block transition-transform ${collapsed ? "" : "rotate-180"}`}>
                {Icons.chevron}
              </span>
            </button>

            <form onSubmit={submitSearch} className="relative flex-1 max-w-md">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-adminmuted pointer-events-none">
                {Icons.search}
              </span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search orders, customers, payment ID…"
                aria-label="Search"
                className="adm-input pl-9 text-sm"
              />
            </form>

            <div className="flex items-center gap-1 ml-auto shrink-0">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setBell((b) => !b)}
                  aria-label={pendingCount > 0 ? `Notifications, ${pendingCount} needing action` : "Notifications"}
                  aria-expanded={bell}
                  className="relative w-10 h-10 flex items-center justify-center text-adminmuted hover:text-ink transition"
                >
                  <span className="w-5 h-5 block">{Icons.bell}</span>
                  {pendingCount > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-perideep ring-2 ring-adminbg" />
                  )}
                </button>

                {bell && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setBell(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-1 w-72 adm-card shadow-xl z-20 overflow-hidden">
                      <p className="px-4 py-3 border-b border-adminline adm-label">Notifications</p>
                      <div className="p-4 text-sm">
                        {pendingCount > 0 ? (
                          <Link
                            href={`${BASE}/orders?status=paid`}
                            onClick={() => setBell(false)}
                            className="flex gap-3 hover:text-golddeep transition"
                          >
                            <span className="w-4 h-4 mt-0.5 text-perideep shrink-0">{Icons.alert}</span>
                            <span>
                              <strong className="font-medium">{pendingCount}</strong> order
                              {pendingCount === 1 ? "" : "s"} awaiting packing
                            </span>
                          </Link>
                        ) : (
                          <p className="text-adminmuted">Nothing needs attention.</p>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <Link
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="adm-btn adm-btn-ghost adm-btn-sm hidden sm:inline-flex"
              >
                <span className="w-3.5 h-3.5 block">{Icons.external}</span>
                View website
              </Link>

              <span
                className="w-9 h-9 rounded-full bg-ink text-cream flex items-center justify-center text-xs font-medium shrink-0 ml-1"
                title="Signed in as admin"
              >
                MF
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-[110rem] w-full">{children}</main>
      </div>
    </div>
  );
}
