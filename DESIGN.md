---
version: 2.0
name: Tomaris Design System
description: The chat app's visual language, kept in step with tomaris.ai. Near-black ground, monochrome surfaces, white pill actions, frosted panels and mono labels.
---

# Tomaris Design System

The chat app (chat.tomaris.ai) and the landing page (tomaris.ai) should feel
like one product. When they disagree, the landing page wins.

Tokens live in `src/app/globals.css`. Component recipes are plain classes in
the same file (`.t-btn-primary`, `.t-panel`, ...), so a change there updates
every surface at once.

## Principles

- **Monochrome first.** Hierarchy comes from light, not hue. White is the
  action colour; green is a *state* (available, approved, saved), never a fill.
- **Quiet ground, lit objects.** A near-black canvas with a faint girih
  lattice; panels catch a 1px top highlight like glass.
- **Labels in mono.** Speaker names, section titles and metadata use IBM Plex
  Mono, uppercase and tracked. Everything you read is Inter.
- **Calm motion.** Short state changes (~140ms), slow decorative loops, and
  everything respects `prefers-reduced-motion`.

## Colour

Dark is the primary theme. Light mirrors it with the same roles.

| Token        | Dark      | Light     | Role                                  |
| ------------ | --------- | --------- | ------------------------------------- |
| `canvas`     | `#050607` | `#f6f6f4` | Page ground                           |
| `surface-1`  | `#0f1011` | `#ffffff` | Panels, code blocks                   |
| `surface-2`  | `#131415` | `#f1f1ef` | Inputs, cards                         |
| `surface-3`  | `#18191b` | `#eaeae7` | Raised chips, secondary buttons       |
| `surface-4`  | `#1c1e20` | `#e2e2df` | Hover on raised elements              |
| `ink`        | `#f7f8f8` | `#0a0b0c` | Primary text, primary action fill     |
| `body`       | `#d0d6e0` | `#3d424a` | Long-form text (assistant answers)    |
| `mute`       | `#8a8f98` | `#6b7079` | Secondary text, labels, placeholders  |
| `hairline`   | ink at 8% | ink at 9% | Borders                               |
| `success`    | `#208057` | `#1c7a52` | State: available, approved, on        |
| `warning`    | `#b58a4a` | `#9a6f2e` | State: degraded, handoff              |
| `error`      | `#c97b7b` | `#b5534f` | Destructive actions, errors           |

Tints are always derived from `ink` (`bg-ink/[0.06]`, `border-ink/10`), so
they flip correctly between themes.

The page ground adds two soft radial lights: white from the top centre and a
faint green from the upper right.

## Typography

| Use              | Font          | Size                 | Weight | Tracking  |
| ---------------- | ------------- | -------------------- | ------ | --------- |
| Display / hero   | Inter         | clamp(34px, 4.6vw, 52px) | 600 | -0.034em |
| Page title       | Inter         | clamp(28px, 3vw, 36px) | 600  | -0.03em   |
| Body             | Inter         | 15px                 | 400    | -0.006em  |
| UI text          | Inter         | 13–14px              | 400    | -0.022em  |
| Label            | IBM Plex Mono | 11px, uppercase      | 400    | 0.08em    |
| Code             | IBM Plex Mono | 13px                 | 400    | 0         |

## Shape

| Token            | Value  | Use                              |
| ---------------- | ------ | -------------------------------- |
| `radius-control` | 8px    | Inputs                           |
| `radius-panel`   | 10px   | Bubbles, code blocks, list rows  |
| `radius-frame`   | 14px   | Cards                            |
| 16–22px          |        | Sidebar panel, composer          |
| pill             | 9999px | Buttons, chips, segmented controls |

## Components

| Class             | What it is                                                        |
| ----------------- | ----------------------------------------------------------------- |
| `.t-btn-primary`  | White pill, dark text, inset top highlight. One per view.         |
| `.t-btn-secondary`| Dark glass pill with hairline ring.                               |
| `.t-icon-btn`     | Round, muted icon button; brightens on hover.                     |
| `.t-panel`        | Frosted floating panel (sidebar, composer, nav bar, dialogs).     |
| `.t-card`         | Glass card for grouped content (settings sections, auth form).    |
| `.t-input`        | Text field on `surface-2` with a soft focus ring.                 |
| `.t-label`        | Mono uppercase label.                                             |
| `.t-chip`         | Small outlined pill for tags and status.                          |
| `.t-segmented`    | EN / UZ / RU style segmented control.                             |
| `.t-avatar`       | 28px round avatar; the assistant shows the khatam mark.           |
| `.t-row`          | Sidebar / list row with hover and `data-active` states.           |
| `.t-dot`          | Green "available" dot with a soft halo.                           |

### Chat specifics

- **User message:** right-aligned bubble, ink at 9% with a 4px top-right corner.
- **Assistant message:** unboxed text in `body` colour under a `TOMARIS` label
  and the mark avatar.
- **Sources:** raised chips with a green dot, linking to lex.uz where available.
- **Composer:** frosted panel, attach button on the left, white round send
  button on the right.

## Brand

The khatam mark is `TomarisMark` in `src/components/shared/tomaris-mark.tsx`
and inherits `currentColor`. Pair it with the uppercase `TOMARIS` wordmark
(`TomarisLockup`). The hero's construction figure (`GirihFigure`) and the
lattice background (`GirihGround`) are the only decorative graphics.

## Don't

- Don't use colour for emphasis; use weight or `ink` vs `mute`.
- Don't add drop shadows to cards. Panels get the top highlight; floating
  panels get one soft shadow.
- Don't put more than one white pill in a view's primary area.
