import { supabaseAdmin } from "@/lib/supabase";

export type Settings = {
  announcement: string;
  announcement_active: boolean;
  whatsapp: string;
  support_email: string;
  support_phone: string;
  instagram: string;
  shop_open: boolean;
  shop_closed_message: string;
};

// Used when the table is unreachable, so the site never breaks on a settings failure.
export const DEFAULTS: Settings = {
  announcement: "Free shipping on orders over 499",
  announcement_active: true,
  whatsapp: "917485001464",
  support_email: "makheshwarimakhana@gmail.com",
  support_phone: "+91 748 500 1464",
  instagram: "https://www.instagram.com/makheshwari_makhana/",
  shop_open: true,
  shop_closed_message: "We are restocking. Back in a few days.",
};

export async function getSettings(): Promise<Settings> {
  try {
    const { data, error } = await supabaseAdmin.from("settings").select("key,value");
    if (error || !data) return DEFAULTS;
    const out = { ...DEFAULTS } as Record<string, unknown>;
    for (const row of data) out[row.key] = row.value;
    return out as Settings;
  } catch {
    return DEFAULTS;
  }
}