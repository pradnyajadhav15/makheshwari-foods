import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";
import { getContent, CONTENT_DEFAULTS } from "@/lib/content";

const MISSING_TABLE = "42P01";

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Probe the table so the admin can tell "not migrated yet" apart from
  // "migrated but empty" — getContent() silently falls back to defaults.
  const { error } = await supabaseAdmin.from("content").select("key").limit(1);
  const migrated = !error || error.code !== MISSING_TABLE;

  return NextResponse.json({ content: await getContent(), migrated });
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const rows = Object.entries(body)
    // Only keys the schema knows about, so the editor cannot create junk rows.
    .filter(([k]) => k in CONTENT_DEFAULTS)
    .map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));

  if (!rows.length) return NextResponse.json({ error: "Nothing to save" }, { status: 400 });

  const { error } = await supabaseAdmin.from("content").upsert(rows, { onConflict: "key" });
  if (error) {
    if (error.code === MISSING_TABLE) {
      return NextResponse.json(
        { error: "The content table does not exist yet. Run supabase/03_content.sql first." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ content: await getContent(), migrated: true });
}
