/** Single-stroke icon set for the admin nav. Kept inline to avoid a dependency. */

const P = (d: string) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

export const Icons = {
  dashboard: P("M4 13h6V4H4v9zM14 20h6v-9h-6v9zM4 20h6v-4H4v4zM14 8h6V4h-6v4z"),
  products: P("M4 7l8-4 8 4v10l-8 4-8-4V7zM4 7l8 4 8-4M12 11v10"),
  orders: P("M6 6h15l-1.5 9h-12L6 6zM6 6L5 3H3M8 20a1 1 0 100-2 1 1 0 000 2zM18 20a1 1 0 100-2 1 1 0 000 2z"),
  customers: P("M16 20v-1a4 4 0 00-4-4H7a4 4 0 00-4 4v1M9.5 11a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM21 20v-1a4 4 0 00-3-3.9M16.5 4.3a4 4 0 010 7.4"),
  inventory: P("M3 8h18M3 8l1.5-4h15L21 8M3 8v12h18V8M9 12h6"),
  categories: P("M4 4h7v7H4V4zM13 4h7v7h-7V4zM4 13h7v7H4v-7zM13 13h7v7h-7v-7z"),
  coupons: P("M3 9a2 2 0 012-2h14a2 2 0 012 2 2 2 0 000 4 2 2 0 01-2 2H5a2 2 0 01-2-2 2 2 0 000-4zM9 9v6M15 9v6"),
  reviews: P("M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.7l5.9-.9L12 3.5z"),
  content: P("M4 4h16v16H4V4zM4 9h16M9 9v11"),
  analytics: P("M4 20V10M10 20V4M16 20v-7M22 20H2"),
  settings: P("M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.7 1.7 0 00.3 1.9l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-2.9 1.2V21a2 2 0 11-4 0v-.1A1.7 1.7 0 007 19.4a1.7 1.7 0 00-1.9.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00-1.2-2.9H1a2 2 0 110-4h.1A1.7 1.7 0 002.3 7a1.7 1.7 0 00-.3-1.9l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.9.3H7a1.7 1.7 0 001-1.5V1a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.9-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.9V7a1.7 1.7 0 001.5 1H23a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z"),
  logout: P("M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.6-3.6" strokeLinecap="round" />
    </svg>
  ),
  bell: P("M18 8a6 6 0 10-12 0c0 7-2 8-2 8h16s-2-1-2-8M13.7 21a2 2 0 01-3.4 0"),
  external: P("M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3"),
  menu: P("M3 7h18M3 12h18M3 17h18"),
  close: P("M6 6l12 12M18 6L6 18"),
  plus: P("M12 5v14M5 12h14"),
  edit: P("M11 4H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-5M18.5 2.5a2.1 2.1 0 013 3L12 15l-4 1 1-4 9.5-9.5z"),
  copy: P("M9 9h10v12H9V9zM5 15H3V3h12v2"),
  trash: P("M4 7h16M10 11v6M14 11v6M5 7l1 13h12l1-13M9 7V4h6v3"),
  chevron: P("M9 5l7 7-7 7"),
  download: P("M12 3v12M7 11l5 5 5-5M4 21h16"),
  filter: P("M3 5h18M6 12h12M10 19h4"),
  box: P("M4 7l8-4 8 4v10l-8 4-8-4V7z"),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
      <circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16v.5" strokeLinecap="round" />
    </svg>
  ),
  check: P("M4 12.5l5 5L20 6.5"),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M3 12s3.5-7 9-7 9 7 9 7-3.5 7-9 7-9-7-9-7z" /><circle cx="12" cy="12" r="2.8" />
    </svg>
  ),
  eyeOff: P("M3 3l18 18M10.6 10.6a2 2 0 002.8 2.8M9.4 5.2A9.5 9.5 0 0112 5c5 0 9 4.5 9 7a12 12 0 01-2.4 3.3M6.2 6.6A12 12 0 003 12c0 2.5 4 7 9 7a9.3 9.3 0 003.6-.7"),
};

export type IconName = keyof typeof Icons;

export function Icon({ name, className = "w-5 h-5" }: { name: IconName; className?: string }) {
  return <span className={`inline-block ${className}`}>{Icons[name]}</span>;
}
