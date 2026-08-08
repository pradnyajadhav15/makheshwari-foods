import { NextResponse } from "next/server";
import crypto from "crypto";
import { ADMIN_COOKIE_MAX_AGE, ADMIN_COOKIE_NAME, createSessionToken } from "@/lib/adminAuth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export async function POST(req: Request) {
  const ip = clientIp(req);

  // Single shared password, so brute force protection matters.
  const limit = await rateLimit("admin-login:ip", ip, 8, 15 * 60);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: `Too many attempts. Try again in ${Math.ceil((limit.retryAfter || 900) / 60)} minutes.` },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter || 900) } }
    );
  }

  const { password } = await req.json();
  const expected = process.env.ADMIN_PASSWORD || "";

  // Constant-time compare so response timing does not leak the password.
  const a = Buffer.from(String(password || ""));
  const b = Buffer.from(expected);
  const ok = expected.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);

  if (!ok) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE_NAME, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_COOKIE_MAX_AGE,
  });
  return res;
}