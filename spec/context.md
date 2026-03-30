# Project Context

> **This file is the persistent working-memory document for this repository.**
> Read it at the start of every session before touching any code. Update it after every significant task, decision, or discovery. It is the single most important file for maintaining quality across long conversations and resumed sessions.

> **Last updated:** After Session 21 — added comprehensive markmap full-functionality spec.

---

## Project Purpose

**Markymap** is a modern, high-performance mindmap creation and editing application. It takes Markdown as input and renders it as an interactive, zoomable, pannable mindmap using `markmap-lib` (transform) and `markmap-view` (SVG renderer).

### What Makes It Different

The existing markmap ecosystem has three critical gaps that Markymap closes:

1. **Persistence** — prior tools lose your work on refresh. Markymap auto-saves to `localStorage` so progress is never lost.
2. **Import / Export** — prior tools had no way to save your work and come back later. Markymap lets users export their map and re-import it, enabling an edit-save-reload workflow.
3. **Built-in AI** — an integrated AI assistant can generate new markmaps from a prompt, enhance existing ones, or suggest new branches and ideas.

Additional UX polish layers: dark/light mode (keyboard-toggled, with theme sounds), per-click interaction sounds, and a design philosophy borrowed from the best design engineers in the field (Emil, Dimi).

---

## Current Reality

### What Exists Today (Lean Landing + Active Editor Shell)

The project has moved past scaffold-only status. Core infrastructure is complete, and the current UI baseline includes a lean marketing route and a functional editor shell.

**Infrastructure / DX — DONE:**

- Next.js 16.2.1 App Router with Turbopack dev server
- React 19.2.4 + TypeScript 6 in strict mode
- Tailwind CSS v4 with full design token system in `app/globals.css`
- coss ui component library installed (`components/ui/` — 51 components ready)
- `next-themes` for dark/light mode with `attribute="class"` strategy
- Web Audio sound engine (`lib/audio/sound-engine.ts`) with singleton `AudioContext`, buffer caching, decode-once pattern
- `useSound` hook (`hooks/use-sound.ts`) — full-featured: play/stop/pause, interrupt, volume, playbackRate, lifecycle callbacks
- `useHoverCapability` hook (`hooks/use-hover-capability.ts`) — `useSyncExternalStore`-based, SSR-safe
- Three sound assets (base64 data URIs): `click-soft`, `switch-on`, `switch-off`
- `ThemeProvider` (`components/theme-provider.tsx`) — mounts `<ClickSound>` and `<ThemeHotkey>`, wires up global click sounds and `d`-key theme toggle
- Custom local fonts: Google Sans Variable (`--font-sans`) + Google Sans Code Variable (`--font-mono`)
- Shared motion `@utility` classes in `globals.css`: `motion-overlay-scale`, `motion-overlay-lift-blur`, `motion-disclosure-panel`, `motion-disclosure-chevron`, `motion-surface-interaction`, `motion-interactive-color`, `motion-layout-frame`, `motion-fade`, `motion-fade-blur`
- Shared text `@utility` classes: `text-link`, `text-action`
- Global interactive element scale-on-active (`:active { scale: 0.97 }`) with `prefers-reduced-motion` guard
- Oxlint + Oxfmt configured with pre-commit hooks via `simple-git-hooks` + `lint-staged`
- `cn()` utility via `clsx` + `tailwind-merge` at `lib/utils.ts`
- `@/` path alias mapped to project root

**Infrastructure fixes completed in Session 2:**

- Replaced all `lucide-react` imports across `components/ui/` (16 files) with Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`)
- Created `hooks/use-media-query.ts` — `useSyncExternalStore`-based, SSR-safe, query-reactive
- Fixed `tsconfig.json` — added `"ignoreDeprecations": "6.0"` to silence TypeScript 6 `baseUrl` deprecation
- `react-day-picker` installed — `components/ui/calendar.tsx` fully functional, zero typecheck errors
- Researched all markmap packages, documented full API reference and React integration plan in `spec/markmap-packages/`
- **Skills audit completed** — implementation plan reviewed against `react-useeffect`, `vercel-react-best-practices`, `next-best-practices` skills; 4 violations found and corrected (see audit table below)
- Landing page wireframe spec created at `spec/landing-page/markymap-landing.md` — fully skills-audited before writing

**Package status:**

- `markmap-lib` and `markmap-view` are installed in `package.json` (`^0.18.12` each) and ready for editor/landing-demo implementation.
- `motion` (Framer Motion) is intentionally not installed for the landing page. Landing page motion uses CSS transitions + IntersectionObserver only.

**Application Features — Current vs Pending:**

- Implemented now:
  - Lean landing at `/` (`HERO` + `LIVE DEMO`)
  - Playground route at `/playground` with editor shell
  - Live markmap rendering in marketing demo and playground canvas
  - localStorage-backed content persistence and save-state UX
  - Import/export/reset actions in editor shell
- Not yet built:
  - AI integration (route handler + UI)
  - SEO layer (`robots.ts`, `sitemap.ts`, OG image generation)
  - Advanced map controls/settings beyond current baseline

---

## Source Of Truth

When you need authoritative guidance, consult these files in this order:

1. `AGENTS.md` — full project knowledge base for LLMs
2. `spec/context.md` ← **you are here** — working memory, history, decisions
3. `spec/skills.md` — skill index with summaries and file locations
4. `spec/styling.md` — coss ui color system and theming reference

---

## Core Standards

These are established and **must not be reverted or deviated from**:

| Concern             | Standard                                                                   |
| ------------------- | -------------------------------------------------------------------------- |
| **Framework**       | Next.js 16.2.1, App Router only                                            |
| **Language**        | TypeScript 6, strict mode, no `any`                                        |
| **Runtime**         | React 19.2.4                                                               |
| **Styling**         | Tailwind CSS v4 — no inline styles, no CSS Modules                         |
| **UI Components**   | coss ui only (`components/ui/`) — never recreate, never replace with Radix |
| **Icons**           | Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`)              |
| **Package Manager** | pnpm exclusively                                                           |
| **Linting**         | Oxlint (`.oxlintrc.json`)                                                  |
| **Formatting**      | Oxfmt (`.oxfmtrc.json`)                                                    |
| **File naming**     | `kebab-case` for all files and directories                                 |
| **Class merging**   | `cn()` from `@/lib/utils` — never string-concatenate Tailwind classes      |
| **Module system**   | ESM (`"type": "module"` in `package.json`)                                 |

---

## Markmap Package Knowledge

Full documentation is at `spec/markmap-packages/`:

- `spec/markmap-packages/index.md` — navigation index, relevance notes, install commands
- `spec/markmap-packages/context.md` — full API reference, React integration architecture, implementation plan

### Packages to Use

| Package        | Purpose                                                     |
| -------------- | ----------------------------------------------------------- |
| `markmap-lib`  | Transforms Markdown string → `{ root, features }` node tree |
| `markmap-view` | Renders node tree as interactive SVG via `Markmap.create()` |

### Packages to NOT Install

`markmap-render`, `markmap-autoloader`, `markmap-toolbar`, `markmap-cli`, `coc-markmap` — none of these are needed in Markymap.

### Core Rendering Pipeline

```
Markdown string
  → transformer.transform(md)           → { root, features }
  → transformer.getUsedAssets(features) → { styles, scripts }
  → loadCSS(styles) + loadJS(scripts)   → assets in <head>
  → Markmap.create(svgEl, options, root) → Markmap instance
```

### Key API Facts

- `new Transformer()` — expensive; instantiate **once at module level**, never inside a component
- `transformer.transform(md)` — pure, cheap, call on every content change
- `Markmap.create(svgEl, options, root)` — creates instance; call once on mount
- `mm.setData(root)` — updates data without destroying instance; preserves zoom/pan
- `mm.setOptions(options)` — updates options on existing instance
- `mm.fit()` — fits mindmap to SVG viewport
- `mm.destroy()` — must be called on component unmount to prevent listener leaks
- `loadCSS()` / `loadJS()` — idempotent; insert into `document.head`; safe to call on every update
- `deriveOptions(jsonOptions)` — converts serialisable JSON options to low-level `IMarkmapOptions`

### JSON Options Quick Reference

| Option               | Type       | Default             | Purpose                            |
| -------------------- | ---------- | ------------------- | ---------------------------------- |
| `color`              | `string[]` | d3.schemeCategory10 | Branch colors                      |
| `colorFreezeLevel`   | `number`   | `0`                 | Freeze color at depth              |
| `duration`           | `number`   | `500`               | Fold/unfold animation ms           |
| `maxWidth`           | `number`   | `0`                 | Max node width in px               |
| `initialExpandLevel` | `number`   | `-1`                | Depth to expand on load (-1 = all) |
| `zoom`               | `boolean`  | `true`              | Allow zoom                         |
| `pan`                | `boolean`  | `true`              | Allow pan                          |
| `spacingHorizontal`  | `number`   | `80`                | Horizontal node spacing            |
| `spacingVertical`    | `number`   | `5`                 | Vertical node spacing              |
| `lineWidth`          | `number`   | auto                | Branch stroke width                |

### Magic Comments

Inline HTML comments in Markdown that set initial fold state:

- `<!-- markmap: fold -->` — folds only that node
- `<!-- markmap: foldAll -->` — folds that node and all descendants

### SSR Safety

`markmap-lib` and `markmap-view` use browser APIs. Any file importing them **must** have `"use client"` at the top. The module-level `new Transformer()` must live inside a `"use client"` file. Never import these packages from Server Components.

### Skills Audit — 4 Violations Found and Fixed

The implementation plan in `spec/markmap-packages/context.md` was audited against the project skills. Four violations were found and corrected before implementation:

| #   | Violation                                                                                                                      | Skill                                                                    | Fix                                                                                                       |
| --- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| 1   | `eslint-disable` suppressing stale closure in mount effect — `markdown` and `jsonOptions` were closed over in a `[]` dep array | `react-useeffect` anti-patterns + `vercel-react-best-practices` rule 8.3 | `useEffectEvent` (`initMarkmap`) — reads latest values non-reactively, no suppressed warnings             |
| 2   | `style={{ width: '100%', height: '100%' }}` inline style on `<svg>` element                                                    | Project rule: `style={{}}` is forbidden                                  | Replaced with `className="size-full"` (Tailwind)                                                          |
| 3   | localStorage loaded in `useEffect` on mount — caused extra render cycle and runs twice in Strict Mode dev                      | `vercel-react-best-practices` rule 5.10 (lazy state init)                | `useState(() => loadContent() ?? DEFAULT)` lazy initializer — runs once synchronously before first render |
| 4   | Debounce timer implied as a `useEffect` watching `markdown`                                                                    | `vercel-react-best-practices` rule 5.12 (`useRef` for transient values)  | `useRef` for timer ID, debounce fires directly inside `onChange` handler — no watching effect             |

### `useEffectEvent` Pattern — Canonical for Markymap

`React.useEffectEvent` is the correct answer whenever a mount-only effect needs to read reactive values without re-triggering. It is already used in `components/theme-provider.tsx`. It must be used in `markmap-canvas.tsx` for the `initMarkmap` call. Never use `eslint-disable` on `react-hooks/exhaustive-deps` as a substitute.

---

## Icon System

### Hugeicons API Pattern

Icons are **never** imported from `lucide-react`. All icons use the two-package Hugeicons setup:

```
import { HugeiconsIcon } from "@hugeicons/react"
import { SomeIconName } from "@hugeicons/core-free-icons"

<HugeiconsIcon icon={SomeIconName} size={16} color="currentColor" className="..." />
```

### Established Icon Mapping (Lucide → Hugeicons)

| Lucide                                  | Hugeicons Export        |
| --------------------------------------- | ----------------------- |
| `ChevronDownIcon`                       | `ArrowDown01Icon`       |
| `ChevronUpIcon`                         | `ArrowUp01Icon`         |
| `ChevronLeftIcon`                       | `ArrowLeft01Icon`       |
| `ChevronRightIcon`                      | `ArrowRight01Icon`      |
| `ChevronsUpDownIcon`                    | `UnfoldMoreIcon`        |
| `XIcon`                                 | `Cancel01Icon`          |
| `SearchIcon`                            | `Search01Icon`          |
| `MoreHorizontal` / `MoreHorizontalIcon` | `MoreHorizontalIcon`    |
| `MinusIcon`                             | `MinusSignIcon`         |
| `PlusIcon`                              | `PlusSignIcon`          |
| `PanelLeftIcon`                         | `SidebarLeftIcon`       |
| `Loader2Icon` / `LoaderCircleIcon`      | `Loading03Icon`         |
| `CircleAlertIcon`                       | `AlertCircleIcon`       |
| `CircleCheckIcon`                       | `CheckmarkCircle02Icon` |
| `InfoIcon`                              | `InformationCircleIcon` |
| `TriangleAlertIcon`                     | `Alert02Icon`           |

### Icon Search Tool

The project has a Hugeicons MCP server. Use `search_icons` to find new icons. Always use the **free** pack (`@hugeicons/core-free-icons`). Default `size={16}`, `color="currentColor"`.

### Toast Icon Pattern

The `TOAST_ICONS` map in `toast.tsx` stores Hugeicons **data objects** (not React components). The render call is:

```tsx
<HugeiconsIcon icon={Icon} size={16} color="currentColor" className="..." />
```

Not `<Icon className="..." />` — that is the Lucide pattern and will not work.

---

## Tooling Decisions Already Made

### Audio System

- Web Audio API chosen over `<audio>` elements — better performance, no DOM overhead, instant playback after first decode
- Sounds are base64-encoded TypeScript modules — no network requests, no public asset serving, no latency
- `AudioContext` is a singleton — created lazily on first interaction (browser autoplay policy compliant)
- Buffer cache prevents re-decoding the same sound twice across the session

### Theme System

- `next-themes` with `attribute="class"` — adds/removes `.dark` class on `<html>`
- `suppressHydrationWarning` on `<html>` handles SSR mismatch
- `disableTransitionOnChange` prevents flash during theme switch
- `defaultTheme="system"` respects OS preference out of the box
- Custom Tailwind variant: `@custom-variant dark (&:is(.dark *))` — enables `dark:` prefix

### Interaction System

- Global click sound is mounted at the `ThemeProvider` level, listening in capture phase — this means it fires before event handlers, ensuring sound on every interaction regardless of component
- `data-click-sound="off"` is the opt-out mechanism for elements that should not trigger sounds
- Disabled elements (`:disabled`, `[aria-disabled='true']`, `[data-disabled]`) are automatically excluded

### Font Strategy

- `next/font/local` with `display: "swap"` and variable font files
- Both font variables applied to `<html>` element for full cascade
- Heading font (`--font-heading`) currently aliases `--font-sans`; separate heading weight can be added later

### Motion Philosophy

- All motion tokens (`--motion-duration-fast: 140ms`, `--motion-duration-medium: 180ms`, `--motion-duration-layout: 220ms`) live as CSS variables
- Easing curves: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)` (snappy), `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)` (deliberate)
- Every animated class has a paired `@media (prefers-reduced-motion: reduce)` block setting `transition-duration: 0ms`
- Exit animations use shorter duration (120ms) with ease-in curve — faster exits feel more responsive

---

## Current File Map

High-value files to understand before making any changes:

| File                                   | Why It Matters                                                                 |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| `app/globals.css`                      | All shared CSS, design tokens, motion utilities — the style bible              |
| `app/layout.tsx`                       | Root layout: fonts, ThemeProvider wrapper, html attributes                     |
| `app/(marketing)/page.tsx`             | Active landing route composition (currently `HERO` + `LIVE DEMO`)              |
| `app/(playground)/playground/page.tsx` | Active playground route wrapper for `EditorShell`                              |
| `components/theme-provider.tsx`        | Sound system wiring, theme hotkey, click sound delegation                      |
| `components/ui/`                       | All available UI components — check here before building anything              |
| `lib/audio/sound-engine.ts`            | Audio API: `getAudioContext()`, `decodeAudioData()`, `playSound()`             |
| `lib/audio/sound-types.ts`             | `SoundAsset`, `UseSoundOptions`, `UseSoundReturn` type definitions             |
| `hooks/use-sound.ts`                   | Sound hook — use this for all sound playback in components                     |
| `hooks/use-hover-capability.ts`        | Pointer capability detection hook                                              |
| `hooks/use-media-query.ts`             | Media query hook — `useSyncExternalStore`, SSR-safe, reactive to query changes |
| `lib/utils.ts`                         | `cn()` — always use for class merging                                          |
| `package.json`                         | Dependency reality — check here before assuming a package exists               |
| `spec/skills.md`                       | Full skill index — consult before starting any non-trivial task                |

---

## What Has Been Developed So Far

### Session 1 — Project Initialization & Infrastructure

- Created Next.js 16.2.1 project with App Router
- Installed and configured: React 19, TypeScript 6 strict, Tailwind CSS v4, coss ui, next-themes, Hugeicons, tw-animate-css
- Set up pnpm as package manager
- Configured Oxlint + Oxfmt with pre-commit hooks via simple-git-hooks + lint-staged
- Added local font assets (Google Sans Variable, Google Sans Code Variable) and wired via `next/font/local`
- Built complete Web Audio sound engine (`lib/audio/`)
- Implemented `useSound` hook and `useHoverCapability` hook
- Created `ThemeProvider` with global click sounds + theme hotkey (`d` key)
- Established full design token system and motion utility classes in `globals.css`
- Installed all 51 coss ui components into `components/ui/`
- Populated `AGENTS.md` and `spec/context.md` with full project knowledge

### Session 4 — Landing Page Wireframe Spec

- Read all design skill files in full before writing: `emil-design-eng/SKILL.md`, `make-interfaces-feel-better/` (all 5 files), `userinterface-wiki/AGENTS.md`, `coss/SKILL.md`, `spec/references/emilkowalski.md`, `spec/references/dimi.md`
- Read the Rootly project reference wireframe from `spec/landing-page/index.md` — learned patterns, did not copy
- Created `spec/landing-page/markymap-landing.md` — 800-line comprehensive wireframe spec covering:
  - All 6 sections: NAV, HERO, LIVE DEMO, HOW IT WORKS, FINAL CTA, FOOTER
  - Exact copy for every section (non-cliché: "Markdown that maps itself.")
  - CSS-only animation system (no motion library) with IntersectionObserver-based scroll reveals
  - Live markmap split-panel demo with seed content, localStorage persistence, lazy useState init
  - Horizontal scroll carousel with `useCarouselControls` hook
  - Full route and file structure
  - `PageContainer` component spec
  - `scroll-padding-top` fix for fixed nav
  - Full anti-patterns list (19 rules)
  - Skills compliance table mapping every decision to its skill source

### Session 3 — Markmap Package Research + Skills Audit

- Fetched and read all 10 pages of the official markmap.js.org documentation
- Rewrote `spec/markmap-packages/index.md` as a clean LLM-friendly navigation index with relevance notes
- Created `spec/markmap-packages/context.md` — authoritative reference covering:
  - Full `markmap-lib` Transformer API with TypeScript examples
  - Full `markmap-view` Markmap instance API with lifecycle management
  - Complete JSON Options reference with all 12 options documented
  - Magic Comments reference (`fold`, `foldAll`)
  - React integration architecture (component split, state ownership, two-effect pattern)
  - Step-by-step implementation plan (Tasks 1–9)
  - Gotchas: SSR safety, instance lifecycle, `setData` vs recreate, SVG dimension requirements
- Identified that `markmap-lib` and `markmap-view` are the only two packages needed
- Documented why all other markmap packages are skipped
- **Skills audit**: read `react-useeffect/SKILL.md`, `anti-patterns.md`, `alternatives.md`, `vercel-react-best-practices/AGENTS.md`, `next-best-practices/rsc-boundaries.md`, `next-best-practices/directives.md` in full
- Found and corrected 4 violations in the original plan before any implementation code was written:
  1. `eslint-disable` on mount effect → `useEffectEvent`
  2. Inline `style={{}}` on SVG → `className="size-full"`
  3. `useEffect` for localStorage init → lazy `useState` initializer
  4. Debounce implied via watching effect → `useRef` timer fired in `onChange` handler

### Session 2 — Icon Migration & Infrastructure Fixes

- **Replaced all `lucide-react` imports** across 16 `components/ui/` files with Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`) — zero lucide-react references remain
- Migrated icons file-by-file: accordion, autocomplete, breadcrumb, calendar, combobox, command, dialog, drawer, menu, number-field, pagination, select, sheet, sidebar, spinner, toast
- Fixed `toast.tsx` icon render pattern: changed from `<Icon className="..." />` (Lucide component pattern) to `<HugeiconsIcon icon={Icon} ... />` (Hugeicons data object pattern)
- Fixed `spinner.tsx`: rewrote component interface from `React.ComponentProps<typeof Loader2Icon>` to explicit `{ className?, size? }` props, wrapped with `HugeiconsIcon`
- Created `hooks/use-media-query.ts` — was missing, required by `sidebar.tsx`; implemented with `useSyncExternalStore` pattern matching existing hook conventions
- Fixed `tsconfig.json` — added `"ignoreDeprecations": "6.0"` for TypeScript 6 `baseUrl` deprecation
- Updated `AGENTS.md` with full project knowledge and Hugeicons MCP server documentation
- `react-day-picker` is installed → `calendar.tsx` is operational

### Session 5 — Context Sync + Package Status Update

- Re-read `AGENTS.md`, `spec/context.md`, and all files in `spec/landing-page/` + `spec/markmap-packages/` to refresh project context.
- Verified dependency reality in `package.json`: `markmap-lib` and `markmap-view` are installed at `^0.18.12`.
- Updated context/spec notes to remove stale "not yet installed" guidance.

### Session 6 — Base UI Handbook Re-Read + Route Recovery

- Re-read all files in `spec/base-ui/` and re-validated composition patterns.
- Confirmed the correct Base UI pattern is `render` composition (not Radix `asChild`).
- Audited source files for `asChild` usage and confirmed none remain in app code.
- Restored valid App Router entrypoints by adding `app/(marketing)/page.tsx` and `app/(playground)/playground/page.tsx`.
- Verified clean compile with `pnpm typecheck`.

### Session 7 — Implementation Start (Landing + Playground Foundations)

- Loaded required skills from `spec/skills.md`: `coss`, `vercel-react-best-practices`, `next-best-practices`, `vercel-composition-patterns`, and `react-useeffect`.
- Implemented foundational hooks:
  - `hooks/use-in-view.ts`
  - `hooks/use-scroll-y.ts`
  - `hooks/use-carousel-controls.ts`
- Implemented marketing UI foundation in `app/(marketing)/ui/`:
  - `page-container.tsx`, `nav.tsx`, `hero.tsx`, `demo-seed.ts`, `demo.tsx`, `how-it-works.tsx`, `final-cta.tsx`, `footer.tsx`
- Replaced placeholder root route with assembled marketing page in `app/(marketing)/page.tsx` and added metadata.
- Added playground editor foundation:
  - `lib/storage.ts`
  - `components/editor/markdown-input.tsx`
  - `components/editor/markmap-canvas.tsx`
  - `components/editor/editor-shell.tsx`
  - Wired into `app/(playground)/playground/page.tsx`
- Updated global styling in `app/globals.css`:
  - Added `scroll-padding-top`
  - Added hero enter animation utilities (`animate-hero-enter`, delay classes)
- Verification:
  - `pnpm fmt` completed successfully
  - `pnpm typecheck` completed successfully

### Session 8 — Playground Workflow Actions (Import/Export/Reset)

- Added practical editor actions in `components/editor/editor-shell.tsx`:
  - Import markdown from local files (`.md`, `text/plain`)
  - Export current markdown as `markymap.md`
  - Reset content to default playground seed
- Added save-state UX in the editor toolbar:
  - `Auto-save enabled` / `Saving...` / `Saved HH:MM` / `Local save failed`
  - Save status now reflects actual localStorage write result
- Updated `lib/storage.ts`:
  - `saveContent()` now returns a boolean success flag instead of silent void
  - Editor uses this result to surface save errors
- Validation:
  - `pnpm typecheck` completed successfully

### Session 9 — Runtime Error Fix Pass (Marketing + Markmap)

- Fixed `useSyncExternalStore` infinite loop and server snapshot warning in `hooks/use-carousel-controls.ts`:
  - Replaced object snapshots with stable numeric bitmask snapshots
  - Added immediate `onStoreChange()` call on subscribe so controls initialize correctly
- Fixed footer hydration mismatch in `app/(marketing)/ui/footer.tsx`:
  - Added mount gate and deterministic pre-mount theme fallback (`system`) for SSR/client parity
- Fixed `SVGLength` `NotSupportedError` for markmap SVG setup in:
  - `components/editor/markmap-canvas.tsx`
  - `app/(marketing)/ui/demo.tsx`
  - Added `ensureSvgSize()` and `ResizeObserver` sync to keep concrete `width`/`height` attributes before create/update
- Cleared follow-up diagnostics for Tailwind class tokens in the touched files.
- Validation:
  - `pnpm typecheck` completed successfully
  - `get_errors` returned no issues in all touched files

### Session 10 — Landing Wireframe Redesign (Spec-Level)

- Re-reviewed both landing specs:
  - `spec/landing-page/index.md` (reference project)
  - `spec/landing-page/markymap-landing.md` (Markymap)
- Confirmed structural similarity was too high (hero rhythm and how-it-works interaction grammar).
- Replaced `spec/landing-page/markymap-landing.md` with a distinct Markymap-first wireframe:
  - New hero direction: asymmetric thesis + branch ledger panel
  - New how-it-works direction: pipeline rail + sticky stage (no carousel)
  - Added trust-strip section and adjusted final CTA semantics
  - Added explicit wide marketing canvas strategy (up to 1800px)
  - Added explicit full-bleed playground requirement (no max-width shell)
- Added acceptance checklist and explicit non-goals to prevent regression into template-like structure.

### Session 11 — Landing Redesign Implementation (UI Pass)

- Implemented redesigned marketing structure in code:
  - Added wide/measure variants in `app/(marketing)/ui/page-container.tsx` (wide defaults to `max-w-[1800px]`)
  - Updated `app/(marketing)/page.tsx` section rhythm and inserted new `TrustStripSection`
  - Refactored nav into floating utility-rail behavior in `app/(marketing)/ui/nav.tsx`
  - Rebuilt hero into asymmetric thesis + branch ledger panel in `app/(marketing)/ui/hero.tsx`
  - Replaced how-it-works interaction model with desktop pipeline rail + sticky stage and mobile accordion in `app/(marketing)/ui/how-it-works.tsx`
- Added new marketing components:
  - `app/(marketing)/ui/how-it-works-stage.tsx`
  - `app/(marketing)/ui/trust-strip.tsx`
  - `app/(marketing)/ui/theme-switcher-multi-button.tsx` (Hugeicons + coss button pattern)
- Footer theme controls were migrated to the new multi-button switcher in `app/(marketing)/ui/footer.tsx`.
- Removed inline-style regression by moving hero stagger delays to class-based tokens in `app/globals.css` (`hero-delay-260`, `hero-delay-320`, `hero-delay-380`).
- Applied full-bleed playground shell requirement by removing the page-level max-width container in `app/(playground)/playground/page.tsx`.
- Validation:
  - `get_errors` reports no issues in all touched implementation files.
  - Workspace still contains a pre-existing TypeScript diagnostic in `tsconfig.json` (`ignoreDeprecations` value), unrelated to this UI pass.

### Session 12 — Landing Simplification Pass (Section Removal)

- Simplified the marketing route by removing non-essential sections and utilities from `app/(marketing)/page.tsx`.
- Removed from route and codebase:
  - navbar (`app/(marketing)/ui/nav.tsx`)
  - how-it-works (`app/(marketing)/ui/how-it-works.tsx`)
  - how-it-works stage helper (`app/(marketing)/ui/how-it-works-stage.tsx`)
  - trust strip (`app/(marketing)/ui/trust-strip.tsx`)
  - final CTA (`app/(marketing)/ui/final-cta.tsx`)
  - footer (`app/(marketing)/ui/footer.tsx`)
  - footer theme switcher helper (`app/(marketing)/ui/theme-switcher-multi-button.tsx`)
- Hero was reduced to a single primary CTA and the branch-ledger panel was removed.
- Resulting marketing route structure:
  - `HERO`
  - `LIVE DEMO`

### Session 13 — Spacing + Copy Alignment Pass

- Adjusted page rhythm for no-navbar/no-footer composition:
  - `app/(marketing)/page.tsx` spacing/padding reduced (`space-y-14 sm:space-y-16`, `pb-8 sm:pb-10`)
  - `app/(marketing)/ui/hero.tsx` top/bottom padding reduced (`pt-16 sm:pt-20`, `pb-4 sm:pb-6`)
- Updated hero messaging to match lean layout and removed unnecessary source line wrapping in hero text content.
- Re-synced wireframe source-of-truth to a lean architecture in `spec/landing-page/markymap-landing.md`.

### Session 14 — Full Validation Pass (Rules + Skills)

- Ran full validation sweep for pages, components, and global styling:
  - `pnpm build` passed (all routes prerendered successfully: `/`, `/playground`)
  - `pnpm typecheck` passed
  - `pnpm lint` completed with warnings only (no errors)
  - `pnpm fmt:check` reported formatting drift in a subset of files
- Standards/policy validation findings:
  - Theme infrastructure currently uses a custom context/provider in `components/theme-provider.tsx` instead of `next-themes` provider wiring described in `AGENTS.md`.
  - Formatting drift exists in key app/editor files and should be normalized with `pnpm fmt` when ready.
  - Existing lint warnings are concentrated in `components/ui/*` and appear pre-existing/structural rather than runtime-blocking.
- Confirmed no blocked constraints in active app source for critical red lines:
  - No `next/router` usage in app code
  - No inline `style={{}}` usage in app code
  - No raw `<img>` usage in app code
- Current risk profile:
  - Runtime and build health are good.
  - Remaining work is standards alignment (theme-provider stack consistency + formatting/lint cleanup).

### Session 15 — Agent Guide + Lint Scope Maintenance

- Replaced `AGENTS.md` with a concise quick-look guide intended for fast LLM onboarding.
- Kept deep operational/project history in `spec/context.md` rather than `AGENTS.md`.
- Updated lint policy in `.oxlintrc.json` to ignore `components/ui/**`.
- Rationale: `components/ui` is treated as upstream coss snapshot code and should preserve upstream parity.
- Validation: `pnpm lint` warnings were previously concentrated in `components/ui/*`; after ignore update, lint checks focus on app/editor/feature code.

### Session 16 — Landing Demo Cleanup (Header + Helper Copy Removal)

- Updated `app/(marketing)/ui/demo.tsx` to remove the landing-only demo chrome header (red/yellow/green dots + URL text row).
- Removed the helper line above the demo card: "No account needed. Edit the markdown and watch it map."
- Kept the split markdown/map panel body unchanged so behavior remains identical while visual framing now matches the playground card style.
- Verified diagnostics for touched file with `get_errors`: no issues.

### Session 17 — Landing Demo Persistence Removed

- Updated `app/(marketing)/ui/demo.tsx` so homepage demo edits no longer read from or write to localStorage.
- Removed landing demo persistence helpers (`loadInitialMarkdown`, save timer ref, and `DEMO_STORAGE_KEY` usage).
- Updated `app/(marketing)/ui/demo-seed.ts` by deleting now-unused `DEMO_STORAGE_KEY` export.
- Result: landing demo remains editable for immediate preview, but always starts from `DEMO_SEED` on each visit/refresh.

### Session 18 — Theme Persistence Flash Fix (FOUC Prevention)

- Confirmed dark-mode flash on reload was caused by theme application happening in `useEffect` inside `components/theme-provider.tsx` (post-paint).
- Added a pre-hydration initialization script in `app/layout.tsx` using `next/script` with `strategy="beforeInteractive"`.
- Script resolves theme from localStorage key `theme` (with system fallback), sets `.dark` on `<html>`, and sets `color-scheme` before first paint.
- Result: active dark theme is applied immediately on reload, avoiding light-then-dark flicker.

### Session 19 — Theme Persistence Refactor (Cookies, SSR-First)

- Reverted the `next/script` pre-hydration theme-init approach in `app/layout.tsx`.
- Implemented cookie-based SSR theme bootstrap: `app/layout.tsx` now reads `theme` via `cookies()` and applies `.dark` class on `<html>` server-side when appropriate.
- Updated `components/theme-provider.tsx` to use cookie persistence (`document.cookie`) instead of localStorage for theme writes.
- `ThemeProvider` now accepts `initialTheme` from layout, aligns initial client state with server theme, and keeps runtime theme toggling behavior intact.
- Result: first paint uses server-known theme state from cookies, removing light-flash regressions for persisted dark-mode users.

### Session 20 — System Theme Flash Follow-up (Resolved Cookie)

- Addressed remaining flash case when `theme=system`: server could not infer dark/light on first HTML render.
- Added secondary cookie `theme-resolved` (`light|dark`) written by `ThemeProvider` whenever resolved theme is applied.
- Updated `app/layout.tsx` SSR theme logic to use:
  - `theme=dark` → render `<html class="dark">`
  - `theme=system` + `theme-resolved=dark` → render `<html class="dark">`
  - otherwise render light.
- Result: subsequent reloads in system mode now render with the previously resolved mode on first paint, eliminating recurring light flash.

### Session 21 — Markmap Full Functionality Spec Added

- Created `spec/markmap-packages/full-functionality-spec.md`.
- Captured complete implemented-vs-missing analysis for markdown + mindmap functionality.
- Included prioritized execution phases, acceptance criteria, and file references.
- This spec is now the canonical planning reference for completing editor/map feature parity beyond the current baseline.

### Session 22 — Phase 1 Task 1 (JSON Options End-to-End)

- Implemented JSON options state ownership in `components/editor/editor-shell.tsx` and initialized it from storage.
- Added shared options module `lib/markmap-options.ts` with typed `MarkmapJsonOptions` and `DEFAULT_MARKMAP_JSON_OPTIONS`.
- Updated storage layer in `lib/storage.ts` to persist and load `{ markdown, jsonOptions }` together using `markymap:editor-state` while retaining legacy markdown key fallback.
- Wired editor -> canvas options flow by passing `jsonOptions` into `components/editor/markmap-canvas.tsx`.
- Added explicit options update path in canvas: `mm.setOptions(deriveOptions(...))` when options state changes.
- Kept React 19 `useEffectEvent` mount/resize patterns intact and did not introduce inline styles.
- Validation:
  - `get_errors` reports no issues in all touched implementation files.
  - `pnpm typecheck` still fails on a pre-existing `tsconfig.json` deprecation setting (`baseUrl` requires `ignoreDeprecations`), unrelated to this task.

### Session 23 — Typecheck Baseline Fix (TS6 baseUrl Deprecation)

- Resolved the TypeScript 6 deprecation failure in `tsconfig.json` by removing deprecated `baseUrl` usage instead of suppressing diagnostics.
- Kept alias mapping via `paths` unchanged (`@/*` -> `./*`).
- Validation now passes cleanly:
  - `pnpm typecheck` succeeds.
  - `get_errors` reports no issues in touched files (`tsconfig.json`, editor + canvas + storage + options module).

### Session 24 — Toolbar Controls + Spec Refresh

- Performed status audit against `spec/markmap-packages/full-functionality-spec.md` and aligned stale sections with current implementation.
- Extended map toolbar in `components/editor/markmap-canvas.tsx` with:
  - zoom out / zoom in
  - reset scale (100%)
  - fit view
  - zoom toggle and pan toggle (JSON options-backed)
  - restore defaults for core JSON options
- Added options update plumbing in `components/editor/editor-shell.tsx` so canvas toolbar changes update editor-owned `jsonOptions` state and persist immediately.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched files.

### Session 25 — Structured Import/Export (Markdown + JSON Options)

- Implemented bundle format import/export in `components/editor/editor-shell.tsx`:
  - export `.json` now writes `{ version: 1, markdown, jsonOptions }`
  - import accepts `.json` bundle and restores both markdown + options
  - markdown-only `.md` import/export remains supported for compatibility
- Added basic malformed bundle guardrail: `.json` files that do not match schema now fail import and set save-state to error.
- Updated `spec/markmap-packages/full-functionality-spec.md` status sections to reflect:
  - JSON options core flow complete
  - toolbar controls partially complete with concrete implemented controls listed
  - import/export fidelity partially complete with versioned structured schema baseline
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched files.

### Session 26 — Interaction Controls Clarification (Zoom/Drag/Defaults)

- Updated map toolbar labels in `components/editor/markmap-canvas.tsx` for clearer semantics:
  - `Zoom On` / `Zoom Off`
  - `Drag On` / `Drag Off` (replaces ambiguous `Pan` label)
  - `Option Defaults` (clarifies this resets options, not viewport)
- Fixed drag toggle behavior by applying a custom `mm.zoom.filter(...)` based on current options.
  - Prior behavior: `pan` option only affected wheel pan; drag still worked.
  - New behavior: when `Drag Off`, drag interactions are blocked while wheel zoom can remain enabled if `Zoom On`.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched file.

### Session 37 — Compact Demo + Frontmatter Guidance Correction

- Updated `app/(marketing)/ui/demo-seed.ts` to a shorter, scan-first example intended for real user comprehension (purpose, simple plan, folded launch branch, minimal markdown extras).
- Simplified starter snippets in `components/editor/editor-shell.tsx` so they are practical and readable rather than exhaustive.
- Removed previously showcased frontmatter keys that are currently ineffective in this app context (`colorFreezeLevel`, `color`, `maxWidth`, `htmlParser`, `activeNode`) to avoid misleading users.
- Narrowed frontmatter guidance to layout-focused options with reliable behavior (`initialExpandLevel`, `spacingHorizontal`, `spacingVertical`).
- Validation:
  - `pnpm typecheck` passes.

### Session 27 — Zoom Controls Fixes (Scale Semantics)

- Fixed zoom-out behavior in `components/editor/markmap-canvas.tsx` by correcting `rescale` usage to pass a relative factor (`targetScale / currentScale`) rather than an absolute scale.
- Updated scale reset semantics so the percent button resets to absolute `100%` (1x) instead of performing a no-op relative rescale.
- Added live zoom percentage display tied to current viewport transform, so the button label reflects actual scale.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched file.

### Session 28 — Expand/Collapse Helpers Added

- Implemented toolbar helpers in `components/editor/markmap-canvas.tsx`:
  - `Collapse All`
  - `Expand All`
- Implementation approach:
  - transform current markdown via `Transformer`
  - recursively apply fold payload state (`fold: 1` collapsed / `fold: 0` expanded) on non-root branch nodes
  - push updated tree into existing Markmap instance via `mm.setData(...)`
- Updated `spec/markmap-packages/full-functionality-spec.md` to mark expand/collapse helpers as implemented under toolbar controls.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched file.

### Session 29 — Import UX Guardrails Improved

- Upgraded import parsing in `components/editor/editor-shell.tsx` to return structured parse results with explicit failure reasons.
- Added user-facing import status messaging for:
  - empty files
  - invalid JSON bundle format
  - unsupported bundle versions
  - file read failures
- Import status now surfaces in the header status area (destructive text) instead of generic save failure only.
- Retained compatibility behavior:
  - `.json` imports require valid Markymap bundle schema
  - `.md` imports continue to load as markdown content
- Updated `spec/markmap-packages/full-functionality-spec.md` to reflect malformed-import guardrails as implemented.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched file.

### Session 30 — Schema Evolution Layer Added (Import/Export)

- Added centralized bundle module `lib/editor-exchange.ts` to own versioned parsing and serialization.
- Introduced explicit schema constant (`EDITOR_EXCHANGE_VERSION`) and serializer helper (`createEditorExchangeV1`).
- Refactored `components/editor/editor-shell.tsx` to consume shared parser/serializer utilities.
- Added migration path for legacy unversioned JSON bundles (`{ markdown, jsonOptions }`) to import as version `1`.
- This establishes the migration table pattern for future schema versions while preserving current `.json` and `.md` workflows.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched files.

### Session 31 — Drawer-Based Authoring Guidance (No Page Growth)

- Added `Markmap Tips` overlay in `components/editor/editor-shell.tsx` using coss `Drawer` (`position="bottom"`, `variant="inset"`, drag bar + close button).
- Kept one-screen interface constraint intact: guidance lives in overlay and does not increase page height or require page scrolling.
- Included in-app guidance + copy-ready templates for:
  - JSON frontmatter options
  - magic comments (`fold`, `foldAll`)
- Added quick insert actions that append selected templates directly into markdown editor content.
- Updated `spec/markmap-packages/full-functionality-spec.md` to mark authoring guidance baseline as complete.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched file.

### Session 32 — Guide-First Nested Drawer + Insert Feedback

- Refined editor guidance UX in `components/editor/editor-shell.tsx`:
  - primary drawer now opens with a beginner-friendly markdown-for-mindmaps guide first
  - snippet examples moved into a nested drawer opened by clear text action (`Open Ready-to-Use Snippets`)
- Added explicit success feedback on snippet insertion actions:
  - clicked insert button switches to success state (`Inserted`) briefly
  - success state uses `Button` `variant="default"` while idle state remains `variant="outline"`
- Kept one-screen interface constraint intact since all guidance remains overlay-based.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched file.

### Session 33 — Comprehensive Authoring Guide + Expressive Demo Seed

- Expanded `components/editor/editor-shell.tsx` guidance content to be substantially more comprehensive for mindmap authoring:
  - structure and branch depth strategy
  - list usage patterns
  - rich markdown usage (links, emphasis, code, tables)
  - frontmatter behavior tuning
  - fold/foldAll pre-collapse strategies
- Added an official-style starter snippet (with expressive `markmap` frontmatter options) to nested snippet drawer and insert action feedback states.
- Updated homepage demo seed in `app/(marketing)/ui/demo-seed.ts` to use the expressive starter example so landing demo better showcases markmap capabilities.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched files.

### Session 34 — Rendering Checklist Coverage + Shared Accent Styling

- Updated `components/editor/editor-shell.tsx` starter snippet to include explicit rendering checklist lines:
  - strong/strike/italic/highlight
  - inline code
  - task checkbox
  - KaTeX inline formula with fold magic comment
  - maxWidth long-line example
  - ordered list items
- Updated `app/(marketing)/ui/demo-seed.ts` to include same expressive checklist content so homepage demo better reflects real markmap capabilities.
- Changed `Open Ready-to-Use Snippets` trigger from link-styled text to actual `Button` (`variant="outline"`, `size="xs"`).
- Added shared guide accent utility classes in `app/globals.css` (`guide-section`, `guide-heading`, `guide-copy`, `guide-example`) and applied them in drawer guide/snippet surfaces.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched files.

### Session 35 — Demo Cleanup + Drawer Accent Visibility Fixes

- Updated `app/(marketing)/ui/demo-seed.ts` to remove requested sections from demo content:
  - removed frontmatter block from top of demo seed
  - removed quote block under `### Quote` that was not rendering as desired
- Improved visibility of guidance UI accents in `app/globals.css` by strengthening shared utility contrast:
  - `guide-section`
  - `guide-example`
  - added `guide-drawer-shell` utility for explicit drawer boundary/ring
- Applied shared accent/ring classes in `components/editor/editor-shell.tsx`:
  - both tips and snippets `DrawerPopup` now use `guide-drawer-shell`
  - guide/snippet content sections now consistently use `guide-section`
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched files.

### Session 36 — Accent Styling Rollback (Cleaner Drawer UI)

- Reverted the guide accent experiment due to visual quality concerns.
- Removed custom accent utility classes from `app/globals.css`:
  - `guide-section`
  - `guide-heading`
  - `guide-copy`
  - `guide-example`
  - `guide-drawer-shell`
- Updated `components/editor/editor-shell.tsx` to use neutral token-based styles directly for guide/snippet sections and code examples.
- Removed custom drawer shell class usage from both tips and snippets drawers.
- Result: cleaner, less noisy drawer UI with standard border/background styling and restored visual consistency.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched files.

### Session 37 — Frontmatter Runtime Wiring + UX Control Rework

- Added shared transform helper `lib/markmap-transform.ts` to extract parsed `frontmatter.markmap` options from `markmap-lib` transform results.
- Wired frontmatter options into runtime rendering for both:
  - `components/editor/markmap-canvas.tsx` (playground map)
  - `app/(marketing)/ui/demo.tsx` (landing live demo)
- Result: markmap frontmatter options now apply during create/update cycles (including color/maxWidth/expand-level related view behavior, plus html parser selector handling via transformer frontmatter parsing).
- Updated editor starter/demo content to include requested folded `Options` node with rich markdown checklist samples.
- Reworked editor top controls in `components/editor/editor-shell.tsx`:
  - grouped import/export/reset actions under one menu
  - added Hugeicons-based triggers
  - reduced header clutter and right-aligned controls
- Added reset auto-fit behavior by introducing a `fitSignal` prop to `MarkmapCanvas` and incrementing it on editor reset.
- Improved authoring help quality:
  - added explicit markdown-writing basics section to `Mindmap Markdown Guide`
  - increased guide/snippet text sizes for readability
- Increased default drawer readability globally by raising base drawer popup/body typography in `components/ui/drawer.tsx`.
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` clean in touched files after final patch.

### Session 38 — Base UI Menu Group Fix + Guide Simplification

- Fixed runtime error in `components/editor/editor-shell.tsx` by wrapping `MenuGroupLabel` usages inside `MenuGroup` per Base UI requirements.
- Verified against Base UI handbook docs under `spec/base-ui/` before patching.
- Refined `Mindmap Markdown Guide` to be shorter and easier to scan:
  - reduced section count and copy volume
  - shifted focus to practical, real-world patterns (meeting prep, feature planning, study notes)
- Rewrote snippet examples to be more meaningful for actual user workflows:
  - product plan frontmatter example with goals + delivery streams
  - weekly agenda fold/foldAll example
  - kickoff template with timeline + checklist
- Validation:
  - `pnpm typecheck` passes.
  - `get_errors` reports no issues in touched file.

### Session 39 — React/Next Comprehensive Audit + True-Positive Fixes

- Loaded and applied relevant skills before scanning:
  - `next-best-practices`
  - `react-useeffect`
  - `vercel-react-best-practices`
  - `vercel-composition-patterns`
  - `coss`
- Ran full scans:
  - `pnpm lint`
  - `npx -y react-doctor@latest .`
- Fixed confirmed true positives:
  1. `components/editor/markmap-canvas.tsx`
     - removed `useEffectEvent` callbacks from hook dependency arrays (`syncZoomPercent`) per React 19 + hooks best practice
  2. `components/ui/input-group.tsx`
     - added semantic `role="group"` on addon container with mouse interaction handler to satisfy accessibility semantics
- Post-fix scan results:
  - `pnpm lint` now reports 0 warnings / 0 errors
  - `react-doctor` score improved (95 -> 96) and warning count reduced (122 -> 121)
- Remaining report items were triaged as advisory/intentional (not immediate defects):
  - `no-giant-component` warnings for `EditorShell` / `MarkmapCanvas` (architecture suggestion)
  - `autoFocus` in command input (intentional command-palette UX behavior)
  - slider index-key warning (thumb order is fixed/index-addressed by primitive API)
  - broad Knip dead-code flags for `components/ui/*` and exported primitives (expected in upstream snapshot component library surface)

### Session 40 — Composition Refactor + Advisory Revalidation

- Applied composition-skill refactor to split giant editor/map components:
  - added `components/editor/use-editor-shell-state.ts` to extract state/actions from `EditorShell`
  - added `components/editor/editor-toolbar.tsx` for top-level actions composition
  - added `components/editor/mindmap-tips-drawer.tsx` for guide/snippet drawer composition
  - added `components/editor/editor-templates.ts` for shared template constants/types
  - added `components/editor/markmap-controls-bar.tsx` for map control bar composition
- Refactored `components/editor/editor-shell.tsx` and `components/editor/markmap-canvas.tsx` to consume extracted composed parts.
- Revalidated previously advisory items and fixed additional true positives:
  - removed `autoFocus` from `components/ui/command.tsx`
  - replaced `key={index}` in `components/ui/slider.tsx` with stable derived thumb keys
  - reduced dead-code export noise by narrowing unused exports/functions in:
    - `lib/editor-exchange.ts`
    - `lib/storage.ts`
    - `lib/audio/sound-engine.ts`
- Validation:
  - `pnpm lint` passes with 0 warnings/0 errors
  - `pnpm typecheck` passes
  - `react-doctor` (changed-file scan) reports no issues, score `100/100`

### Session 41 — Markdown Preview Spec (Safety + Performance)

- Loaded and applied relevant skills for planning:
  - `next-best-practices`
  - `vercel-react-best-practices`
  - `react-useeffect`
  - `make-interfaces-feel-better`
- Added new planning spec at `spec/markmap-packages/markdown-preview-spec.md`.
- The spec defines:
  - Map/Markdown dual-view architecture in the right panel
  - package tiers (baseline vs optional feature packs)
  - explicit security model (sanitize-first, no raw HTML by default)
  - performance strategy (active-view-only rendering, lazy optional plugins)
  - edge-case matrix and phased rollout with acceptance criteria
- Baseline package recommendation in spec:
  - `react-markdown`
  - `remark-gfm`
  - `rehype-sanitize`
- Optional packs documented in spec:
  - math: `remark-math`, `rehype-katex`, `katex`
  - highlighting: `rehype-highlight`, `highlight.js`
  - line-break compatibility: `remark-breaks`

### Session 42 — Markdown Preview Phase 1 Implemented

- Implemented Phase 1 of `spec/markmap-packages/markdown-preview-spec.md` in editor right panel.
- Added baseline markdown rendering dependencies:
  - `react-markdown`
  - `remark-gfm`
  - `rehype-sanitize`
- Added new renderer component:
  - `components/editor/markdown-preview.tsx`
  - renders GFM markdown with sanitize plugin and includes empty-state handling
- Updated map header controls to support preview mode switching:
  - `components/editor/markmap-controls-bar.tsx`
  - replaced static label with compact `Map | Markdown` segmented switch
  - map-only controls are hidden while `Markdown` view is active
- Updated map canvas orchestration:
  - `components/editor/markmap-canvas.tsx`
  - introduced `activeView` state (`map` default)
  - renders markdown preview when selected
  - skips map update effects while markdown view is active (active-view-only render path)
  - keeps map instance available for seamless return to map view
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 43 — Markdown Preview Phase 2 (Policy + UI Polish)

- Completed Phase 2 goals from `spec/markmap-packages/markdown-preview-spec.md`.
- Updated `components/editor/markdown-preview.tsx`:
  - strips leading YAML frontmatter from preview output
  - strips markmap control comments (`fold` / `foldAll`) from preview output
  - keeps full-width panel rendering and in-panel overflow scrolling
  - improved empty-state copy for clearer Map/Markdown workflow context
  - minor markdown typographic refinements for task-list readability
- Updated `components/editor/markmap-controls-bar.tsx`:
  - improved segmented control visual integration (`Map | Markdown`) with calmer surface treatment
  - added motion utility class to tab buttons for consistent interaction transitions
- Updated `spec/markmap-packages/markdown-preview-spec.md` with explicit implementation status for Phase 1 and Phase 2.

### Session 44 — Markdown Preview Phase 3 (Math + Lazy Loading)

- Implemented Phase 3 math support in markdown preview:
  - installed `remark-math`, `rehype-katex`, `katex`
  - integrated KaTeX stylesheet via `app/globals.css`
- Updated `components/editor/markdown-preview.tsx`:
  - added math syntax detection (`$...$`, `$$...$$`, `\\(`, `\\[`)
  - lazy-loads optional math plugins only when math syntax is present
  - extends sanitize schema minimally to allow `math-inline` / `math-display` classes on code nodes before KaTeX transform
  - keeps graceful fallback to baseline markdown rendering if optional plugin load fails
- Updated `spec/markmap-packages/markdown-preview-spec.md` status:
  - Phase 3 now marked as completed.
- Added optional code highlighting support:
  - installed `rehype-highlight` and `highlight.js`
  - integrated highlight stylesheet in `app/globals.css`
  - added fenced-code detection and lazy loading for highlight plugin in `components/editor/markdown-preview.tsx`
  - highlight path gracefully falls back to plain code blocks if optional plugin load fails
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 45 — Markdown Preview UX Fixes (Dark/Codeblock/Scrollbar)

- Loaded design guidance from:
  - `make-interfaces-feel-better/surfaces.md`
  - `make-interfaces-feel-better/animations.md`
  - `emil-design-eng/SKILL.md`
- Updated markdown preview/code block UX in `components/editor/markdown-preview.tsx`:
  - added fenced code block header with detected language label
  - added per-block `Copy` button with transient `Copied` state
  - improved code block shell styling (`rounded-xl`, border, header)
  - kept inline-code styling while preventing style leakage into fenced code
- Updated map panel layout in `components/editor/markmap-canvas.tsx`:
  - removed markdown-view outer panel padding so preview scrollbar aligns with editor-side behavior
- Added highlight theme overrides in `app/globals.css`:
  - removed white-background issue in dark mode by forcing transparent `.hljs` surface in markdown preview
  - added theme-aware token color overrides for common highlight groups
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 46 — Hydration Fix + Codeblock Header/Icon Copy Refinement

- Fixed hydration mismatch in playground editor state initialization:
  - updated `components/editor/use-editor-shell-state.ts`
  - localStorage state is now loaded after mount via effect instead of during initial render
  - avoids server/client text mismatch in header char count and related recoverable hydration errors
- Fixed markdown preview fenced-code text extraction bug (`[object Object]`):
  - updated `components/editor/markdown-preview.tsx`
  - replaced shallow `join` extraction with recursive ReactNode text walker
- Refined code block chrome in markdown preview:
  - reduced header height and padding for denser, calmer appearance
  - replaced text copy button with icon-based action using:
    - `Copy01Icon`
    - `Tick02Icon`
  - copy state now toggles icon feedback while preserving accessibility label
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 47 — Code Highlight Restoration + Copy Control Visual Fixes

- Addressed follow-up issues in markdown preview code blocks:
  - restored syntax highlighting by preserving highlighted child nodes from `react-markdown` code elements (instead of flattening to plain text)
  - kept robust copy-text extraction via recursive ReactNode walker
  - increased code header density slightly (less aggressive compression)
  - switched copy/check icon control to consistently visible `Button` outline style
- Mitigated markmap contrast regression from global highlight stylesheet:
  - removed global `highlight.js` theme import from `app/globals.css` to avoid cross-surface bleed into map rendering
  - kept/expanded preview-scoped `.markdown-preview-surface .hljs*` token colors so markdown preview highlighting remains styled
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 48 — Unified High-Contrast Syntax Palette (Preview + Markmap)

- Replaced narrow preview-only syntax color mapping with a unified, token-based palette in `app/globals.css`:
  - introduced shared syntax color variables for light/dark (`--syntax-*`)
  - applied styles to both highlight engines/classes:
    - Highlight.js (`.hljs-*`)
    - Prism (`.token.*`)
  - scoped coverage now includes both surfaces:
    - markdown preview (`.markdown-preview-surface`)
    - markmap rendered labels/code (`.markmap`, `.markmap-foreign`)
- Added explicit markmap code color/background var overrides so map code blocks do not fall back to low-contrast defaults in dark mode.
- Updated markdown preview copy affordance in `components/editor/markdown-preview.tsx`:
  - switched copy action to ghost/icon-only visual treatment
  - removed outlined/chrome-heavy button appearance while retaining accessible label and keyboard focus behavior
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 49 — JSX Token Contrast Hardening + True Icon-Only Copy Action

- Addressed remaining dark-mode readability issues reported from real TSX samples (e.g. dim JSX tags/prop names like `onExportMarkdown` / `<div className=`):
  - expanded syntax selectors in `app/globals.css` to include additional Highlight.js token classes used in JSX/TSX:
    - `.hljs-tag`, `.hljs-name`, `.hljs-attr`, `.hljs-attribute`, `.hljs-operator`, `.hljs-subst`, `.hljs-meta`, `.hljs-title.function_`, `.hljs-title.class_`
  - kept Prism token support in parallel for markmap/other tokenized HTML paths (`.token.*`)
  - applied stronger precedence (`!important`) for syntax token color declarations so runtime-injected highlighter styles cannot override app-level contrast choices
- Updated markdown preview code-block copy affordance in `components/editor/markdown-preview.tsx`:
  - replaced coss `Button` wrapper with a semantic native `<button type="button">` styled as icon-only (no visible button chrome)
  - retained accessibility label and keyboard click/focus semantics
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 50 — Spec Audit + Completion Status Sync

- Audited active spec files with focus on:
  - `spec/markmap-packages/markdown-preview-spec.md`
  - `spec/markmap-packages/full-functionality-spec.md`
- Updated markdown preview spec status to explicitly finalized:
  - added `Overall status: Complete`
  - corrected outdated Phase 3 note that previously claimed a global highlight stylesheet dependency
  - documented current production approach: app-level theme-aware syntax token styling across markdown preview and markmap code
  - set Remaining to `None required for this spec`
- Updated full functionality spec to explicitly remain in-progress:
  - added `Overall status: In progress (not fully complete)`
  - clarified acceptance criteria completion summary
  - marked criteria 4-5 as open (large-doc performance hardening and broader test coverage)
- Decision outcome:
  - Markdown Preview spec is complete.
  - Full Functionality spec is not yet complete.

### Session 51 — Full Functionality Spec Finalization (Performance + Tests)

- Closed remaining gaps from `spec/markmap-packages/full-functionality-spec.md` by implementing:
  - large-document map update guardrail in `components/editor/markmap-canvas.tsx`
    - `useDeferredValue` input deferral
    - threshold-based delayed render/update staging for heavy markdown input
  - automated test coverage for critical workflows using Vitest:
    - `lib/editor-exchange.test.ts` (versioned import/export parsing + migration/error cases)
    - `lib/storage.test.ts` (persistence round-trip + storage error paths)
    - `components/editor/markmap-canvas.test.tsx` (markmap lifecycle: mount/update/unmount)
  - test runtime/config wiring:
    - `vitest.config.ts`
    - `vitest.setup.ts`
    - `package.json` scripts: `test`, `test:watch`
- Updated `spec/markmap-packages/full-functionality-spec.md`:
  - Overall status switched to `Complete`
  - converted previous remaining sections into optional post-completion backlog/enhancements
  - marked acceptance criteria 1-5 as satisfied for current implementation baseline
- Validation:
  - `pnpm test` passes (all suites)
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 52 — Homepage Messaging + Demo Map/Markdown Switch

- Updated marketing copy to reflect markdown rendering + dual-view workflow:
  - `app/(marketing)/ui/hero.tsx`
    - headline now communicates map navigation and markdown verification
    - support copy now explicitly mentions switching between Map and Markdown
  - `app/(marketing)/page.tsx`
    - metadata description updated to mention instant map/markdown switching
- Added homepage live demo view switching in `app/(marketing)/ui/demo.tsx`:
  - introduced right-panel `Map | Markdown` segmented control
  - reused `components/editor/markdown-preview.tsx` for markdown rendering in marketing demo
  - kept `Fit` action visible only when `Map` view is active
  - gated markmap update/resize effects behind `activeView === "map"` for active-view-only behavior
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 53 — Mobile Layout + Toolbar Responsiveness Pass

- Implemented mobile-first layout fixes for homepage and playground parity:
  - `app/(marketing)/page.tsx` and `app/(playground)/playground/page.tsx`
    - switched mobile behavior from fixed viewport/no-scroll to `min-h-dvh` + `overflow-y-auto`
    - preserved desktop behavior with `sm:h-dvh` + `sm:overflow-hidden`
- Improved stacked pane usability on mobile (equal, touch-friendly panel heights):
  - `components/editor/editor-shell.tsx`
  - `app/(marketing)/ui/demo.tsx`
  - mobile grid rows now use balanced `minmax(...)` layout for markdown/map sections
  - cards use mobile minimum height to keep both panes interactable before scrolling
- Fixed mobile top-bar overflow issues:
  - `components/editor/markdown-input.tsx`: compact/truncating status row and tighter mobile spacing
  - `components/editor/markmap-controls-bar.tsx`: wrapped mobile control row (no horizontal overflow), full control row remains desktop-only
  - `app/(marketing)/ui/demo.tsx`: responsive left/right panel header spacing and wrapping
- Updated editor top toolbar mobile fit:
  - `components/editor/editor-toolbar.tsx`: control group now wraps and stays within page container on small screens
  - `components/editor/mindmap-tips-drawer.tsx`: trigger label changed from `Markmap Tips` to `Tips`
- Explicit CTA/toggle ordering in hero for mobile and desktop consistency:
  - `app/(marketing)/ui/hero.tsx`: `Open playground` button remains before theme toggle
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 54 — Tweakcn/Claude Color Theme Integration

- Integrated user-provided tweakcn (Claude) palette into `app/globals.css`.
- Scope applied: semantic color tokens only (per request), including light + dark values for:
  - background/foreground/card/popover/primary/secondary/muted/accent/destructive
  - border/input/ring/chart-1..5/sidebar tokens
- Explicitly preserved non-color system settings:
  - radius scale
  - shadow tokens/surface shadow behavior
  - spacing/motion/typography patterns
  - existing app utility architecture
- Kept project-specific info/success/warning semantic tokens intact because they were not part of provided theme exports and are used by status/feedback UI.
- Validation:
  - `pnpm typecheck` passes
  - `pnpm lint` passes (0 warnings / 0 errors)

### Session 55 — Export HTML/PDF Research + Vercel Implementation Spec

- Researched export architecture for new playground save targets with explicit requirement that deployment runs on Vercel.
- Decision: use a split export pipeline instead of one generalized client-side exporter:
  - `markmap-render` for interactive map HTML export
  - `unified` pipeline for rendered markdown HTML export
  - PDF generated from export HTML via headless Chromium
- Vercel-specific decision:
  - use `puppeteer-core` + `@sparticuz/chromium`
  - keep PDF generation in Node.js route handlers (`runtime = "nodejs"`)
  - avoid client-side screenshot/pdf libraries as the primary path
- Added implementation spec at `spec/markmap-packages/export-html-pdf-spec.md` covering:
  - goals and acceptance criteria
  - package choices
  - route handler architecture
  - shared server utility layout
  - toolbar/export UX integration
  - validation matrix and deployment risks
- Current status:
  - Spec complete
  - Implementation not yet started

### Session 56 — Export Phase 1 Foundation (Shared Server HTML Renderers)

- Started Phase 1 from `spec/markmap-packages/export-html-pdf-spec.md`.
- Installed new export/server dependencies:
  - `markmap-render`
  - `unified`
  - `remark-parse`
  - `remark-rehype`
  - `rehype-stringify`
  - `puppeteer-core`
  - `@sparticuz/chromium`
- Added shared export foundation under `lib/export/`:
  - `export-types.ts`
  - `export-validation.ts`
  - `export-shell.ts`
  - `render-map-html.ts`
  - `render-markdown-html.ts`
- Implementation details:
  - map HTML renderer reuses existing markmap transform/frontmatter logic via `getMarkmapTransformSnapshot`
  - exported map options match current playground precedence:
    - defaults
    - user json options
    - frontmatter markmap options
  - markdown HTML renderer uses a server-side unified pipeline with:
    - `remark-parse`
    - `remark-gfm`
    - `remark-math`
    - `remark-rehype`
    - `rehype-sanitize`
    - `rehype-katex`
    - `rehype-highlight`
    - `rehype-stringify`
  - markdown export strips leading frontmatter and markmap fold comments to match in-app markdown preview behavior
  - export shell now provides a reusable full HTML document wrapper and markdown document styles
  - KaTeX CSS is loaded from the installed package and rewritten so font URLs resolve against the package CDN base when opened outside the app
- Validation:
  - `corepack pnpm typecheck` passes
  - `corepack pnpm lint` passes
- Known follow-up:
  - no route handlers yet
  - no toolbar wiring yet
  - no PDF rendering utility/route yet
  - direct Node smoke-run of the render helpers was blocked by project `@/` path aliases outside the Next/TS toolchain, but TypeScript + lint passed

### Session 57 — Export Phase 2/3 (Routes + Playground Wiring)

- Added export route handlers:
  - `app/api/export/map/html/route.ts`
  - `app/api/export/map/pdf/route.ts`
  - `app/api/export/markdown/html/route.ts`
  - `app/api/export/markdown/pdf/route.ts`
- Added shared PDF renderer:
  - `lib/export/render-pdf.ts`
- Route/runtime decisions implemented as planned:
  - all export endpoints use `runtime = "nodejs"`
  - HTML routes render from shared server HTML utilities
  - PDF routes render HTML first, then pass it to Puppeteer/Chromium
- Chromium/PDF implementation details:
  - uses `puppeteer-core` + `@sparticuz/chromium`
  - supports optional `CHROME_EXECUTABLE_PATH` override for local/non-Vercel environments
  - defaults to landscape for map PDFs and portrait-ish A4 defaults for markdown PDFs
  - waits for map initialization (`window.mm`) before printing map PDFs
- Wired playground UI to new export routes:
  - expanded toolbar options menu with:
    - `Export map .html`
    - `Export map .pdf`
    - `Export markdown .html`
    - `Export markdown .pdf`
  - existing `.json` and `.md` export actions remain intact
- Added client export behavior in `components/editor/use-editor-shell-state.ts`:
  - POSTs `{ markdown, jsonOptions }` to export routes
  - downloads returned blobs with correct filenames
  - prevents duplicate export clicks while an export is in flight
  - surfaces export progress/failure in the existing editor status area
- Validation:
  - `corepack pnpm typecheck` passes
  - `corepack pnpm lint` passes
  - `corepack pnpm build` passes
- Remaining follow-up:
  - browser-level manual verification of each export action still recommended

### Session 58 — Export Phase 4 Hardening Pass (No Automated Tests Run)

- Continued Phase 4 with code-level hardening only, per request not to run automated tests or open a browser.
- Added shared response helpers in `lib/export/export-response.ts`:
  - standardized attachment responses
  - standardized JSON error responses
  - `Cache-Control: no-store` for export endpoints
- Strengthened export payload validation in `lib/export/export-validation.ts`:
  - reject empty markdown exports
  - reject oversized markdown payloads via a server-side max length guard
  - return more specific export error messages/status codes (`400` / `413`)
- Hardened PDF generation in `lib/export/render-pdf.ts`:
  - added explicit PDF render timeout guard
  - set page-level default timeouts
  - preserved map readiness wait before printing
  - simplified page typing using Puppeteer `Page` type import
- Updated all export route handlers to use shared response/error helpers and the improved validation mapping.
- Validation intentionally not run in this session segment:
  - no automated tests
  - no browser verification

### Session 59 — Export Runtime Bug Fixes (Markdown HTML + Local PDF)

- Diagnosed user-reported runtime failures from localhost export routes:
  - `map/html` worked
  - `markdown/html` returned `500`
  - `map/pdf` returned `500`
  - `markdown/pdf` returned `500`
- Added dev-only export error details in `lib/export/export-response.ts` to expose route failure causes safely during development.
- Root causes identified:
  - markdown HTML export failed because markdown export shell tried to read stylesheet files from disk at runtime and received an undefined path in route execution context
  - local PDF export failed because driving an installed local Chrome via Puppeteer produced `Protocol error (Page.printToPDF): Target closed`
- Fixes implemented:
  - replaced markdown export runtime CSS file reads with CDN stylesheet links for:
    - KaTeX
    - highlight.js
  - kept app-owned layout/typography styles inline in `lib/export/export-shell.ts`
  - added local-browser PDF fallback in `lib/export/render-pdf.ts`:
    - if a local Chrome/Edge executable is found (or `CHROME_EXECUTABLE_PATH` is set), use Chrome CLI `--print-to-pdf`
    - keep Puppeteer + `@sparticuz/chromium` path for Vercel/serverless environments
  - inject target-aware `@page` print styles for local CLI PDF generation
- Direct route verification after fixes:
  - `POST /api/export/markdown/html` → `200`
  - `POST /api/export/map/pdf` → `200`
  - `POST /api/export/markdown/pdf` → `200`
- No automated tests or browser opening were performed during this debugging pass.

### Session 60 — Map PDF Blank-Page Mitigation

- Investigated follow-up issue where map PDF export returned a blank rendered page while other exports worked.
- Assessment:
  - the export method itself is still correct
  - the likely weak spot is the local PDF fallback path printing before async markmap rendering fully settles
- Mitigations implemented:
  - `lib/export/render-map-html.ts`
    - added optional inline base asset mode for PDF generation
    - inlines the installed browser bundles for:
      - `d3`
      - `markmap-view`
    - keeps standard HTML export behavior unchanged
  - `app/api/export/map/pdf/route.ts`
    - now requests map HTML with inline base assets for PDF generation
  - `lib/export/render-pdf.ts`
    - local map PDF generation now prefers the full browser-rendered PDF path first
    - only falls back to CLI `--print-to-pdf` if the local browser-render path throws
- Notes:
  - this keeps Vercel/serverless PDF generation on the original Puppeteer/Chromium path
  - no browser was opened during this fix, so visual confirmation still depends on user-side retest

### Session 61 — Local PDF Fallback Stabilization

- Follow-up logs showed local `map/pdf` requests returning `200` while still emitting noisy `TargetCloseError` / `unhandledRejection` output.
- Diagnosis:
  - local map PDF path was first attempting a Puppeteer browser-rendered PDF with the installed local Chrome
  - that attempt failed with `Protocol error (Page.printToPDF): Target closed`
  - code then fell back to the local Chrome CLI print path, which succeeded, causing `200` plus noisy server logs
- Fixes:
  - removed the local map-PDF "try browser first, then fallback" path
  - local browser environments now consistently use the stable local CLI print path for PDFs
  - kept the Puppeteer-rendered path for non-local/serverless Chromium usage
  - tightened `withTimeout` so timers are cleared on resolve/reject instead of leaving dangling timeout promises behind

### Session 62 — New Map PDF Method (Live SVG Snapshot)

- User requested a new method after map PDFs continued to render as blank pages.
- Replaced the preferred map PDF source from "re-render markmap into export HTML" to:
  - serialize the already-rendered live playground SVG
  - send that SVG markup to the export route
  - generate the PDF from a static HTML document that embeds the captured SVG directly
- Implementation details:
  - `components/editor/markmap-canvas.tsx`
    - now emits serialized SVG markup through `onSvgMarkupChange`
  - `components/editor/use-editor-shell-state.ts`
    - stores latest rendered map SVG markup
    - includes `svgMarkup` when requesting `map/pdf`
  - `app/api/export/map/pdf/route.ts`
    - prefers `svgMarkup` input and builds map PDF from static SVG HTML
    - falls back to prior render-map-html path only if no SVG snapshot is available
  - `lib/export/render-map-static-html.ts`
    - new helper that wraps static SVG in a print-oriented landscape HTML document
- Rationale:
  - this avoids async markmap render timing entirely for map PDF generation
  - exported PDF should now be based on the exact map already visible in the playground

### Session 63 — Map PDF Snapshot Normalization

- User reported that the new static-SVG map PDF path still produced a blank page.
- Strengthened the map snapshot export path:
  - `components/editor/markmap-canvas.tsx`
    - snapshot now clones the live SVG and normalizes it for export
    - adds explicit:
      - `xmlns`
      - `xmlns:xlink`
      - `width`
      - `height`
      - `viewBox`
      - `preserveAspectRatio`
    - computes export bounds from the rendered `<g>` bounding box when available, with padding
  - `lib/export/render-map-static-html.ts`
    - no longer embeds raw inline SVG directly in the PDF document
    - instead converts the SVG snapshot into a `data:image/svg+xml` URL and prints it via `<img>`
- Rationale:
  - browsers are generally more reliable printing a static image source derived from SVG than printing a live inline SVG node with app-originated attributes/classes

---

## Important Constraints And Reminders

### Hard Constraints

- **No Radix UI** — coss ui is built on Base UI, not Radix. They have completely different APIs. Never import from `@radix-ui/*`.
- **No lucide-react** — fully replaced by Hugeicons. Never add it back. Never import from `lucide-react`.
- **No inline styles** — `style={{}}` is banned. Zero exceptions.
- **No per-component CSS** — no CSS Modules, no Styled Components, no Emotion.
- **No `<img>` elements** — always `next/image`.
- **No `next/router`** — App Router uses `next/navigation`.
- **No direct `AudioContext` instantiation in components** — always use `getAudioContext()` from the sound engine.
- **No raw Tailwind color values for semantic purposes** — use design tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, etc.)
- **No AI/API calls from client components** — all external API calls go through Next.js Route Handlers (`app/api/`)

### Soft Reminders

- The `spec/skills.md` index exists so you don't have to guess what skills are available — read it first.
- `spec/base-ui/` contains the Base UI handbook. Read it before using any coss ui component with complex behavior (popover, dialog, select, etc.).
- `spec/references/` contains design philosophy from Emil and Dimi — read it before making any UI design decisions. Key: editorial calm, narrow columns, spacing over cards, no gradient text, no oversized hero.
- Landing page spec is at `spec/landing-page/markymap-landing.md` — read it before building any marketing page component.
- Landing helper hooks (`hooks/use-in-view.ts`, `hooks/use-scroll-y.ts`, `hooks/use-carousel-controls.ts`) already exist; the current lean landing route does not require all of them to be active.
- The `useEffectEvent` pattern (React 19) is already in use in `theme-provider.tsx` — prefer it over dependency array gymnastics for event handlers inside effects.
- Base UI composition uses `render` props and `useRender`; never use Radix-style `asChild` in this project.
- `markmap-lib` and `markmap-view` are installed and ready to import. Full API reference is at `spec/markmap-packages/context.md`.
- The implementation plan in `spec/markmap-packages/context.md` has been **skills-audited and corrected**. Do not use the original unaudited version. The canonical patterns are: `useEffectEvent` for the mount effect, lazy `useState` for localStorage init, `useRef` for debounce timer.
- **Never suppress `react-hooks/exhaustive-deps`** — always use `useEffectEvent` instead. This rule has no exceptions in this codebase.
- `react-day-picker` is installed and `calendar.tsx` is fully operational.
- When adding new icons, use the Hugeicons MCP `search_icons` tool first, then `get_platform_usage("react")` if the pattern is unclear. Always use the free pack.

---

## Recommended Workflow For Future Changes

1. **Read `AGENTS.md`** — full project knowledge
2. **Read `spec/context.md`** (this file) — current state and history
3. **Read `spec/skills.md`** — identify relevant skills for the task
4. **Load and read relevant skill files** from `.agents/skills/`
5. **Check `package.json`** — confirm packages exist before importing
6. **Check `components/ui/`** — confirm a component doesn't already exist
7. **Check `app/globals.css`** — confirm a utility class doesn't already exist
8. **Write code** following all established standards
9. **Update `spec/context.md`** — log what was done, any decisions made, any new constraints discovered

---

### Landing Page — Spec Complete, Ready to Build

The landing page wireframe spec is at `spec/landing-page/markymap-landing.md`. Key facts:

- **Route:** `/` via `app/(marketing)/page.tsx`
- **Playground route:** `/playground` via `app/(playground)/playground/page.tsx`
- **Sections (current):** HERO → LIVE DEMO
- **Demo:** A real live split-panel markmap (textarea + SVG canvas) using `markmap-lib` + `markmap-view`, seeded from `DEMO_SEED` as non-persistent preview content.
- **Demo framing:** No landing-only helper line and no faux traffic-light header; preview starts directly at the split editor/map body.
- **Animation:** CSS transitions + IntersectionObserver only via `hooks/use-in-view.ts`. No `motion` library.
- **Hooks status:** `hooks/use-in-view.ts`, `hooks/use-scroll-y.ts`, `hooks/use-carousel-controls.ts` are already implemented in the repository.
- **Copy (current hero):** "Turn plain notes into a map you can actually navigate." + supporting lines focused on structure and revisitation.
- **Anti-patterns documented:** No gradient text, no hero image, no email capture, no blob backgrounds, no inline styles, no arbitrary Tailwind values

### Editor Implementation — Ready to Build

The markmap research is complete. The next session should execute Tasks 1–9 from
`spec/markmap-packages/context.md` in order:

**Build order (landing page first, then editor):**

**Landing page:**

1.  Create route group `app/(marketing)/` with `page.tsx` + `layout.tsx`
2.  Create route group `app/(playground)/playground/` with `page.tsx` + `layout.tsx`
3.  `app/(marketing)/ui/page-container.tsx` — wide/measure layout utility
4.  `app/(marketing)/ui/hero.tsx` — lean headline, supporting copy, single CTA, mount animation
5.  `app/(marketing)/ui/demo-seed.ts` — DEMO_SEED markdown constant
6.  `app/(marketing)/ui/demo.tsx` — live split-panel markmap (`"use client"`)

**Editor (after landing page):**

1. `lib/storage.ts` — localStorage helpers with try/catch
2. `components/editor/markmap-canvas.tsx` — SVG renderer, module-level Transformer singleton
3. `components/editor/markdown-input.tsx` — controlled textarea using coss ui `<Textarea>`
4. `components/editor/editor-shell.tsx` — state owner, auto-save, split-pane layout
5. `lib/export.ts` + `lib/import.ts` — file download and file picker utilities
6. Toolbar component using `components/ui/toolbar.tsx`

---

## Planned Features (Not Yet Built)

Listed in rough priority order:

1. **Markdown Editor** — textarea or CodeMirror-based input panel for writing markdown
2. **Markmap Renderer** — SVG canvas using `markmap-view` + `markmap-lib`, real-time preview
3. **localStorage Auto-save** — debounced save on every keystroke, restore on load
4. **Manual Save / Load** — explicit save slots or named maps in localStorage
5. **Export** — download as `.md` file; optionally as JSON for full state (including zoom/pan)
6. **Import** — file picker, reads `.md` or Markymap JSON, loads into editor
7. **AI Assistant** — sidebar or modal; prompt → markmap generation; enhancement suggestions
8. **SEO Layer** — `generateMetadata()`, OG image via `app/opengraph-image.tsx`, `robots.ts`, `sitemap.ts`
9. **Toolbar** — formatting shortcuts, zoom controls, reset view, export/import buttons
10. **Settings** — sound toggle, theme preference, font size, map color scheme

---

## Architecture Notes For Upcoming Work

### Editor Architecture (when building)

- The editor should be a Client Component (requires `useState`, event handlers)
- The playground route (`app/(playground)/playground/page.tsx`) can remain a Server Component that renders client editor leaf nodes
- Split: `components/editor/markdown-input.tsx` (textarea/editor) + `components/editor/markmap-canvas.tsx` (SVG renderer)
- Shared state between input and canvas: use React state lifted to a shared parent, or a lightweight state store if complexity warrants it

### localStorage Strategy

- Key: `markymap:content` for the markdown string
- Key: `markymap:maps` for named/saved maps (JSON array)
- Always parse with a try/catch — localStorage can be unavailable (private browsing, quota exceeded)
- Debounce auto-save: 500ms after last keystroke

### AI Route Handler

- `app/api/ai/route.ts` — POST endpoint
- Accepts: `{ prompt: string, existingMarkdown?: string, mode: 'generate' | 'enhance' | 'suggest' }`
- Returns: streaming markdown response or JSON
- API key stored in `.env.local` as `AI_API_KEY` (or provider-specific name)
- Never expose the key to the client bundle

---

## Session 64 - Map PDF raster export fallback

- Map PDF export was still producing blank pages when the server printed static SVG markup, so the export path was changed again.
- The playground now rasterizes the live rendered SVG snapshot to a PNG data URL on the client immediately before `map/pdf` export.
- `app/api/export/map/pdf/route.ts` now prefers `imageDataUrl` and only falls back to `svgMarkup` or regenerated markmap HTML when a raster snapshot is unavailable.
- This keeps local/Vercel PDF generation on the same HTML-to-PDF pipeline while avoiding Chrome's unreliable SVG print behavior for the map document.

## Session 65 - Wait for raster image before map PDF print

- Opening the downloaded local PDF showed a broken-image placeholder and Chrome logged a `file:` origin warning.
- Web research indicated the `file:` warning is a local-file security behavior, while the more relevant issue is that CLI `--print-to-pdf` offers no hook to wait for embedded images to finish decoding before print.
- Local map PDF export now uses the browser-render path when an `imageDataUrl` snapshot is present, and `render-pdf.ts` explicitly waits for all `<img>` elements to report `complete` with `naturalWidth > 0` before `page.pdf()`.

## Session 66 - Remove unreliable export modes and move loading into menu

- `map/pdf` and `markdown/html` were removed from the playground and from the API surface after repeated reliability issues.
- Deleted the corresponding route handlers and the map-static PDF helper file, and simplified export payload types/validation back to markdown + optional JSON options only.
- Removed map SVG snapshot plumbing from the editor canvas and shell state because it only existed to support the dropped map PDF flow.
- Export loading is no longer shown in the editor shell status bar; the toolbar menu now keeps itself open during an export and replaces the clicked export row with an inline spinner state.
- Current supported playground exports are now `.json`, `.md`, `map .html`, and `markdown .pdf`.
