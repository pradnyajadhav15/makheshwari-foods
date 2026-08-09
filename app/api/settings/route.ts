import { NextResponse } from "next/server";
import { getSettings } from "@/lib/settings";

export const revalidate = 60;

export async function GET() {
  const s = await getSettings();
  return NextResponse.json(s);
}