import { NextRequest } from "next/server";

const VAST_API_URL = process.env.VAST_API_URL || "http://localhost:8000";
const MODEL_NAME = process.env.SERVED_MODEL_NAME || "tomaris";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

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