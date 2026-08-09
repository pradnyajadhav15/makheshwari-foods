import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isAuthed } from "@/lib/adminAuth";
import { getSettings, DEFAULTS } from "@/lib/settings";

const ALLOWED = Object.keys(DEFAULTS);

export async function GET(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json(await getSettings());
}

export async function PATCH(req: NextRequest) {
  if (!isAuthed(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const rows = Object.entries(body)
    .filter(([k]) => ALLOWED.includes(k))
    .map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }));

  if (!rows.length) return NextResponse.json({ error: "Nothing to save" }, { status: 400 });

  const { error } = await supabaseAdmin.from("settings").upsert(rows, { onConflict: "key" });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(await getSettings());
}