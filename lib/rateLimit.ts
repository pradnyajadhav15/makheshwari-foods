import { supabaseAdmin } from "@/lib/supabase";

export type RateResult = { allowed: boolean; remaining?: number; retryAfter?: number };

/**
 * Database-backed so it survives serverless cold starts and works
 * across every instance, unlike an in-memory counter.
 */
export async function rateLimit(
  bucket: string,
  identifier: string,
  limit: number,
  windowSeconds: number
): Promise<RateResult> {
  try {
    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      p_bucket: bucket,
      p_identifier: identifier,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    });

    if (error) {
      console.error("Rate limit check failed", error);
      return { allowed: true };   // fail open: never block real customers on our bug
    }

    const r = data as { allowed: boolean; remaining?: number; retry_after?: number };
    return { allowed: r.allowed, remaining: r.remaining, retryAfter: r.retry_after };
  } catch (e) {
    console.error("Rate limit error", e);
    return { allowed: true };
  }
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return req.headers.get("x-real-ip") || "unknown";
}