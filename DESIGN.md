---
version: 1.0
name: Tomaris Design System
description: The definitive design system for Tomaris — the foundational AI platform for Uzbekistan and Central Asia. Dark-first, emerald-accented, precision-engineered.
---

## Design Philosophy

Tomaris is not an AI chatbot. Tomaris is the foundational AI platform for Uzbekistan and Central Asia.

Every pixel must feel intentional. Nothing generic. Nothing cluttered. Nothing accidental.

The experience must feel: smooth, premium, powerful, effortless.

Benchmark quality against: Claude's calm intelligence, Linear's precision, Stripe's polish, Vercel's engineering excellence.

---

## Color Palette

### Brand & Accent

| Token | Hex | Role |
|---|---|---|
| `primary` | `#0F8F6F` | Deep Emerald — single brand accent. CTAs, status pills, active indicators, logo. |
| `primary-soft` | `#12b88a` | Lighter emerald for hover states, ghost buttons, focus rings. |
| `primary-deep` | `#0a6b52` | Darker emerald for pressed states. |
| `on-primary` | `#ffffff` | Text on emerald surfaces. |
| `accent` | `#C7A96B` | Soft Gold — secondary accent. Used sparingly for ratings, highlights, decorative moments. |

### Surface (Dark Mode — Primary)

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#09090b` | Page background. Near-black, edge-to-edge. |
| `canvas-soft` | `#111113` | Elevated surfaces — code blocks, inputs, sidebar. |
| `surface-2` | `#1a1a1e` | Card backgrounds, dropdown menus. |
| `surface-3` | `#222228` | Hover states on cards. |
| `hairline` | `#27272a` | 1px borders — the brand's elevation system. |
| `hairline-soft` | `#3f3f46` | Subtle dividers, disabled borders. |

### Surface (Light Mode — Secondary)

| Token | Hex | Role |
|---|---|---|
| `canvas` | `#fafafa` | Page background. |
| `canvas-soft` | `#ffffff` | Elevated surfaces. |
| `surface-2` | `#f4f4f5` | Card backgrounds. |
| `surface-3` | `#e4e4e7` | Hover states. |
| `hairline` | `#e4e4e7` | 1px borders. |
| `hairline-soft` | `#d4d4d8` | Subtle dividers. |

### Text

| Token | Hex (dark) | Hex (light) | Role |
|---|---|---|---|
| `ink` | `#fafafa` | `#09090b` | Default text. |
| `ink-strong` | `#ffffff` | `#000000` | Hero headlines, high-emphasis. |
| `body` | `#a1a1aa` | `#71717a` | Secondary text, body paragraphs. |
| `mute` | `#71717a` | `#a1a1aa` | Captions, fine print, lowest priority. |

### Semantic

| Token | Hex | Role |
|---|---|---|
| `success` | `#22c55e` | Success states. |
| `error` | `#ef4444` | Error states. |
| `warning` | `#f59e0b` | Warning states. |
| `info` | `#3b82f6` | Informational states. |

---

## Typography

### Font Stack

- **Primary:** Inter, system-ui, -apple-system, sans-serif
- **Mono:** Geist Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `display` | 56px | 700 | 1.05 | -0.035em | Hero headline (landing only). |
| `heading-1` | 40px | 700 | 1.1 | -0.03em | Section headlines. |
| `heading-2` | 28px | 600 | 1.2 | -0.025em | Sub-section headlines, card titles. |
| `heading-3` | 20px | 600 | 1.3 | -0.02em | Card titles in dense grids. |
| `eyebrow` | 13px | 600 | 1.4 | 0.1em | UPPERCASE labels above headlines. |
| `body-lg` | 18px | 400 | 1.6 | -0.01em | Lead paragraphs. |
| `body` | 16px | 400 | 1.6 | -0.01em | Default body. |
| `body-sm` | 14px | 400 | 1.5 | 0 | Secondary body, UI labels. |
| `caption` | 12px | 400 | 1.4 | 0 | Fine print, timestamps. |
| `code` | 13px | 400 | 1.6 | 0 | Code blocks, inline code. |

### Rules

- Inter for all narrative text. Geist Mono for code, commands, metrics.
- Eyebrow labels: uppercase, tracked (0.1em), emerald colored.
- Hero display at weight 700 — not light. Bold and confident.
- Body text at 16px minimum. Never smaller in content areas.
- Generous line-height (1.6 for body). Text must feel breathable.

---

## Spacing

Base unit: 4px. Grid: 8px.

| Token | Value |
|---|---|
| `xxs` | 2px |
| `xs` | 4px |
| `sm` | 8px |
| `md` | 12px |
| `lg` | 16px |
| `xl` | 20px |
| `2xl` | 24px |
| `3xl` | 32px |
| `4xl` | 40px |
| `5xl` | 48px |
| `6xl` | 64px |

### Rules

- Section padding: 64px top/bottom (desktop), 48px (mobile).
- Card interior: 24px padding.
- Content max-width: 1200px centered.
- Generous whitespace. Never cramped.

---

## Layout

### Content Widths

| Name | Width |
|---|---|
| `sm` | 640px |
| `md` | 960px |
| `lg` | 1200px |
| `xl` | 1440px |

### Breakpoints

| Name | Width | Changes |
|---|---|---|
| Mobile | < 768px | Single column, hamburger nav, 32px hero text. |
| Tablet | 768–1023px | 2-column cards, nav stays horizontal. |
| Desktop | ≥ 1024px | Full layout, 3-column cards. |

---

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No shadow, no border. | Full-bleed sections. |
| 1 — Hairline | 1px solid `hairline`. | Default cards, buttons, inputs. |
| 2 — Subtle | 1px `hairline` + `0 4px 12px rgba(0,0,0,0.08)`. | Hover cards, dropdowns. |
| 3 — Elevated | 1px `hairline` + `0 8px 24px rgba(0,0,0,0.12)`. | Modals, popovers. |

### Rules

- Hairlines are the primary elevation system. Not shadows.
- No heavy drop shadows. Ever.
- Featured/active elements: 2px solid `primary` border.

---

## Shapes

| Token | Value | Use |
|---|---|---|
| `none` | 0px | Full-bleed sections. |
| `xs` | 4px | Inline code chips, small pills. |
| `sm` | 6px | Buttons, inputs. |
| `md` | 8px | Cards, code blocks. |
| `lg` | 12px | Large cards, modals. |
| `pill` | 9999px | Status tags, badges. |

---

## Components

### Buttons

**Primary** — emerald CTA.
- Background: `primary`, text: `on-primary`, radius: `sm` (6px), padding: `12px 20px`, font: `body-sm` weight 600.
- Hover: `primary-deep`, subtle lift (translateY -1px).
- Active: scale 0.98.
- Disabled: opacity 0.5, no pointer events.

**Secondary** — hairline outline.
- Background: transparent, text: `ink`, border: 1px `hairline`, radius: `sm`, same padding.
- Hover: `surface-2` background.

**Ghost** — minimal.
- Background: transparent, text: `primary-soft`, no border.
- Hover: `primary/10` background.

**Danger** — destructive action.
- Background: `error`, text: white.
- Hover: darker red.

### Cards

- Background: `canvas-soft` (dark) / `white` (light).
- Border: 1px solid `hairline`.
- Radius: `md` (8px).
- Padding: 24px.
- No shadow by default.
- Hover: border color lightens to `hairline-soft`.
- Featured: 2px solid `primary` border.

### Inputs

- Background: `canvas-soft`.
- Border: 1px solid `hairline`.
- Radius: `sm` (6px).
- Padding: `12px 16px`.
- Font: `body-sm`.
- Focus: border color `primary`, ring: `primary/20`.
- Placeholder: `mute` color.

### Navigation (Navbar)

- Background: `canvas` with `backdrop-blur-xl`.
- Height: 56px.
- Border-bottom: 1px `hairline`.
- Links: `body` color, `body-sm` font.
- Link hover: `ink` color.
- Active link: `ink` color, `primary` underline dot.

### Sidebar (Chat)

- Width: 260px.
- Background: `canvas-soft`.
- Border-right: 1px `hairline`.
- Chat items: `body-sm`, `body` color.
- Active item: `surface-2` background, `ink` color.
- Hover: `surface-2` background.

### Messages (Chat)

- User: right-aligned, `primary/10` background, rounded `md` with `br-sm`.
- AI: left-aligned, no background (just text), avatar `T` in `primary` square.
- Actions: `opacity-0 group-hover:opacity-100` on desktop, always visible on mobile.
- Code blocks: `canvas-soft` background, `hairline` border, `code` font.

---

## Animation

### Principles

- Duration: 150ms for micro-interactions, 200-300ms for transitions.
- Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` — smooth, not bouncy.
- No flashy motion. No slow animations. No distracting effects.

### Allowed

- Fade (opacity).
- Slide (translateY, max 16px).
- Scale (max 0.98-1.02).
- Color transitions.
- Border transitions.

### Forbidden

- Rotations.
- Bounce springs.
- Long entrance animations (>300ms).
- Particle effects.
- Canvas animations on main content.

---

## Do's and Don'ts

### Do

- Reserve `primary` (#0F8F6F) for CTAs, active states, status indicators, and the logo.
- Use `canvas` (#09090b) as the only page surface in dark mode.
- Build cards with 1px `hairline` borders, not shadows.
- Pair Inter with Geist Mono for code and metrics.
- Use `eyebrow` style (uppercase, tracked, emerald) for section labels.
- Keep animations under 300ms.
- Support both dark and light mode.

### Don't

- Don't use `primary` as body text fill. It's CTA-only.
- Don't add heavy drop shadows to cards. Hairlines are the elevation system.
- Don't render hero headlines in light weight. Bold and confident.
- Don't use generic AI gradients or glassmorphism.
- Don't add particle effects or canvas animations to the main UI.
- Don't use animation durations over 300ms.
- Don't cram content. Generous whitespace is mandatory.

---

## Emotional Target

First impression: "This feels premium."
After 30 seconds: "This is incredibly polished."
After usage: "This is smarter than expected."

If any screen doesn't hit these marks — improve it before shipping.
