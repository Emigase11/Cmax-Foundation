# CMAX Foundation website

Next.js 16 App Router + Tailwind v4 + Keystatic. Read `README.md` for routes and content workflow, `PRODUCT.md` for product truth, `DESIGN.md` for the visual system.

## Working rules

- Public solution names are **Cmax Med** and **AeroCabin™** only. Never add "HD", "X2", "SD" or other variants to public copy.
- Never publish figures, deliveries, capacities or results without a source in the content record. Empty fields render as "pending" notes on purpose.
- Every image in content carries an `illustrative` flag; renders must be flagged.
- Videos play on demand only. The one exception is a silent decorative backdrop
  behind a heading (`components/background-video.tsx`): it carries no information,
  so it is muted, looped, `aria-hidden`, paused off-screen, and never loads or
  plays for a visitor who asked for reduced motion, who sees the poster instead.
  Backdrops are built with `npm run video:prepare`, which strips the audio and
  compresses to a few MB; never ship a source file straight to `public/video`.
- People appear on the site only when `verified: true` in `content/people/*.yaml`.
- `lib/labels.ts` is client-safe; `lib/content.ts` reads files and must stay server-only (never import it from a `"use client"` component).
- `@markdoc/markdoc` is pinned to the version nested under `@keystatic/core`; keep them equal or the body types break.
- YAML values containing `: ` must be quoted in `content/**`.
- Commands: `npm run dev` (site + `/keystatic`), `npm run build`, `npx tsc --noEmit`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
