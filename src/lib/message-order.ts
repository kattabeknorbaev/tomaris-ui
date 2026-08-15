/**
 * Chat transcripts must render oldest→newest, user then assistant, latest at
 * the bottom. Two things used to invert that:
 *
 * 1. User + assistant PUTs are fire-and-forget. The empty assistant insert
 *    often lands first, so Postgres `created_at` (server defaultNow) is
 *    earlier on the reply than on the prompt. `ORDER BY created_at ASC` then
 *    draws the assistant ABOVE the user that caused it — newest turns still
 *    sit at the bottom, so it is not a fully reversed history.
 * 2. A fully reversed array (or `flex-col-reverse` on a chronological list)
 *    puts the latest turn at the top.
 *
 * Sort by the client timestamp, prefer user before assistant on ties, then
 * repair adjacent assistant→user pairs when that inverted pattern dominates.
 */

export type TranscriptItem = {
  role: string;
  timestamp?: string;
  createdAt?: string | Date;
};

function timeMs(m: TranscriptItem): number {
  const raw = m.timestamp ?? m.createdAt;
  if (raw instanceof Date) {
    const t = raw.getTime();
    return Number.isFinite(t) ? t : 0;
  }
  if (typeof raw === "string" && raw) {
    const t = Date.parse(raw);
    return Number.isFinite(t) ? t : 0;
  }
  return 0;
}

function roleRank(role: string): number {
  if (role === "user") return 0;
  if (role === "assistant") return 1;
  return 2;
}

function adjacentPairCounts(messages: { role: string }[]) {
  let inverted = 0;
  let normal = 0;
  for (let i = 0; i < messages.length - 1; i++) {
    const a = messages[i].role;
    const b = messages[i + 1].role;
    if (a === "assistant" && b === "user") inverted++;
    else if (a === "user" && b === "assistant") normal++;
  }
  return { inverted, normal };
}

function repairInvertedTurns<T extends { role: string }>(messages: T[]): T[] {
  const { inverted, normal } = adjacentPairCounts(messages);
  if (inverted <= normal) return messages;

  const out = messages.slice();
  for (let i = 0; i < out.length - 1; i++) {
    if (out[i].role === "assistant" && out[i + 1].role === "user") {
      const tmp = out[i];
      out[i] = out[i + 1];
      out[i + 1] = tmp;
      i++;
    }
  }
  return out;
}

/** Oldest first, user→assistant within a turn, latest pair at the end. */
export function orderTranscript<T extends TranscriptItem>(messages: T[]): T[] {
  if (messages.length < 2) return messages;

  const sorted = messages
    .map((m, index) => ({ m, index }))
    .sort((a, b) => {
      const dt = timeMs(a.m) - timeMs(b.m);
      if (dt !== 0) return dt;
      const dr = roleRank(a.m.role) - roleRank(b.m.role);
      if (dr !== 0) return dr;
      return a.index - b.index;
    })
    .map(({ m }) => m);

  return repairInvertedTurns(sorted);
}
