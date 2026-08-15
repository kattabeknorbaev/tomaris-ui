import assert from "node:assert/strict";
import { test } from "node:test";
import { orderTranscript } from "./message-order.ts";

type Msg = { id: string; role: "user" | "assistant"; timestamp: string };

function msg(
  id: string,
  role: Msg["role"],
  timestamp: string
): Msg {
  return { id, role, timestamp };
}

test("already chronological user→assistant stays in place", () => {
  const input = [
    msg("u1", "user", "2026-08-15T10:00:00.000Z"),
    msg("a1", "assistant", "2026-08-15T10:00:00.200Z"),
    msg("u2", "user", "2026-08-15T10:01:00.000Z"),
    msg("a2", "assistant", "2026-08-15T10:01:00.200Z"),
  ];
  assert.deepEqual(
    orderTranscript(input).map((m) => m.id),
    ["u1", "a1", "u2", "a2"]
  );
});

test("raced createdAt (assistant insert won) swaps pairs, not the whole history", () => {
  // Same shape as the live bug: assistant above its prompt, later turn still last.
  const input = [
    msg("a1", "assistant", "2026-08-15T10:00:00.050Z"),
    msg("u1", "user", "2026-08-15T10:00:00.150Z"),
    msg("a2", "assistant", "2026-08-15T10:01:00.050Z"),
    msg("u2", "user", "2026-08-15T10:01:00.150Z"),
  ];
  assert.deepEqual(
    orderTranscript(input).map((m) => m.id),
    ["u1", "a1", "u2", "a2"]
  );
});

test("fully reversed array is restored to oldest-first user→assistant", () => {
  const input = [
    msg("a2", "assistant", "2026-08-15T10:01:00.200Z"),
    msg("u2", "user", "2026-08-15T10:01:00.000Z"),
    msg("a1", "assistant", "2026-08-15T10:00:00.200Z"),
    msg("u1", "user", "2026-08-15T10:00:00.000Z"),
  ];
  assert.deepEqual(
    orderTranscript(input).map((m) => m.id),
    ["u1", "a1", "u2", "a2"]
  );
});

test("equal timestamps put the user before the assistant", () => {
  const t = "2026-08-15T10:00:00.000Z";
  const input = [msg("a1", "assistant", t), msg("u1", "user", t)];
  assert.deepEqual(
    orderTranscript(input).map((m) => m.id),
    ["u1", "a1"]
  );
});

test("streaming assistant placeholder stays last", () => {
  const input = [
    msg("u1", "user", "2026-08-15T10:00:00.000Z"),
    msg("a1", "assistant", "2026-08-15T10:00:00.010Z"),
  ];
  assert.deepEqual(
    orderTranscript(input).map((m) => m.id),
    ["u1", "a1"]
  );
});

test("empty and single-message lists are unchanged", () => {
  assert.deepEqual(orderTranscript([]), []);
  const one = [msg("u1", "user", "2026-08-15T10:00:00.000Z")];
  assert.equal(orderTranscript(one)[0]?.id, "u1");
});
