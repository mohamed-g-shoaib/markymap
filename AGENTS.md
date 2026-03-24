# AI Agent Guidelines

This guide provides the authoritative reference for all AI agents working in this codebase. Read this file **first**, before touching any code.

---

## Project Overview

**Markymap** is a modern, high-performance mindmap creation and editing application built with Next.js (App Router). It transforms Markdown into interactive, zoomable mindmaps using `markmap-lib` and `markmap-view`.

Key differentiators over existing markmap tooling:

- **Auto-save + localStorage persistence** — progress is never lost by accident; the map is always saved between sessions
- **Import / Export** — users can export their mindmap (as `.md` or proprietary format) and re-import it later for continued editing; this workflow did not exist in prior tools
- **Built-in AI assistant** — helps users enhance existing markmaps, generate new ones from prompts, or suggest improvements and new branches
- **Full dark/light mode** — powered by `next-themes`, with keyboard shortcut (`d`) to toggle; theme changes play a sound
- **Interaction sounds** — every click on interactive elements plays a soft click sound via the Web Audio API; theme toggle plays distinct on/off tones

---

### Tech Stack

| Concern                | Choice                                                        | Version                        |
| ---------------------- | ------------------------------------------------------------- | ------------------------------ |
| **Framework**          | Next.js App Router                                            | `16.2.1`                       |
| **Language**           | TypeScript (strict mode)                                      | `^6.0.2`                       |
| **Runtime**            | React                                                         | `^19.2.4`                      |
| **Styling**            | Tailwind CSS v4                                               | `^4.2.2`                       |
| **Tailwind animation** | tw-animate-css                                                | `^1.4.0`                       |
| **UI Components**      | coss ui (built on Base UI)                                    | components in `components/ui/` |
| **Base UI primitives** | `@base-ui/react`                                              | `^1.3.0`                       |
| **Icons**              | Hugeicons (`@hugeicons/react` + `@hugeicons/core-free-icons`) | `^1.1.6` / `^4.0.0`            |
| **Theme**              | next-themes                                                   | `^0.4.6`                       |
| **Package Manager**    | pnpm                                                          | (lockfile: `pnpm-lock.yaml`)   |
| **Linter**             | Oxlint                                                        | `^1.57.0`                      |
| **Formatter**          | Oxfmt                                                         | `^0.42.0`                      |
| **Class utilities**    | clsx + tailwind-merge via `cn()`                              | `^2.1.1` / `^3.5.0`            |
| **CVA**                | class-variance-authority                                      | `^0.7.1`                       |
| **Git hooks**          | simple-git-hooks + lint-staged                                | pre-commit runs fmt + lint     |
| **Build accelerator**  | Turbopack (`next dev --turbopack`)                            | —                              |

---

### Code Standards

- **TypeScript**: Strict mode enabled (`"strict": true`). No `any` unless absolutely necessary and explicitly justified. Use advanced types — read `.agents/skills/typescript-advanced-types/` skill.
- **Linter**: Oxlint with plugins: `eslint`, `unicorn`, `typescript`, `oxc`, `react`, `jsx-a11y`, `nextjs`, `import`. Config at `.oxlintrc.json`.
- **Formatter**: Oxfmt. Config at `.oxfmtrc.json`. Run `pnpm fmt` to format, `pnpm fmt:check` to check.
- **Path aliases**: `@/` maps to the project root (`tsconfig.json` `paths`).
- **File naming**: `kebab-case` for all files and directories. Component files use `.tsx`, utility/hook files use `.ts`.
- **Module type**: `"type": "module"` — ESM throughout.
- **No inline CSS**: Zero `style={{}}` attributes. All styling via Tailwind utility classes or shared `@utility` classes in `globals.css`.
- **No per-component style blocks**: All shared motion, layout, and interaction patterns live in `app/globals.css` as `@utility` definitions.
- **No custom components**: Never create a component that already exists in `components/ui/`. coss ui covers the full spectrum — buttons, dialogs, sheets, menus, tabs, toasts, sidebars, etc.

---

### Coding Guidelines

Follow these principles **without exception**:

1. **Server Components by default** — only add `"use client"` when the component genuinely requires browser APIs, event handlers, or React hooks. Keep client boundaries as leaf nodes.
2. **No `useEffect` without the skill** — before writing any `useEffect`, read `.agents/skills/react-useeffect/` in full. React 19's `useEffectEvent` is already used in this codebase (`theme-provider.tsx`) — prefer it over stale closure workarounds.
3. **Shared CSS utilities first** — before writing any motion, animation, or interaction styling, check `app/globals.css` for existing `@utility` classes (`motion-overlay-scale`, `motion-overlay-lift-blur`, `motion-disclosure-panel`, `motion-surface-interaction`, `motion-fade`, `motion-fade-blur`, `motion-layout-frame`, etc.).
4. **`cn()` for all class merging** — import from `@/lib/utils`. Never string-concatenate class names.
5. **Respect `prefers-reduced-motion`** — every animated `@utility` in `globals.css` already includes a `@media (prefers-reduced-motion: reduce)` block. New animations must do the same.
6. **Accessibility first** — use semantic HTML. Rely on Base UI's built-in accessibility rather than adding custom ARIA unless necessary. `jsx-a11y` rules are enforced by Oxlint.
7. **No deprecated patterns** — no `next/router` (use `next/navigation`), no `getServerSideProps`, no Pages Router conventions.
8. **Composition over prop drilling** — read `.agents/skills/vercel-composition-patterns/` before creating any component hierarchy.

---

## Project File Map

```
markymap/
├── app/
│   ├── favicon.ico
│   ├── globals.css          ← Single source of truth for all shared CSS, motion utilities, theme tokens
│   ├── layout.tsx           ← Root layout: local fonts (Google Sans variable + Google Sans Code variable), ThemeProvider
│   └── page.tsx             ← Entry page (currently scaffold)
├── components/
│   ├── ui/                  ← ALL coss ui components (DO NOT modify, DO NOT recreate)
│   │   ├── accordion.tsx
│   │   ├── alert-dialog.tsx
│   │   ├── alert.tsx
│   │   ├── autocomplete.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── breadcrumb.tsx
│   │   ├── button.tsx
│   │   ├── calendar.tsx
│   │   ├── card.tsx
│   │   ├── checkbox-group.tsx
│   │   ├── checkbox.tsx
│   │   ├── collapsible.tsx
│   │   ├── combobox.tsx
│   │   ├── command.tsx
│   │   ├── dialog.tsx
│   │   ├── drawer.tsx
│   │   ├── empty.tsx
│   │   ├── field.tsx
│   │   ├── fieldset.tsx
│   │   ├── form.tsx
│   │   ├── frame.tsx
│   │   ├── group.tsx
│   │   ├── input-group.tsx
│   │   ├── input.tsx
│   │   ├── kbd.tsx
│   │   ├── label.tsx
│   │   ├── menu.tsx
│   │   ├── meter.tsx
│   │   ├── number-field.tsx
│   │   ├── pagination.tsx
│   │   ├── popover.tsx
│   │   ├── preview-card.tsx
│   │   ├── progress.tsx
│   │   ├── radio-group.tsx
│   │   ├── scroll-area.tsx
│   │   ├── select.tsx
│   │   ├── separator.tsx
│   │   ├── sheet.tsx
│   │   ├── sidebar.tsx
│   │   ├── skeleton.tsx
│   │   ├── slider.tsx
│   │   ├── spinner.tsx
│   │   ├── switch.tsx
│   │   ├── table.tsx
│   │   ├── tabs.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   ├── toggle-group.tsx
│   │   ├── toggle.tsx
│   │   ├── toolbar.tsx
│   │   └── tooltip.tsx
│   └── theme-provider.tsx   ← Wraps next-themes; mounts ClickSound + ThemeHotkey with Web Audio
├── hooks/
│   ├── use-hover-capability.ts   ← useSyncExternalStore hook: true only on pointer+hover devices
│   └── use-sound.ts              ← Full-featured sound hook (play/stop/pause, volume, playbackRate, interrupt)
├── lib/
│   ├── audio/
│   │   ├── click-soft.ts         ← Base64-encoded click sound asset (SoundAsset)
│   │   ├── sound-engine.ts       ← Web Audio API engine: AudioContext singleton, buffer cache, playSound()
│   │   ├── sound-types.ts        ← TypeScript types: SoundAsset, UseSoundOptions, UseSoundReturn
│   │   ├── switch-off.ts         ← Base64-encoded theme-off sound asset
│   │   └── switch-on.ts          ← Base64-encoded theme-on sound asset
│   └── utils.ts                  ← cn() utility (clsx + tailwind-merge)
├── public/
│   └── fonts/
│       ├── google-sans-variable.ttf     ← --font-sans
│       └── google-sans-code-variable.ttf ← --font-mono
├── spec/
│   ├── base-ui/             ← Base UI handbook: hooks, concepts, API usage
│   ├── references/          ← Design philosophy references (Emil, Dimi)
│   ├── context.md           ← Persistent agent working memory — UPDATE AFTER EVERY SIGNIFICANT TASK
│   ├── skills.md            ← Index of all available agent skills with summaries
│   └── styling.md           ← coss ui color system and theming guide
├── .agents/
│   └── skills/              ← Agent skill files (read before relevant tasks)
│       ├── coss/
│       ├── emil-design-eng/
│       ├── fixing-motion-performance/
│       ├── make-interfaces-feel-better/
│       ├── next-best-practices/
│       ├── react-useeffect/
│       ├── seo-audit/
│       ├── tailwind-css-patterns/
│       ├── tailwind-design-system/
│       ├── tailwindcss-advanced-layouts/
│       ├── typescript-advanced-types/
│       ├── userinterface-wiki/
│       ├── vercel-composition-patterns/
│       └── vercel-react-best-practices/
├── .oxlintrc.json           ← Oxlint config (react, jsx-a11y, nextjs, import, unicorn plugins)
├── .oxfmtrc.json            ← Oxfmt config
├── components.json          ← coss ui / shadcn CLI config
├── next.config.mjs          ← Minimal Next.js config (ESM)
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── skills-lock.json
└── tsconfig.json            ← Strict TS, bundler module resolution, @/ alias
```

---

## Skills Directory

Skills are located at `.agents/skills/`. Always consult `spec/skills.md` to find the right skill index before diving into a task.

### Mandatory Skill Reads by Task Type

| Task                            | Skills to read first                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Any React code                  | `.agents/skills/vercel-react-best-practices/` + `.agents/skills/next-best-practices/`                                    |
| Any `useEffect`                 | `.agents/skills/react-useeffect/`                                                                                        |
| Creating any new component      | `.agents/skills/vercel-composition-patterns/`                                                                            |
| Any UI/UX design or engineering | `.agents/skills/emil-design-eng/` + `.agents/skills/make-interfaces-feel-better/` + `.agents/skills/userinterface-wiki/` |
| Anything coss ui related        | `.agents/skills/coss/`                                                                                                   |
| Animation / motion              | `.agents/skills/fixing-motion-performance/`                                                                              |
| Tailwind classes                | `.agents/skills/tailwind-css-patterns/` + `.agents/skills/tailwind-design-system/`                                       |
| Complex layouts                 | `.agents/skills/tailwindcss-advanced-layouts/`                                                                           |
| TypeScript types                | `.agents/skills/typescript-advanced-types/`                                                                              |
| SEO / metadata                  | `.agents/skills/seo-audit/`                                                                                              |

---

## Interaction & Sound System

This project treats **interactions and sounds** as first-class citizens of the UX.

### Click Sounds

- `components/theme-provider.tsx` → `<ClickSound />` listens on `document` (capture phase) for any click on a matching interactive element (buttons, links, menu items, switches, tabs, etc.)
- Plays `clickSoftSound` via `useSound` with `interrupt: true`
- To **opt out** a specific element, add `data-click-sound="off"` to it
- Disabled elements (`:disabled`, `[aria-disabled='true']`, `[data-disabled]`) are automatically skipped

### Theme Sounds

- `<ThemeHotkey />` listens for the `d` key (global, non-modifier, non-typing-target)
- Dark → Light: plays `switchOnSound`
- Light → Dark: plays `switchOffSound`
- Theme is managed by `next-themes` with `attribute="class"`, `defaultTheme="system"`, `enableSystem`

### Sound Engine (`lib/audio/sound-engine.ts`)

- Singleton `AudioContext` — created lazily, resumed if suspended
- Buffer cache (`Map<string, AudioBuffer>`) — each sound asset is decoded and cached once
- `decodeAudioData(dataUri)` — accepts base64 data URIs, handles concurrent decode via promise cache
- `playSound(dataUri, options)` — returns `{ stop }` handle
- Sound assets are base64-encoded TS files in `lib/audio/` exporting a `SoundAsset` object

### `useSound` Hook (`hooks/use-sound.ts`)

- Accepts a `SoundAsset`, returns `[play, { stop, pause, isPlaying, duration, sound }]`
- Options: `volume`, `playbackRate`, `interrupt`, `soundEnabled`, `onPlay`, `onEnd`, `onPause`, `onStop`
- Decodes audio on mount; safe to call `play()` synchronously after mount
- Cleans up the source node on unmount

### `useHoverCapability` Hook (`hooks/use-hover-capability.ts`)

- Returns `true` only on devices with hover + fine pointer (desktop mouse)
- Uses `useSyncExternalStore` — SSR-safe (server snapshot returns `false`)
- Use this to gate hover-only interactions / animations

---

## Styling System

### Fonts

- **Sans**: `Google Sans Variable` → loaded via `next/font/local`, variable `--font-sans`
- **Mono**: `Google Sans Code Variable` → loaded via `next/font/local`, variable `--font-mono`
- Both applied on `<html>` in `app/layout.tsx` via `cn()`

### Theme Tokens (CSS Variables)

All tokens are defined in `app/globals.css`. Key tokens:

| Token                                  | Purpose                                                                        |
| -------------------------------------- | ------------------------------------------------------------------------------ |
| `--background` / `--foreground`        | Page surface and primary text                                                  |
| `--card` / `--card-foreground`         | Card surface                                                                   |
| `--popover` / `--popover-foreground`   | Popover/dropdown surface                                                       |
| `--primary` / `--primary-foreground`   | Primary action color                                                           |
| `--muted` / `--muted-foreground`       | Subdued backgrounds and text                                                   |
| `--border`                             | Opaque-alpha border (black/white alpha)                                        |
| `--input`                              | Input border                                                                   |
| `--ring`                               | Focus ring                                                                     |
| `--radius`                             | Base radius (`0.625rem`); variants `sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl` |
| `--surface-shadow-sm/md`               | Layered box shadows with alpha mixing                                          |
| `--motion-duration-fast/medium/layout` | `140ms` / `180ms` / `220ms`                                                    |
| `--ease-out` / `--ease-in-out`         | Custom bezier curves                                                           |

Dark mode: uses `.dark` class selector (set by next-themes on `<html>`).
Custom variant: `@custom-variant dark (&:is(.dark *))` — use `dark:` prefix in Tailwind.

### Shared Motion Utilities (`app/globals.css`)

Always use these before inventing new transition classes:

| Utility class                | Use case                                            |
| ---------------------------- | --------------------------------------------------- |
| `motion-overlay-scale`       | Scale-in/out for modals, dialogs                    |
| `motion-overlay-lift-blur`   | Lift+blur for popovers, dropdowns                   |
| `motion-disclosure-panel`    | Height animation for accordions, collapsibles       |
| `motion-disclosure-chevron`  | Rotating chevron indicator                          |
| `motion-surface-interaction` | Bg/color/shadow transitions on interactive surfaces |
| `motion-interactive-color`   | Fast color-only transitions                         |
| `motion-layout-frame`        | Size/position transitions for layout shifts         |
| `motion-fade`                | Opacity-only fade                                   |
| `motion-fade-blur`           | Opacity + blur fade                                 |

### Shared Text Utilities

| Utility class | Use case                                          |
| ------------- | ------------------------------------------------- |
| `text-link`   | Styled anchor with underline, hover, focus states |
| `text-action` | Muted-to-foreground action text                   |

### Click Interaction

All interactive elements (`a[href]`, `button`, `[role="button"]`, etc.) get:

- `scale: 0.97` on `:active` — defined globally in `@layer base`, never repeat per component
- `transition-duration: 160ms` on `transform, scale`
- Disabled via `@media (prefers-reduced-motion: reduce)`

---

## Working with coss ui

### Golden Rules

1. **Never create a component that exists in `components/ui/`**. The library covers: accordion, alert-dialog, alert, autocomplete, avatar, badge, breadcrumb, button, calendar, card, checkbox-group, checkbox, collapsible, combobox, command, dialog, drawer, empty, field, fieldset, form, frame, group, input-group, input, kbd, label, menu, meter, number-field, pagination, popover, preview-card, progress, radio-group, scroll-area, select, separator, sheet, sidebar, skeleton, slider, spinner, switch, table, tabs, textarea, toast, toggle-group, toggle, toolbar, tooltip.
2. **Read the coss skill first** — `.agents/skills/coss/` — before using any component.
3. **Read `spec/base-ui/`** — for Base UI hooks, concepts, and render prop APIs that underpin coss ui.
4. coss ui components use `data-slot` attributes for internal targeting; do not override internal structure.
5. Portaled components (Dialog, Sheet, Popover, Select, etc.) require stacking context isolation — already provided by the `<body>` base styles in `globals.css` (`isolate`).

---

## Working with Next.js App Router

- All pages live in `app/` using the App Router file conventions (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, etc.)
- Dynamic metadata and OG image generation are planned — use `generateMetadata()` (async export) in `page.tsx`/`layout.tsx`
- SEO files (`robots.ts`, `sitemap.ts`, `opengraph-image.tsx`) go in `app/`
- Client components must be leaf nodes — keep `"use client"` as low as possible in the tree
- Use `next/image` (never `<img>`) for all raster images
- Use `next/font/local` for all fonts (already configured)
- Turbopack is active in dev — avoid webpack-specific plugins in `next.config.mjs`
- Before writing Next.js code, always read `.agents/skills/next-best-practices/`

---

## Environment and Configuration

### Environment Variables

The project uses a `.env.local` file (not committed). See `.env.example` for required variables (to be created as features are added).

**Core Application**:

- _(none yet — will be added as AI integration and other features are built)_

**External Services**:

- _(AI provider API key will be required when AI features are implemented)_

### Git Hooks

Configured via `simple-git-hooks` + `lint-staged`:

- **pre-commit**: runs `oxfmt` (format all files) + `oxlint --fix` (lint and auto-fix JS/TS files)
- Run `pnpm prepare` to install hooks after fresh clone

---

## Common Tasks

### Adding a New Page

1. Create `app/<route>/page.tsx` (Server Component by default)
2. Export `generateMetadata()` for SEO
3. Use existing coss ui components from `components/ui/`
4. Apply shared Tailwind utilities and motion classes from `globals.css`
5. Read `.agents/skills/next-best-practices/` + `.agents/skills/seo-audit/`

### Adding a New Feature Component

1. Read `.agents/skills/vercel-composition-patterns/` first
2. Check `components/ui/` — do NOT reinvent what exists
3. Place feature components in `components/<feature-name>/` (kebab-case directory)
4. Use `"use client"` only if necessary; prefer RSC
5. Import sounds from `lib/audio/` and `useSound` hook if interaction sounds are needed

### Adding a New Sound

1. Encode audio as base64 data URI
2. Create `lib/audio/<name>.ts` exporting a `SoundAsset` (see `sound-types.ts` for shape)
3. Use `useSound()` hook to play it — never instantiate `AudioContext` directly in components

### Implementing the Markmap Editor (planned)

- Use `markmap-lib` for Markdown → markmap data transform
- Use `markmap-view` for SVG rendering and interactivity
- Persist state to `localStorage` with debounced auto-save
- Implement manual export (`.md` download) and import (file picker → localStorage load)
- AI integration: call AI provider API from a Route Handler (`app/api/ai/route.ts`), never from the client directly (hides API key)

---

## Styling Guidelines

1. **No inline styles** — `style={{}}` is forbidden. Use Tailwind classes or `globals.css` utilities.
2. **No component-scoped CSS** — no CSS Modules, no `styled-components`, no `emotion`.
3. **Shared `@utility` for reusable patterns** — if you find yourself writing the same motion/animation pattern twice, it belongs in `globals.css` as a `@utility`.
4. **Color tokens always** — never use raw Tailwind color values (e.g. `bg-gray-100`) where a semantic token exists. Prefer `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, etc.
5. **Alpha via `color-mix`** — the design system uses `color-mix(in srgb, ...)` for alpha variants; match this pattern.
6. **Dark mode**: use `dark:` Tailwind prefix. The custom variant `@custom-variant dark (&:is(.dark *))` is already registered.
7. **Radius scale**: use `rounded-sm`, `rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-4xl` — mapped to CSS variable scale.

---

## Important Notes

### Performance Considerations

- **AudioContext is a singleton** — never create multiple instances. `getAudioContext()` in `sound-engine.ts` handles this.
- **Buffer caching** — audio buffers are decoded once and cached; do not pre-load sounds eagerly unless required.
- **`useHoverCapability`** — gates hover-only interactions to avoid phantom hovers on touch devices.
- **Server Components default** — keeping components server-side reduces JS bundle size; only opt into client when required.
- **Turbopack in dev** — do not add Webpack-only configurations.
- **`will-change` sparingly** — only on elements that animate frequently. The `motion-disclosure-content` class uses `will-change: opacity, transform, filter` intentionally.

### Critical Red Lines

These are hard rules. Violating them degrades code quality irreversibly:

- **Never assume a package exists** — always check `package.json` before importing. Never install a package without verifying there is no existing solution in the stack.
- **Never create a custom UI component** if one exists in `components/ui/` — read the coss skill.
- **Never write `useEffect` without reading the useEffect skill first** — stale closures and misused effects are the #1 source of bugs in React 19.
- **Never use inline styles or per-component CSS** — everything shared, everything in `globals.css`.
- **Never use `next/router`** — this is App Router only. Use `next/navigation`.
- **Never use `<img>`** — always `next/image`.
- **Never hardcode API keys** — use environment variables, and call external APIs from Route Handlers only.
- **Never use Radix UI** — this project uses Base UI via coss ui. They are different primitives with different APIs.
- **Never push back on the stack** — the choices are final: Next.js App Router, React 19, Tailwind v4, coss ui / Base UI, Oxlint, Oxfmt, pnpm.

### Spec-Driven Development

- Keep `spec/context.md` up to date after every significant task — it is the agent's persistent working memory.
- If a task is large enough, create a `spec/feature-plan.md` before writing code.
- Source of truth order: `AGENTS.md` → `spec/context.md` → `spec/skills.md` → `spec/styling.md`.
