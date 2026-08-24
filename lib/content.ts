import { supabaseAdmin } from "@/lib/supabase";
import { CONTENT_DEFAULTS, type ContentBlock } from "@/lib/contentSchema";

export { CONTENT_DEFAULTS, CONTENT_SCHEMA } from "@/lib/contentSchema";
export type { ContentBlock } from "@/lib/contentSchema";

export async function getContent(): Promise<Record<string, ContentBlock>> {
  try {
    const { data, error } = await supabaseAdmin.from("content").select("key,value");
    if (error || !data) return CONTENT_DEFAULTS;

    const out: Record<string, ContentBlock> = {};
    for (const key of Object.keys(CONTENT_DEFAULTS)) {
      const row = data.find((r) => r.key === key);
      // Merge over defaults so a partially-filled row never loses fields.
      out[key] = { ...CONTENT_DEFAULTS[key], ...((row?.value as ContentBlock) || {}) };
    }
    return out;
  } catch {
    return CONTENT_DEFAULTS;
  }
}

export async function getBlock(key: string): Promise<ContentBlock> {
  const all = await getContent();
  return all[key] ?? CONTENT_DEFAULTS[key] ?? {};
}
