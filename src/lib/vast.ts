/**
 * VAST_API_URL must be the RAG base (scheme://host:port) with no path.
 * If it already includes `/v1` or `/v1/chat/completions`, concatenating
 * `/v1/models` produces a doubled path that looks like an outage.
 */
export function vastApiUrl(path: string): string {
  const base = (process.env.VAST_API_URL || "http://localhost:8000")
    .trim()
    .replace(/\/+$/, "")
    .replace(/\/v1$/i, "")
    .replace(/\/v1\/chat\/completions$/i, "");
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}
