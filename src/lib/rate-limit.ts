// Lightweight in-memory rate limiter — best-effort defense against floods.
// On serverless each instance keeps its own map, so this catches naive abuse
// but isn't a globally exact limit; Better Auth's own DB-backed limiter guards
// the auth endpoints, and Upstash/Redis is the upgrade path for hard limits.

type Bucket = { count: number; resetAt: number };
const buckets = new Map<string, Bucket>();

/** Fixed-window limit. Returns whether the request is allowed + seconds to retry. */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { ok: boolean; retryAfter: number } {
  const now = Date.now();

  // Bound memory: prune expired buckets when the map grows.
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }

  const b = buckets.get(key);
  if (!b || b.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfter: 0 };
  }
  if (b.count >= limit) {
    return { ok: false, retryAfter: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count++;
  return { ok: true, retryAfter: 0 };
}

/** Best-effort client IP from proxy headers. x-real-ip is set by the
 * platform (Vercel) and can't be client-supplied, so it's checked first;
 * the first x-forwarded-for entry can be influenced by the client on some
 * proxy setups. */
export function clientIp(req: Request): string {
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return "unknown";
}

export function tooManyRequests(retryAfter: number) {
  return new Response(JSON.stringify({ error: "Too many requests" }), {
    status: 429,
    headers: { "Content-Type": "application/json", "Retry-After": String(retryAfter) },
  });
}
