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
