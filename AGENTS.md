# AGENTS Quick Guide

Read this file first for fast project orientation. Use `spec/context.md` for deeper historical context.

## Project At A Glance

Markymap is a Next.js App Router app that converts Markdown into interactive mindmaps.

Current product surface:

- `/` marketing page with hero + live markmap demo
- `/playground` editor route with markdown input + live map
- localStorage persistence and import/export/reset in the editor
- theme + interaction sounds wired in `components/theme-provider.tsx`

## Core Stack

- Next.js 16 (App Router)
- React 19
- TypeScript strict mode
- Tailwind CSS v4
- coss ui components (Base UI based) in `components/ui/`
- Markmap via `markmap-lib` and `markmap-view`
- pnpm package manager
- Oxlint + Oxfmt

## Important Paths

- `app/(marketing)/` marketing route
- `app/(playground)/playground/` playground route
- `components/editor/` editor feature components
- `components/theme-provider.tsx` theme + click/theme sound behavior
- `app/globals.css` design tokens and shared motion/utilities
- `lib/audio/` sound engine and sound assets
- `spec/context.md` ongoing implementation memory
- `spec/skills.md` skill index for agent task routing

## Non-Negotiables

- Prefer Server Components; add `"use client"` only where needed.
- Do not use inline styles (`style={{}}`).
- Use `cn()` from `lib/utils.ts` for class merging.
- Do not recreate components that already exist in `components/ui/`.
- Treat `components/ui/` as upstream coss snapshots unless explicitly asked to modify.
- Use App Router APIs (`next/navigation`), never `next/router`.
- Use `next/image` instead of raw `<img>` for raster images.

## Lint/Format Policy

- `components/ui/` is excluded from lint to preserve upstream parity.
- Keep app/editor/feature code lint-clean.
- Formatting is handled by `pnpm fmt` and checked by `pnpm fmt:check`.

## Daily Commands

- Dev: `pnpm dev`
- Build: `pnpm build`
- Typecheck: `pnpm typecheck`
- Lint: `pnpm lint`
- Format: `pnpm fmt`
- Format check: `pnpm fmt:check`

## Agent Workflow

Before implementing:

- Read this file
- Read `spec/context.md`
- Load relevant skills from `spec/skills.md`

After significant changes:

- Update `spec/context.md` with a short session entry
- Re-run validation commands relevant to the change
