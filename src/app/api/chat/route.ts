import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { rateLimit, tooManyRequests } from "@/lib/rate-limit";

const VAST_API_URL = process.env.VAST_API_URL || "http://localhost:8000";
const MODEL_NAME = process.env.SERVED_MODEL_NAME || "tomaris";

// Guardrails: this endpoint burns GPU time, so cap what one request can ask.
const MAX_MESSAGES = 40;
const MAX_MESSAGE_CHARS = 40_000;

export const maxDuration = 60;

// Lightweight health check — hits /v1/models instead of running a generation.
export async function GET() {
  try {
    const res = await fetch(`${VAST_API_URL}/v1/models`, {
      signal: AbortSignal.timeout(5000),
      cache: "no-store",
    });
    return Response.json({ ok: res.ok }, { status: res.ok ? 200 : 502 });
  } catch {
    return Response.json({ ok: false }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  try {
    // GPU inference is for signed-in users only — the app gates the UI, and
    // this gates the API itself against direct anonymous calls.
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Cap GPU usage per account: 30 generations/minute is generous for a human,
    // stops a script from hammering the model server.
    const limit = rateLimit(`chat:${session.user.id}`, 30, 60_000);
    if (!limit.ok) return tooManyRequests(limit.retryAfter);

    const { messages: rawMessages } = await req.json();

    if (!rawMessages || !Array.isArray(rawMessages) || rawMessages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    if (
      rawMessages.length > MAX_MESSAGES ||
      rawMessages.some(
        (m) => typeof m?.content !== "string" || m.content.length > MAX_MESSAGE_CHARS
      )
    ) {
      return new Response(JSON.stringify({ error: "Request too large" }), {
        status: 413,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Whitelist to {role, content} and only user/assistant roles — never trust
    // the client to inject extra `system` turns or arbitrary fields upstream.
    const messages = rawMessages.map((m) => ({
      role: m.role === "assistant" ? "assistant" : "user",
      content: m.content as string,
    }));

    const systemPrompt: Record<string, string> = {
      role: "system",
      content:
        "Siz Tomaris — O'zbek tili va madaniyati uchun yaratilgan sun'iy intellekt yordamchisisiz. " +
        "Siz 27 milliard parametrli model bo'lib, o'zbek, ingliz va rus tillarida erkin muloqot qila olasiz. " +
        "Foydalanuvchining tilida javob bering. Aniq, foydali va hurmatli bo'ling. " +
        "You are Tomaris — an AI assistant built for Uzbek language, culture, and context. " +
        "You are a 27-billion parameter model fluent in Uzbek, English, and Russian. " +
        "Respond in the user's language. Be accurate, helpful, and respectful.",
    };

    const body = JSON.stringify({
      model: MODEL_NAME,
      messages: [systemPrompt, ...messages],
      stream: true,
      max_tokens: 4096,
      temperature: 0.7,
      top_p: 0.9,
      chat_template_kwargs: { enable_thinking: true },
    });

    const response = await fetch(`${VAST_API_URL}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Vast.ai error:", response.status, errorText);
      return new Response(
        JSON.stringify({
          error: "Model server error",
          detail: `Status ${response.status}: ${errorText.slice(0, 200)}`,
        }),
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("API route error:", message);
    return new Response(
      JSON.stringify({ error: "Internal server error", detail: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}