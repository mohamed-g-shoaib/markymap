# Project Context

> **This file is the persistent working-memory document for this repository.**
> Read it at the start of every session before touching any code. Update it after every significant task, decision, or discovery. It is the single most important file for maintaining quality across long conversations and resumed sessions.

> **Last updated:** After Session 4 — landing page wireframe spec created and skills-audited.

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

### What Exists Today (Scaffold Phase)

The project is in its **initial scaffold state**. The infrastructure is fully set up and production-quality; application features have not yet been built.

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

**Packages staged for next session:**

- `markmap-lib` and `markmap-view` — NOT YET INSTALLED. Run `pnpm add markmap-lib markmap-view` as first step of editor/landing-demo implementation.
- `motion` (Framer Motion) — NOT needed for landing page. Landing page uses CSS transitions + IntersectionObserver only.

**Application Features — NOT YET BUILT:**

- Markmap editor (markdown → interactive mindmap)
- localStorage persistence layer
- Auto-save logic
- Import / Export UI and logic
- AI integration (route handler + UI)
- Navigation / routing beyond the root page
- SEO metadata, OG image, robots.txt, sitemap
- Any real page content beyond the scaffold `app/page.tsx`

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

| File                            | Why It Matters                                                                 |
| ------------------------------- | ------------------------------------------------------------------------------ |
| `app/globals.css`               | All shared CSS, design tokens, motion utilities — the style bible              |
| `app/layout.tsx`                | Root layout: fonts, ThemeProvider wrapper, html attributes                     |
| `app/page.tsx`                  | Entry page — currently scaffold, to be replaced with editor UI                 |
| `components/theme-provider.tsx` | Sound system wiring, theme hotkey, click sound delegation                      |
| `components/ui/`                | All available UI components — check here before building anything              |
| `lib/audio/sound-engine.ts`     | Audio API: `getAudioContext()`, `decodeAudioData()`, `playSound()`             |
| `lib/audio/sound-types.ts`      | `SoundAsset`, `UseSoundOptions`, `UseSoundReturn` type definitions             |
| `hooks/use-sound.ts`            | Sound hook — use this for all sound playback in components                     |
| `hooks/use-hover-capability.ts` | Pointer capability detection hook                                              |
| `hooks/use-media-query.ts`      | Media query hook — `useSyncExternalStore`, SSR-safe, reactive to query changes |
| `lib/utils.ts`                  | `cn()` — always use for class merging                                          |
| `package.json`                  | Dependency reality — check here before assuming a package exists               |
| `spec/skills.md`                | Full skill index — consult before starting any non-trivial task                |

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
- Three new hooks are needed before building the landing page: `hooks/use-in-view.ts`, `hooks/use-scroll-y.ts`, `hooks/use-carousel-controls.ts` — all use `useSyncExternalStore` or `IntersectionObserver`, all SSR-safe.
- The `useEffectEvent` pattern (React 19) is already in use in `theme-provider.tsx` — prefer it over dependency array gymnastics for event handlers inside effects.
- `markmap-lib` and `markmap-view` are **not yet installed** — run `pnpm add markmap-lib markmap-view` as the very first step of the editor build. Full API reference is at `spec/markmap-packages/context.md`.
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
- **Sections:** NAV → HERO → LIVE DEMO → HOW IT WORKS → FINAL CTA → FOOTER
- **Demo:** A real live split-panel markmap (textarea + SVG canvas) using `markmap-lib` + `markmap-view`, seeded with the Markymap features map, saved to `markymap:demo:content` in localStorage
- **Animation:** CSS transitions + IntersectionObserver only via `hooks/use-in-view.ts`. No `motion` library.
- **New hooks needed:** `hooks/use-in-view.ts`, `hooks/use-scroll-y.ts`, `hooks/use-carousel-controls.ts`
- **Copy:** "Markdown that maps itself." / "Write in plain markdown. It becomes an interactive, zoomable mindmap — instantly. Auto-saved. Always yours."
- **Anti-patterns documented:** No gradient text, no hero image, no email capture, no blob backgrounds, no inline styles, no arbitrary Tailwind values

### Editor Implementation — Ready to Build

The markmap research is complete. The next session should execute Tasks 1–9 from
`spec/markmap-packages/context.md` in order:

**Build order (landing page first, then editor):**

**Landing page:**

1.  Create route group `app/(marketing)/` with `page.tsx` + `layout.tsx`
2.  Create route group `app/(playground)/playground/` with `page.tsx` + `layout.tsx`
3.  `hooks/use-in-view.ts` — IntersectionObserver, returns `[ref, isInView]`
4.  `hooks/use-scroll-y.ts` — `useSyncExternalStore` scroll position, SSR-safe
5.  `hooks/use-carousel-controls.ts` — carousel scroll state tracker
6.  `app/(marketing)/ui/page-container.tsx` — layout utility
7.  `app/(marketing)/ui/nav.tsx` — fixed nav, scroll-aware styling
8.  `app/(marketing)/ui/hero.tsx` — headline, sub, CTAs, CSS stagger animation
9.  `pnpm add markmap-lib markmap-view` — required for demo section
10. `app/(marketing)/ui/demo-seed.ts` — DEMO_SEED markdown constant
11. `app/(marketing)/ui/demo.tsx` — live split-panel markmap (`"use client"`)
12. `app/(marketing)/ui/how-it-works.tsx` + step visuals
13. `app/(marketing)/ui/final-cta.tsx`
14. `app/(marketing)/ui/footer.tsx` — theme toggle, sounds, wordmark watermark

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
- The outer page (`app/page.tsx`) can remain a Server Component that renders the editor as a leaf
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
