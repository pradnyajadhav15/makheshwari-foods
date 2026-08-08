import crypto from "crypto";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "mk_admin";
export const ADMIN_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return process.env.ADMIN_PASSWORD || "";
}

function sign(payload: string) {
  return crypto.createHmac("sha256", secret()).update(payload).digest("hex");
}

export function createSessionToken() {
  const expires = Date.now() + ADMIN_COOKIE_MAX_AGE * 1000;
  const payload = String(expires);
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token || !secret()) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload);
  const a = Buffer.from(expected);
  const b = Buffer.from(sig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return false;

  return Number(payload) > Date.now();
}

export function isAuthed(req: NextRequest) {
  return verifySessionToken(req.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export const ORDER_STATUSES = ["paid", "packed", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];
