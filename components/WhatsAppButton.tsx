"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [wa, setWa] = useState("917485001464");
  useEffect(() => { fetch("/api/settings").then((r) => r.json()).then((s) => s?.whatsapp && setWa(s.whatsapp)).catch(() => {}); }, []);
  if (pathname?.startsWith("/admin")) return null;
  return (
    /* Sits above the sticky mobile buy bar (see .buybar) so the two never
       overlap on a product page. */
    <a href={`https://wa.me/${wa}?text=Hi%2C%20I%20have%20a%20question%20about%20Makheshwari%20Makhana`} target="_blank" rel="noopener noreferrer" aria-label="Message us on WhatsApp" className="fixed bottom-24 right-4 lg:bottom-6 lg:right-6 z-30 w-13 h-13 lg:w-14 lg:h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-[0_10px_30px_-6px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:scale-110">
      <svg viewBox="0 0 24 24" className="w-7 h-7" fill="#fff"><path d="M17.5 14.4c-.3-.2-1.8-.9-2-1-.3-.1-.5-.2-.7.1s-.8 1-.9 1.2c-.2.2-.3.2-.6.1a8.2 8.2 0 01-2.4-1.5 9 9 0 01-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5v-.5c0-.2-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.1l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2z"/></svg>
    </a>
  );
}