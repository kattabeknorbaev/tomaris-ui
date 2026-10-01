<p align="center">
  <a href="https://tomaris.ai">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="public/brand/mark-dark.svg">
      <img src="public/brand/mark-light.svg" alt="Tomaris" width="64" height="64">
    </picture>
  </a>
</p>

<h1 align="center">Tomaris</h1>

<p align="center">
  Sovereign AI for Uzbekistan.<br>
  The web app behind <a href="https://chat.tomaris.ai">chat.tomaris.ai</a>.
</p>

<p align="center">
  <a href="https://tomaris.ai">Website</a> ·
  <a href="https://chat.tomaris.ai">Open the chat</a>
</p>

---

## Overview

Tomaris answers in Uzbek, Russian and English. Legal answers are grounded in a
curated corpus of Uzbek statutes, and cited articles link to their source on
[lex.uz](https://lex.uz).

This repository contains the chat application:

- **Chat** with streaming answers, an optional reasoning view, and cited sources
- **Attachments**: PDFs, text and code files, plus OCR for photos of documents
  (Uzbek Latin and Cyrillic, Russian, English), all read in the browser
- **Accounts** with email one-time-code sign-in and optional Google sign-in;
  chat history syncs to the account
- **Workspace tools**: search, rename and export chats, keyboard shortcuts,
  and in-app feedback
- **Three languages**: interface in English, O'zbek and Русский; dark and light themes
- **Admin dashboard** for usage and feedback

## Tech stack

| Area      | Choice                                           |
| --------- | ------------------------------------------------ |
| Framework | Next.js 16 (App Router), React 19, TypeScript    |
| Styling   | Tailwind CSS v4, Base UI primitives, Framer Motion |
| Data      | Neon serverless Postgres, Drizzle ORM            |
| Auth      | Better Auth (email OTP, Google OAuth)            |
| Email     | Resend                                           |
| State     | Zustand                                          |
| Inference | OpenAI-compatible streaming API (`/v1/chat/completions`) |

## Getting started

Requires Node.js 20+.

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:push              # create the database tables
npm run dev
```

Open [http://localhost:3000/app](http://localhost:3000/app). Without a model
server configured in `VAST_API_URL`, the chat loads but reports that the model
is unreachable instead of answering.

All environment variables are documented in [`.env.example`](.env.example).

## Scripts

| Command             | Description                        |
| ------------------- | ---------------------------------- |
| `npm run dev`       | Start the dev server               |
| `npm run build`     | Production build                   |
| `npm run start`     | Serve the production build         |
| `npm run lint`      | Lint with ESLint                   |
| `npm test`          | Run unit tests                     |
| `npm run db:push`   | Push the Drizzle schema to the database |
| `npm run db:studio` | Open Drizzle Studio                |

## Project structure

```
src/
  app/
    (app)/          chat, settings and profile (signed-in only)
    (auth)/         login and signup
    (marketing)/    marketing pages
    admin/          admin dashboard
    api/            chat proxy, chat history, auth, feedback
  components/
    chat/           sidebar, composer, messages
    shared/         i18n, theme, dialogs, brand mark
    ui/             primitives
  lib/              auth, database, i18n, file extraction
  stores/           client chat store
```

The visual language (palette, type, components) is described in
[`DESIGN.md`](DESIGN.md).
