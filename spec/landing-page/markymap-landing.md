# Wireframe — Markymap Landing Page

> **Route:** `/`
> **File:** `app/(marketing)/page.tsx`
> **Audience:** First-time visitors discovering the tool. No auth, no waitlist, no account required.
> **CTA target:** `/playground` — the Markymap editor.
> **Purpose:** Communicate what Markymap does, prove it works, remove every reason not to try it.

---

## Source Files Read Before Writing This Spec

- `.agents/skills/emil-design-eng/SKILL.md`
- `.agents/skills/make-interfaces-feel-better/SKILL.md`, `animations.md`, `surfaces.md`
- `.agents/skills/userinterface-wiki/AGENTS.md`
- `.agents/skills/coss/SKILL.md`
- `spec/references/emilkowalski.md`
- `spec/references/dimi.md`
- `spec/landing-page/index.md` (reference wireframe from Rootly project — read for patterns only)
- `spec/base-ui/animation.md`, `spec/base-ui/styling.md`
- `app/globals.css` (shared motion utilities and interaction classes)

---

## Design Philosophy (Distilled From All References)

This page has one job: get the visitor into the editor. Everything else is in the way.

The design follows Emil's editorial calm and Dimi's platform minimalism. It does not look like a SaaS marketing page. It does not try to close a sale. It invites.

```
The interactive demo section is the most important element on the page.
Everything before it builds anticipation. Everything after it reinforces confidence.
The demo IS the proof. Copy only points to it.
```

**Tone:** Precise, quiet, confident. Like a tool that doesn't need to explain itself much because you can just use it.

**What it is not:**

- Not a pitch deck
- Not a feature catalogue
- Not a startup landing page with gradient text and animated blobs
- Not a product comparison
- Not a waitlist

---

## Global Design Rules

```
🚫 NEVER write custom CSS classes for colors, typography, spacing, shadows, or borders.
🚫 NEVER override or extend any coss ui token, class, or component style.
🚫 NEVER use arbitrary Tailwind values (e.g. w-[543px], text-[13px]) for visual styling.
🚫 NEVER import or use any UI library other than coss ui (no shadcn standalone, no MUI, no Chakra, no Radix standalone).
🚫 NEVER use inline styles (style={{}}) — forbidden across the entire project.
🚫 NEVER use gradient text. No bg-gradient-to-r on text ever.
🚫 NEVER animate from scale(0). Minimum enter scale is scale(0.96).
🚫 NEVER use transition: all. List transition properties explicitly.
🚫 NEVER add looping background animations or auto-playing elements.
🚫 NEVER add a competitor comparison table, pricing section, or email capture.
✅ ALWAYS use coss ui components from components/ui/ exactly as documented.
✅ ALWAYS use coss ui design tokens for spacing, color, and typography.
✅ ALWAYS use shared motion @utility classes from app/globals.css before inventing new ones.
✅ ALWAYS respect prefers-reduced-motion — fall back to opacity-only, never disable entirely.
✅ ALWAYS use text-wrap: balance on headings (already applied globally in globals.css).
```

---

## Motion Dependency

The project does **not** currently have `motion` (Framer Motion) installed.

All scroll-reveal animations on this page use a lightweight `useInView` hook built on `IntersectionObserver`, paired with CSS transitions defined in `globals.css`. Do NOT install `motion` or `framer-motion` for this page.

Animation pattern for scroll reveals:

- Observe via `IntersectionObserver`, `{ once: true, threshold: 0.15 }`
- On enter: add a CSS class that transitions `opacity` from `0` to `1` and `transform: translateY(12px)` to `translateY(0)` and `filter: blur(4px)` to `blur(0)`
- Use `transition-property: opacity, transform, filter` — never `transition: all`
- Easing: `var(--ease-out)` which is `cubic-bezier(0.23, 1, 0.32, 1)` (already in globals.css)
- Duration: `400ms` for sections, `500ms` for the demo container
- Stagger: each semantic block in a section enters with `+100ms` delay from the previous

Place the `useInView` hook at `hooks/use-in-view.ts`. It returns `[ref, isInView]`.

For hero section: animate on mount (not scroll), no `IntersectionObserver` needed.

```
Hero:      opacity + translateY(12px) + blur(4px) → enter on mount
Sections:  opacity + translateY(12px) + blur(4px) → enter when 15% of section is visible
Demo:      opacity + translateY(20px)              → enter when 15% visible, 500ms
Footer:    no entrance animation
```

---

## Page Layout Overview

```
┌─────────────────────────────────────────────────────────────────┐
│  NAV                                                            │
│  Logo wordmark                     GitHub ↗   Open editor →    │
├─────────────────────────────────────────────────────────────────┤
│  HERO                                                           │
│  Headline + sub + two CTAs                                      │
├─────────────────────────────────────────────────────────────────┤
│  LIVE DEMO                                                      │
│  id="demo"                                                      │
│  Split panel: markdown textarea ← → interactive markmap SVG    │
│  (Real markmap-lib + markmap-view, pre-seeded content)          │
├─────────────────────────────────────────────────────────────────┤
│  HOW IT WORKS                                                   │
│  4-step horizontal scroll carousel                              │
├─────────────────────────────────────────────────────────────────┤
│  FINAL CTA                                                      │
│  Card with statement + single button                            │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER                                                         │
│  Logo + links + theme toggle + wordmark watermark               │
└─────────────────────────────────────────────────────────────────┘
```

All sections use a `PageContainer` wrapper for consistent max-width. The `PageContainer` is a simple `div` with `mx-auto w-full max-w-6xl px-4 sm:px-6`.

---

## Section 1 — Nav

### Layout

Fixed at top. Full-width. Transparent until scrolled.

```
[ Markymap wordmark ]                     [ GitHub ↗ ]  [ Open editor → ]
```

- **Left:** "Markymap" text in `text-sm font-medium text-foreground`, wrapped in `next/link` pointing to `/`. No icon — the wordmark is the identity.
- **Right:**
  - Ghost/outline button: `GitHub` with `SourceCodeIcon` (Hugeicons) — links to the GitHub repo, `target="_blank" rel="noopener noreferrer"`. Hidden on mobile (`hidden sm:inline-flex`).
  - Primary button: `Open editor` with `ArrowRight01Icon` (Hugeicons) — links to `/playground`.
- Nav height: `h-14`.
- Container: `PageContainer` inside a `<header>` that is `fixed top-0 inset-x-0 z-50`.

### Scroll Behavior

Below 48px scroll: `border-b border-transparent bg-transparent`.
Above 48px scroll: `border-b border-border bg-background/80 backdrop-blur-sm`.

Transition: `transition-[border-color,background-color]` with `duration-200 ease-out`. CSS only — no JS animation library.

Implement with a `useScrollY` hook at `hooks/use-scroll-y.ts` that returns `scrollY` using `useSyncExternalStore`. SSR-safe: server snapshot returns `0`.

### Implementation Notes

- File: `app/(marketing)/ui/nav.tsx`
- Uses: `Button` from `components/ui/button`, `HugeiconsIcon` from `@hugeicons/react`
- Icons: `SourceCodeIcon`, `ArrowRight01Icon` from `@hugeicons/core-free-icons`
- No `motion`, no animation library. Pure CSS transition on scroll.

---

## Section 2 — Hero

### Purpose

Communicate what Markymap does in under five words. Get the visitor to scroll to the demo. That is it.

### Layout (desktop)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  Markdown that maps itself.                                     │
│                                                                 │
│  Write in plain markdown. It becomes an interactive,           │
│  zoomable mindmap — instantly. Auto-saved. Always yours.       │
│                                                                 │
│  [ Open editor → ]   [ See it live ↓ ]                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Copy

- **Headline:** `Markdown that maps itself.`
  - `text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl`
  - Left-aligned on desktop, centered on mobile via `text-center sm:text-left`
  - `text-wrap: balance` (applied globally to all headings in `globals.css`)
  - No gradient. No decoration. Just type.

- **Subheadline:** `Write in plain markdown. It becomes an interactive, zoomable mindmap — instantly. Auto-saved. Always yours.`
  - `text-base text-muted-foreground sm:text-lg max-w-xl`
  - `text-wrap: pretty` for the body line (applied globally in `globals.css`)

- **CTAs:**
  - Primary: `Open editor` with `ArrowRight01Icon` → `/playground`
  - Ghost: `See it live` with `ArrowDown01Icon` → `#demo` (smooth scroll via `scroll-behavior: smooth` on `<html>`)
  - Layout: `flex flex-col gap-3 sm:flex-row sm:gap-4`

### Top Padding

`pt-32 pb-16` — gives the hero room beneath the fixed nav.

### Entrance Animation (on mount, not scroll)

Each block enters independently, not as a single container. Split and stagger:

```
Headline:       opacity 0→1, translateY(12px)→0, blur(4px)→0   400ms  ease-out  delay: 0ms
Subheadline:    opacity 0→1, translateY(12px)→0, blur(4px)→0   400ms  ease-out  delay: 100ms
CTA wrapper:    opacity 0→1, translateY(12px)→0, blur(4px)→0   400ms  ease-out  delay: 200ms
```

Implement with CSS `@keyframes fadeInUp` animation and `animation-fill-mode: both`. Define it in `globals.css` as a `@utility` named `animate-hero-enter`:

```css
@utility animate-hero-enter {
  animation: hero-enter 400ms var(--ease-out) both;
}

@keyframes hero-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
    filter: blur(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    filter: blur(0);
  }
}
```

Apply `animate-hero-enter` + `[animation-delay:Xms]` directly on each block. No JS needed for the hero.

Respect `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  @keyframes hero-enter {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
```

### Implementation Notes

- File: `app/(marketing)/ui/hero.tsx`
- No dependencies beyond coss ui `Button` and `HugeiconsIcon`

---

## Section 3 — Live Demo

### Purpose

This is the entire product argument. A visitor who interacts with the demo for 30 seconds understands the value better than any copy could explain. It is not a screenshot. It is not a video. It is the real thing.

### id and scroll anchor

```html
<section id="demo" class="pt-14"></section>
```

The `See it live ↓` hero CTA smooth-scrolls to `#demo`.

### Label Above the Demo

```
"No account needed. Edit the markdown and watch it map."
```

- `text-sm text-muted-foreground text-center mb-4`

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  id="demo"                                                      │
│                                                                 │
│  "No account needed. Edit the markdown and watch it map."       │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐     │
│  │  [ ● ● ●   markymap.app/playground                ]    │     │  ← Browser chrome (sm+ only)
│  │  ┌──────────────────┬─────────────────────────────┐    │     │
│  │  │  Markdown input  │  Markmap SVG canvas          │    │     │
│  │  │                  │                              │    │     │
│  │  │  (textarea)      │  (interactive SVG)           │    │     │
│  │  │                  │                              │    │     │
│  │  └──────────────────┴─────────────────────────────┘    │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Container and Sizing

- Outer: coss ui `Card` from `components/ui/card.tsx` with `overflow-hidden` and `shadow` (uses `--surface-shadow-sm` token).
- Card has **no** fixed pixel height. The content area drives the height.
- Inner content: `relative bg-background` with `min-h-[480px] sm:min-h-[560px]`.
- Split layout on `sm:` and above: `grid sm:grid-cols-2`. On mobile: stacked, markdown input first, canvas second.
- Resize handle between panels: implement as a draggable `<div>` with `cursor-col-resize` and `w-px bg-border` on desktop only. On mobile: no resize handle, panels stack vertically with a `Separator` between them.

### Browser Chrome Top Bar

Rendered only on `sm:` and above (`hidden sm:flex`):

- Three traffic-light dots: `size-3 rounded-full` in `bg-destructive/60`, `bg-warning/60`, `bg-success/60` — decorative, no action.
- Mock URL: `markymap.app/playground` — static string, `text-xs text-muted-foreground`.
- Background: `bg-muted/40 border-b border-border px-4 py-2.5 flex items-center gap-2`.
- Right spacer: `w-16` for visual symmetry.

### Markdown Input Panel

- A controlled `<textarea>` or a simple CodeMirror-less textarea (no syntax highlighting for the demo — keep it simple and dependency-free).
- Style: `w-full h-full resize-none border-0 bg-transparent p-4 text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none`.
- Coss ui `ScrollArea` wrapping the textarea panel to prevent the panel from expanding the outer card.
- On change: debounce 300ms then update the markmap.
- Panel header (sticky): `"Markdown"` label (`text-xs font-medium text-muted-foreground uppercase tracking-wide`) on the left, character count on the right (`text-xs text-muted-foreground tabular-nums`).

### Markmap Canvas Panel

- A `<svg>` element sized to fill the panel: `size-full` (Tailwind `w-full h-full`).
- Powered by `markmap-lib` (Transformer) + `markmap-view` (Markmap.create).
- Module-level `Transformer` singleton (see `spec/markmap-packages/context.md`).
- Mount: create instance. Update: `mm.setData(root)`. Destroy on unmount.
- On mobile (stacked layout): SVG height is `min-h-[300px]`.
- Panel header (sticky): `"Map"` label on the left, `Fit` icon button (`ScanIcon` from Hugeicons) on the right that calls `mm.fit()`.
- `"use client"` on this entire demo component.

### Demo Store (localStorage)

- Namespace key: `markymap:demo:content`
- On mount: load from localStorage if present, else use seed content.
- Seed content is a constant defined in `app/(marketing)/ui/demo-seed.ts`.
- Save to localStorage after debounce (300ms) on every change.
- Wrap all localStorage calls in try/catch.
- Do NOT use `useEffect` to load initial content — use lazy `useState` initializer:
  ```ts
  const [markdown, setMarkdown] = useState(() => {
    try {
      return localStorage.getItem("markymap:demo:content") ?? DEMO_SEED
    } catch {
      return DEMO_SEED
    }
  })
  ```

### Seed Content (`demo-seed.ts`)

The seed markdown maps Markymap itself — the product explaining itself through its own medium:

```markdown
# Markymap

## Write

- Plain markdown
- Familiar syntax
- Headings become branches
- Lists become nodes

## Visualize

- Interactive SVG
- Pan and zoom
- Fold and unfold
- Instant preview

## Save

- Auto-saves locally
- Never lose progress
- No account needed
- Always where you left it

## Share

- Export as .md
- Import to continue
- Works on any machine

## AI (coming)

- Generate from prompt
- Enhance existing maps
- Suggest new branches
```

This seed is chosen because:

1. It demonstrates real branching depth (3 levels)
2. It is about the product itself — visitors see Markymap explaining Markymap
3. It is short enough to fit in the visible viewport without scrolling
4. "Write / Visualize / Save / Share / AI" maps exactly to the product differentiators

### Entrance Animation

The entire Card wrapper:

```
opacity 0→1, translateY(20px)→0   500ms   ease-out   whileInView threshold: 0.15   once
```

CSS implementation via `useInView` hook + class toggle. No blur on the demo (too heavy for an SVG canvas).

### Implementation Notes

- File: `app/(marketing)/ui/demo.tsx`
- Imports: `Transformer` from `markmap-lib`, `Markmap, loadCSS, loadJS, deriveOptions` from `markmap-view`
- Requires: `pnpm add markmap-lib markmap-view` (not yet installed — first step of implementation)
- Uses coss ui: `Card`, `ScrollArea`, `Button`, `Separator`
- `"use client"` on the entire file
- Do NOT import or modify any component from `components/editor/` — this is a self-contained landing-page demo

---

## Section 4 — How It Works

### Purpose

Reinforce the value proposition for visitors who want to understand the workflow before committing to the editor. Four clear steps. No jargon.

### Layout

```
How it works

[ ← ] [ → ]

┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  →
│ [Visual] │  │ [Visual] │  │ [Visual] │  │ [Visual] │
│          │  │          │  │          │  │          │
│ Step N   │  │ Step N   │  │ Step N   │  │ Step N   │
│ Title    │  │ Title    │  │ Title    │  │ Title    │
│ Body     │  │ Body     │  │ Body     │  │ Body     │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

- Section title: `"How it works"` — `text-2xl font-semibold tracking-tight`
- Subtitle: `"Write markdown once. Understand it forever."` — `text-sm text-muted-foreground mt-1`
- Prev / Next buttons: coss ui `Button` with `variant="ghost" size="icon"` using `ArrowLeft01Icon` / `ArrowRight01Icon`. Rendered below the subtitle, above the carousel. Disabled state wired to scroll position (see carousel behavior).
- Carousel: `flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none]`.
- Cards: `w-72 sm:w-80 shrink-0 snap-start`. Wrapped in coss ui `Card`.
- Trailing padding: `pe-12 sm:pe-20` to hint at the next card.

### The 4 Steps

#### Step 1 — Write markdown

```
Visual: A minimal code block showing markdown syntax.
        Lines animate in sequentially on card enter.

  # Project Plan
  ## Goals
  - Ship v1
  - Write docs
  ## Risks
  - Scope creep

Title: Write markdown
Body:  Use the syntax you already know. Headings become branches. Lists become nodes.
```

**Visual implementation:** A `<pre>` block with `font-mono text-xs text-foreground` inside a `Card` with `bg-muted/40`. Lines stagger in with `animation-delay` when the card enters the viewport. No interactive elements on this card.

#### Step 2 — See the map

```
Visual: A miniature static markmap SVG.
        Pre-rendered, not live. Shows a 2-level tree with 4–6 nodes.
        Uses the project's existing markmap color tokens.

Title: See the map
Body:  It becomes an interactive mindmap instantly — pan, zoom, and fold branches.
```

**Visual implementation:** A static SVG screenshot or a very small live `Markmap` instance. If live: create with `duration: 0` in JSON options so there is no entrance animation inside the card. Size: `h-32 w-full`. `"use client"` on this step's component.

#### Step 3 — Pick up where you left off

```
Visual: A coss ui Badge group showing save state.

  ┌─────────────────────────────┐
  │  ● Saved  ·  2 min ago      │
  │                             │
  │  Last session: Today, 14:32 │
  └─────────────────────────────┘

Title: Pick up where you left off
Body:  Every keystroke saves to your browser. Reopen anytime — your map is there.
```

**Visual implementation:** A small `Card` inside the step card with a green dot (`size-2 rounded-full bg-success`), `"Saved"` text, and a timestamp. Static — no real state. Uses `text-xs font-mono tabular-nums` for the timestamp.

#### Step 4 — Export, import, continue

```
Visual: Two coss ui Buttons side by side.

  [ ↑ Export .md ]    [ ↓ Import .md ]

  Below them: a small filename badge: "my-roadmap.md"

Title: Export, import, continue
Body:  Take your markdown with you. Import it anywhere, edit offline, bring it back.
```

**Visual implementation:** Two ghost `Button` components (not wired, decorative), `ExportIcon` and `ImportIcon` from Hugeicons, plus a `Badge` with `variant="secondary"` showing a filename. No click handlers on these visual buttons — they are illustrative only.

### Carousel Behavior

`useCarouselControls` hook at `hooks/use-carousel-controls.ts`:

- Tracks `scrollLeft`, `scrollWidth`, `clientWidth` via `useRef` and `scroll` event listener.
- `canScrollLeft`: `scrollLeft > 0`
- `canScrollRight`: `scrollLeft + clientWidth < scrollWidth - 4` (4px tolerance)
- `scrollBy`: `max(288, clientWidth * 0.85)` per click
- Updates on `scroll` and `resize` events.
- Returns `{ ref, canScrollLeft, canScrollRight, scrollLeft, scrollRight }`

### Entrance Animation

Section title and subtitle enter together:

```
opacity 0→1, translateY(12px)→0, blur(4px)→0   400ms   ease-out   scroll   threshold: 0.25
```

Carousel cards animate on mount (not scroll) with a stagger:

```
Card 1:  delay: 0ms
Card 2:  delay: 80ms
Card 3:  delay: 160ms
Card 4:  delay: 240ms
```

Each card: `opacity 0→1, translateY(12px)→0, blur(4px)→0, 400ms, ease-out`.

### Implementation Notes

- File: `app/(marketing)/ui/how-it-works.tsx`
- Step components: `app/(marketing)/ui/step-visuals/` directory
  - `step-write.tsx`
  - `step-visualize.tsx` — `"use client"` if using live Markmap instance
  - `step-save.tsx`
  - `step-export.tsx`
- Uses coss ui: `Card`, `Button`, `Badge`
- Icons: `ArrowLeft01Icon`, `ArrowRight01Icon`, `Upload01Icon`, `Download01Icon` from Hugeicons

---

## Section 5 — Final CTA

### Purpose

One last, calm nudge. No pressure. No urgency marketing. Just a clear path.

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Card  (py-16 text-center)                                      │
│                                                                 │
│  Your thoughts, connected.                                      │
│                                                                 │
│  "The map is not the territory.                                 │
│   But a good map makes the territory navigable."               │
│                                                                 │
│  [ Open editor → ]                                              │
│                                                                 │
│  Free. No account. Works immediately.                           │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Copy

- **Heading:** `"Your thoughts, connected."` — `text-3xl font-semibold tracking-tight`
- **Quote:** `"The map is not the territory. But a good map makes the territory navigable."` — `text-sm text-muted-foreground italic max-w-sm mx-auto`
- **CTA:** Primary `Button` with `ArrowRight01Icon` → `/playground` — `mt-8`
- **Footer line:** `"Free. No account. Works immediately."` — `text-xs text-muted-foreground mt-4`

No attribution on the quote. It stands as a statement, not a citation.

### Entrance Animation

Entire Card wrapper:

```
opacity 0→1, translateY(16px)→0   400ms   ease-out   scroll   threshold: 0.25
```

### Implementation Notes

- File: `app/(marketing)/ui/final-cta.tsx`
- Uses coss ui: `Card`, `Button`
- Icon: `ArrowRight01Icon`

---

## Section 6 — Footer

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  Separator                                                      │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  Markymap                          Links                        │
│  Turn your markdown into maps.     GitHub ↗                     │
│  2025 Markymap.                  —                            │
│  [ Light ] [ Dark ] [ System ]     Privacy                      │
│                                    Terms                        │
│                                                                 │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│       M A R K Y M A P                                           │
│       (large text watermark, full width, muted/25)              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Left Column

- `"Markymap"` — `text-sm font-medium text-foreground` (plain text wordmark)
- Tagline: `"Turn your markdown into maps."` — `text-xs text-muted-foreground mt-1`
- Copyright: `"2025 Markymap."` — `text-xs text-muted-foreground mt-3`
- Theme switcher: a three-state toggle (`Light` / `Dark` / `System`) using coss ui `ToggleGroup` from `components/ui/toggle-group.tsx`, wired to `next-themes` `setTheme`. Plays `switchOnSound` or `switchOffSound` on theme change (using the existing `useSound` hook and sound assets already in `lib/audio/`).

### Right Column

A simple vertical list of links:

```
GitHub ↗           → https://github.com/[owner]/markymap   target="_blank"
——
Privacy Policy     → # (placeholder)
Terms of Service   → # (placeholder)
```

All links: `text-xs text-muted-foreground hover:text-foreground transition-colors duration-150`

Grid: `grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-8` between left and right columns.

### Wordmark Watermark

Full-width below the `Separator`. "Markymap" as large display text:

```tsx
<p
  aria-hidden="true"
  className="mt-8 select-none text-center font-semibold tracking-tight text-muted-foreground/20 text-[clamp(3rem,10vw,8rem)] leading-none"
>
  Markymap
</p>
```

> **Note on `clamp`:** This is the only acceptable use of a custom CSS function value in this file — it uses viewport-relative sizing (`vw`) which cannot be expressed with a fixed Tailwind scale. All other sizing uses Tailwind tokens.

The text is `aria-hidden`, `select-none`, and purely decorative.

### Entrance Animation

**No entrance animation on the footer.** It loads already visible when the user scrolls to it. This is intentional — animated footers feel over-engineered and the user has already decided by this point.

### Implementation Notes

- File: `app/(marketing)/ui/footer.tsx`
- Uses coss ui: `Separator`, `ToggleGroup` from `components/ui/`
- Uses existing: `useSound` from `hooks/use-sound.ts`, `switchOnSound`, `switchOffSound` from `lib/audio/`
- `"use client"` on this file (needs `useTheme`, `useSound`)

---

## Route and File Structure

```
app/
  (marketing)/
    page.tsx             ← assembles all sections, Server Component
    layout.tsx           ← minimal layout, no sidebar, no app shell
    ui/
      nav.tsx            ← fixed nav with scroll behavior
      hero.tsx           ← headline, sub, CTAs
      demo.tsx           ← "use client" — live markmap split panel
      demo-seed.ts       ← DEMO_SEED constant (markdown string)
      how-it-works.tsx   ← section shell + carousel controls
      step-visuals/
        step-write.tsx
        step-visualize.tsx   ← "use client" if live markmap
        step-save.tsx
        step-export.tsx
      final-cta.tsx
      footer.tsx           ← "use client" for theme toggle + sounds

  (playground)/
    playground/
      page.tsx           ← the editor at /playground

hooks/
  use-in-view.ts         ← IntersectionObserver wrapper, returns [ref, isInView]
  use-scroll-y.ts        ← useSyncExternalStore scrollY hook, SSR-safe
  use-carousel-controls.ts ← scroll position tracker for carousel prev/next
```

`app/(marketing)/page.tsx` is a **Server Component**. It imports and renders the section components. Sections that need interactivity have `"use client"` at their own level. The page itself does not.

---

## `PageContainer` Component

A simple layout utility used by all sections for consistent max-width:

```tsx
// app/(marketing)/ui/page-container.tsx
// Server Component — no "use client" needed.

export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-4 sm:px-6", className)}>
      {children}
    </div>
  )
}
```

---

## Scroll Padding

The `<html>` element already has `scroll-padding-bottom` in `globals.css`. Add `scroll-padding-top` to account for the fixed nav (`h-14`):

```css
/* In globals.css @layer base html rule: */
html {
  scroll-padding-top: 4rem; /* 64px — nav height + 16px buffer */
}
```

---

## Anti-Patterns

```
🚫 No hero image — the live demo IS the visual.
🚫 No video embeds or auto-playing demos.
🚫 No email capture, waitlist, or newsletter signup.
🚫 No competitor comparison table.
🚫 No pricing section.
🚫 No "Transform your ideas into mindmaps" — too cliché.
🚫 No "Powerful yet simple" — every product says this.
🚫 No "Built for teams" — Markymap is personal.
🚫 No gradient text on the headline. No. Ever.
🚫 No looping background animations or particle effects.
🚫 No animated blob gradients behind the hero.
🚫 No more than two font weights per section.
🚫 No custom colors outside the coss ui token system.
🚫 No card borders or section backgrounds on the How It Works carousel.
🚫 No inline styles (style={{}}) anywhere.
🚫 No arbitrary Tailwind values for sizing or spacing.
🚫 No motion library (framer-motion) installed for this page — CSS transitions only.
🚫 No Supabase calls or network requests anywhere on this page.
🚫 No modification of real editor components from components/editor/.
🚫 No external state libraries (Zustand, Jotai) for the demo — plain useState + localStorage.
🚫 No eslint-disable-next-line react-hooks/exhaustive-deps — use useEffectEvent instead.
🚫 No useEffect for loading initial demo content — use lazy useState initializer.
```

---

## Skills Compliance Notes

This spec was written in full compliance with the project's skill files. Key decisions:

| Decision                                             | Skill source                                           | Rule                                                                                       |
| ---------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------ |
| CSS keyframe animation for hero (not JS)             | `make-interfaces-feel-better/animations.md`            | Keyframes for one-shot sequences, transitions for interactive                              |
| `opacity + translateY + blur` enter pattern          | `make-interfaces-feel-better/animations.md`            | Standard stagger animation values                                                          |
| `scale(0.96)` never below 0.95                       | `emil-design-eng/SKILL.md`                             | Never animate from scale(0)                                                                |
| `ease-out` for all entrances                         | `userinterface-wiki/AGENTS.md`                         | Rule 2.6 — ease-out for entrances                                                          |
| Stagger under 100ms per item                         | `userinterface-wiki/AGENTS.md`                         | Rule 1.9 — stagger under 50ms; 80ms is used here as a middle ground for marketing sections |
| `prefers-reduced-motion` fallback on every animation | `emil-design-eng/SKILL.md` + `globals.css`             | Always provide reduced-motion fallback                                                     |
| `text-wrap: balance` on headings                     | `make-interfaces-feel-better/typography.md`            | Applied globally; no per-component needed                                                  |
| Concentric border radius on nested cards             | `make-interfaces-feel-better/surfaces.md`              | `outerRadius = innerRadius + padding`                                                      |
| Lazy `useState` for localStorage demo content        | `vercel-react-best-practices` rule 5.10                | Lazy state initialization                                                                  |
| `useRef` for carousel scroll timer                   | `vercel-react-best-practices` rule 5.12                | useRef for transient values                                                                |
| `useSyncExternalStore` for scroll and carousel       | `react-useeffect/alternatives.md`                      | Prefer subscription-specific APIs                                                          |
| No motion library — CSS transitions only             | `make-interfaces-feel-better/animations.md`            | Use CSS cross-fade pattern when no motion dependency                                       |
| `"use client"` only at leaf nodes                    | `next-best-practices/directives.md`                    | Push use client as deep as possible                                                        |
| Landing page is Server Component at root             | `next-best-practices/rsc-boundaries.md`                | Never build async client components                                                        |
| No Supabase, no network calls                        | Reference wireframe anti-patterns + project constraint | Demo is self-contained, localStorage only                                                  |
| No inline styles                                     | `AGENTS.md` project rule                               | style={{}} is forbidden, zero exceptions                                                   |
