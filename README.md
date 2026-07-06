# Tomaris UI

Web platform for **Tomaris** — a 27B-parameter LLM natively optimized for Uzbek language, culture, and context. Marketing site + chat application with streaming responses and reasoning display, in three languages (UZ / EN / RU).

## Stack

- **Next.js 16** (App Router) · React 19 · TypeScript
- **Tailwind CSS v4** — design tokens defined in `src/app/globals.css`, spec in `DESIGN.md`
- **@base-ui/react** primitives (`src/components/ui/`)
- **Zustand** (persisted) for chat state
- Custom cookie-based i18n (`src/lib/i18n.ts`)

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in VAST_API_URL
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The chat lives at `/app`.

## Model backend

The chat proxies to an OpenAI-compatible vLLM server (`src/app/api/chat/route.ts`):

- `VAST_API_URL` — host:port of the running vLLM instance (Vast.ai). **This IP changes when the instance restarts** — update it in Vercel env vars too.
- `SERVED_MODEL_NAME` — defaults to `tomaris`.

See `vast-setup.sh` for the inference server setup. If the model server is unreachable, the chat falls back to demo responses and shows a banner.

> ⚠️ The streaming parser accepts both `delta.reasoning` and `delta.reasoning_content` — different vLLM builds emit different field names. Keep both.

## Deployment

Deployed on Vercel from the `main` branch. Only `VAST_API_URL` and `SERVED_MODEL_NAME` need to be set as environment variables.
