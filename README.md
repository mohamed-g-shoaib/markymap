# Markymap

![Markymap banner](public/marketing-image.jpg)

Markymap is a high-performance web application that converts Markdown into beautiful, interactive mindmaps instantly. Write in Markdown on the left, visualize your thoughts dynamically on the right, and never lose your work.

This repository is a cloud-ready Next.js application built with Coss UI, Markmap, and the Next.js App Router.

## What it does

Markymap is designed for frictionless, visual note-taking and brainstorming:

- Live Markdown editor with real-time SVG mindmap rendering
- Auto-saving to `localStorage` (work is never lost, no login required)
- Interactive features (zoom, pan, collapse/expand branches)
- Import/Export `.md` files to share or continue working later
- Built-in theme toggling with keyboard shortcuts
- High-performance, Web Audio API sound design for clicks and actions

## Current routes

Public marketing routes:

- `/` marketing homepage with live hero demo

App routes:

- `/playground` the core mindmap editor

## Tech stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS v4
- Coss UI on top of Base UI
- Markmap (`markmap-lib` and `markmap-view`)
- Hugeicons
- Web Audio API
- Oxlint and Oxfmt

## Design system

The app uses Coss UI components in `components/ui`. Treat that layer as owned design-system code:

- compose on top of it
- do not casually restyle or rewrite it
- preserve its token system, borders, rings, and layering approach

## SEO and metadata

The project is fully optimized for SEO and social sharing:

- root metadata in `app/layout.tsx`
- marketing metadata in `app/(marketing)/page.tsx`
- playground metadata in `app/(playground)/playground/page.tsx`
- generated `robots.txt` via `app/robots.ts`
- generated `sitemap.xml` via `app/sitemap.ts`
- dynamic Open Graph and Twitter images via `app/opengraph-image.tsx` and `app/(playground)/playground/opengraph-image.tsx`
- explicit `twitter-image.tsx` files for Twitter card support

## Local development

Install dependencies and start the app:

```bash
pnpm install
pnpm dev
```

## Environment variables

Create a local env file (`.env.local`) with the variables the app expects:

```env
# Your domain for SEO (Used in og-image, twitter-image, and sitemap)
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Optional: Disable UI sound effects
NEXT_PUBLIC_SOUNDS_ENABLED=true
```

## Scripts

```bash
pnpm dev
pnpm build
pnpm start
pnpm typecheck
pnpm lint
pnpm fmt
```

## Tooling

### Oxlint

Markymap uses Oxlint for lightning-fast linting.
Note: `components/ui/` is excluded from linting to preserve upstream compatibility with Coss UI.

```bash
pnpm lint
```

### Oxfmt

Markymap uses Oxfmt for consistent code formatting.

```bash
pnpm fmt
pnpm fmt:check
```

## Audio system

The app uses the Web Audio API for high-performance sound:

- Sounds are pre-decoded and cached
- Global click sounds are delegated from `ThemeProvider`
- To customize, encode audio to base64, add to `lib/audio/`, and import in `components/theme-provider.tsx`

## Project references

Developer documentation and project context live in:

- `AGENTS.md` (Quick reference for AI agents and onboarding)
- `spec/context.md` (Project memory and architecture)
- `spec/skills.md` (Agent skill routing)

When docs and code disagree, the actual codebase should be treated as the current source of truth.
