# Reference to read once

## This is a wireframe spec from a different project

### It was for building the landing page, read it and learn only

---

# Wireframe — Homepage (Marketing)

> **Route:** `/`
> **Audience:** Unauthenticated visitors only. Authenticated users are redirected to `/overview` by middleware.
> **CTA target:** `/login` (no waitlist, no email capture).

---

## Global Design Rules

```
🚫 NEVER write custom CSS classes for colors, typography, spacing scales, shadows, or borders.
🚫 NEVER override, extend, or modify any Coss UI token, class, or component style.
🚫 NEVER use arbitrary Tailwind values (e.g. w-[543px], text-[13px]) for styling purposes.
🚫 NEVER import or use any UI library other than Coss UI (no shadcn, no radix standalone, no MUI, no Chakra).
✅ ALWAYS use Coss UI components exactly as documented.
✅ ALWAYS use Coss UI design tokens for spacing, color, and typography.
✅ If a needed component does not exist in Coss UI, ask before inventing a custom one.
```

---

## Animation Rules (from Emil Kowalski + Raphael Salaja)

The homepage is seen once or twice by a user — it can breathe. The dashboard is seen every day — it stays restrained. This is the _only_ place in the product where richer motion is acceptable.

```
✅ Animate only `transform` and `opacity`. Never animate layout properties (width, height, top, left).
✅ Use `ease-out` as the default easing. Use custom cubic-bezier: cubic-bezier(0.32, 0.72, 0, 1).
✅ Entrance animations: start from scale(0.96) + opacity 0, arrive at scale(1) + opacity 1.
✅ Stagger section reveals on scroll — each element enters sequentially, not simultaneously.
✅ Every animation must be purposeful: it clarifies how something works, guides attention, or creates earned delight.
✅ Respect prefers-reduced-motion — fall back to opacity-only transitions, never disable entirely.
✅ Keep entrance durations between 300ms–500ms for marketing sections. UI interactions stay under 300ms.
🚫 NEVER animate for decoration. If you cannot articulate why the animation exists, remove it.
🚫 NEVER animate from scale(0). Minimum enter scale is scale(0.95).
🚫 NEVER use transition: all. List properties explicitly.
🚫 No auto-playing videos, no looping animations that run indefinitely without user interaction.
```

**Anticipation rule:** The interactive mockup section is the most important element on the page. Everything before it is anticipation. Everything after it is reinforcement.

---

## Page Layout Overview

```
┌─────────────────────────────────────────────────────┐
│  NAV                                                │
├─────────────────────────────────────────────────────┤
│  HERO                                               │
│  (headline + sub + CTAs)                            │
├─────────────────────────────────────────────────────┤
│  MOCKUP                                             │
│  (Notes-only mini-app — localStorage, header strip) │
├─────────────────────────────────────────────────────┤
│  HOW IT WORKS  (horizontal scroll carousel, 5 steps)│
├─────────────────────────────────────────────────────┤
│  FINAL CTA  (Card with quote + CTA button)          │
├─────────────────────────────────────────────────────┤
│  FOOTER  (multi-column + wordmark watermark)        │
└─────────────────────────────────────────────────────┘
```

> **Note:** The Features section and Social Proof section from the original plan were **not implemented**. They were dropped. The "How It Works" section was significantly redesigned (see below). The page order is NAV → HERO → MOCKUP → HOW IT WORKS → FINAL CTA → FOOTER.

All sections use `PageContainer` for consistent max-width. Sections use `pt-14` vertical rhythm.

---

## Section 1 — Nav

### Layout

Fixed at top. Full-width. Minimal.

```
[ RootlyLogo mark + "Rootly" wordmark ]     [ GitHub ] [ Get started → ]
```

- Left: `RootlyLogo` SVG mark + plain `"Rootly"` text (`text-sm font-medium`), wrapped in `next/link` to `/`.
- Right:
  - Outline button: `Star on GitHub` with `Github01Icon` — links to `https://github.com/mohamed-g-shoaib/rootly`, `target="_blank"`. Hidden on mobile (`hidden sm:inline-flex`).
  - Primary button: `Get started` with `ArrowRight02Icon` that translates on hover → `/login`.

### Behavior

- On scroll past 40px, nav gains `backdrop-blur` and `border-border bg-background/80`. Below that: `border-transparent bg-transparent`.
- CSS-only transition on `border-b` and `background-color`. No JS animation library.
- Mobile: GitHub button hidden, logo + Get started only.

### Implementation Notes

- **Implemented.** File: `app/(marketing)/ui/homepage-nav.tsx`.
- Uses `PageContainer`, coss ui `Button`, `HugeiconsIcon`.
- Nav height: `h-14` within the header.

---

## Section 2 — Hero

### Purpose

One job: make the visitor understand what Rootly does in under 4 seconds.

### Layout (desktop)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   The learning notebook                             │
│   built for developers.                             │
│                                                     │
│   Capture notes, track progress, and review         │
│   what you've learned — all in one place.           │
│                                                     │
│   [ Get started → ]   [ See how it works ]          │
│                                                     │
└─────────────────────────────────────────────────────┘
```

> **Change from original plan:** The scroll cue (chevron below CTAs) was **not implemented**. Hero section top padding is `pt-24`. CTA buttons stack vertically on mobile and become `flex-row` on `sm:`.

### Copy

- **Headline:** `The learning notebook built for developers.` — single block, `text-4xl font-semibold tracking-tight sm:text-5xl`, left-aligned desktop → centered mobile (`sm:text-center`). No gradient text.
- **Sub:** `Capture notes, track progress, and review what you've learned — all in one place.` — `text-base text-muted-foreground sm:text-lg`.
- **CTAs:** Primary `Get started` with `ArrowRight02Icon` → `/login`. Outline `See how it works` → `#mockup` smooth scroll.

### Entrance Animation

- Headline: `opacity 0→1`, `y: 12→0`, `400ms`, `cubic-bezier(0.32, 0.72, 0, 1)`, no delay.
- Sub: same, `100ms` delay.
- CTAs wrapper: same, `200ms` delay.
- All `animate` (play-once on mount, not scroll-triggered).

### Implementation Notes

- **Implemented.** File: `app/(marketing)/ui/homepage-hero.tsx`.

---

## Section 3 — Mockup (Notes Mini-App)

> **Scope change from original plan:** The full multi-page mini-app (Notes + Courses + Overview + Daily Entries + Review) described in the original spec was **scoped down to Notes only** in the current implementation. There is no FloatingDock, no page switcher, no mock URL bar reactive to page changes. Only the Notes page is embedded. The remaining pages are planned but not yet built.

### Purpose

Let the visitor interact with real note cards: create, edit, view, flag, delete. All data writes to `localStorage` under the `rootly_demo_*` namespace. No Supabase calls.

### Layout

```
┌─────────────────────────────────────────────────────┐
│  id="mockup"                                        │
│                                                     │
│  "Try it — no account needed."                      │
│                                                     │
│  ┌───────────────────────────────────────────────┐  │
│  │  [ ● ● ●   rootly.app/notes          ]        │  │  ← browser chrome top bar (sm+ only)
│  │  ┌─────────────────────────────────────────┐  │  │
│  │  │ sticky header: "Notes"   [ New Note ]   │  │  │
│  │  ├─────────────────────────────────────────┤  │  │
│  │  │                                         │  │  │
│  │  │   [ NoteCard grid ]                     │  │  │
│  │  │                                         │  │  │
│  │  └─────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Container & Sizing

- Wrapped in coss ui `Card` with `overflow-hidden`. Width follows `PageContainer` (global max-width token). No arbitrary pixel widths.
- Inner content area has `relative overflow-hidden bg-background`.
- No fixed height — content area grows with note cards.

### Browser Chrome Top Bar

- Rendered only on `sm:` and above (`hidden sm:flex`).
- Three traffic-light dots: `bg-destructive/70`, `bg-warning/70`, `bg-success/70` — decorative, no action.
- Mock URL: `rootly.app/notes` (static string, not reactive to page changes in current implementation).
- Right side: `w-12` spacer for visual balance.
- Background: `bg-muted/40 border-b`.

### Mockup Header Strip (inside content area)

A sticky header is rendered at the top of the content area (`sticky top-0 z-20 border-b bg-background`):

- Left: `"Notes"` label (`text-sm font-medium text-foreground`).
- Right: `"New Note"` primary `Button` that opens `MockNoteEditorSheet` in create mode.

> **Change from original plan:** The original spec called for a type filter strip and show/hide all answers toggle in the mockup header. The implemented header is simpler — just a label and a New Note button. No filters, no global show/hide toggle.

### Notes Page

- **File:** `app/(marketing)/ui/mock-notes-page.tsx`
- Renders `MockNoteCard` grid via real `DemoStoreProvider` context.
- Grid: `grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3` inside `p-4`.
- Notes sorted by `updatedAt` descending. Mobile shows a mixed cap: 1 Q&A + 2 freeform (sorted by `updatedAt`), not the full card cap.
- All sheets work: create, edit, view full note, code viewer.

### Demo localStorage Store

Implemented in `app/(marketing)/ui/mock-store.ts`. Uses `useSyncExternalStore` for reactivity. Seed is always written on mount (no check for existing keys — always resets on page load).

#### Namespace Keys

```
rootly_demo_notes
rootly_demo_courses
rootly_demo_daily_entries
rootly_demo_review_sessions
```

#### Store API

```ts
// Notes
addNote(note: Omit<DemoNote, 'id' | 'createdAt' | 'updatedAt'>): void
updateNote(id: string, patch: Partial<DemoNote>): void
deleteNote(id: string): void

// Courses
addCourse(course: Omit<DemoCourse, 'id' | 'createdAt' | 'updatedAt'>): void
updateCourse(id: string, patch: Partial<DemoCourse>): void
deleteCourse(id: string): void

// Daily Entries
addDailyEntry(entry: Omit<DemoDailyEntry, 'id' | 'createdAt' | 'updatedAt'>): void
updateDailyEntry(id: string, patch: Partial<DemoDailyEntry>): void
deleteDailyEntry(id: string): void
```

`DemoNote`, `DemoCourse`, `DemoDailyEntry` are type aliases for the real `Note`, `Course`, `DailyEntry` types — no separate demo types.

#### Daily Entry Deduplication

`addDailyEntry` silently no-ops if an entry already exists for the same `date`. This prevents duplicate-date collisions.

### Seed Data

Implemented in `app/(marketing)/ui/mock-seed.ts`. All timestamps are anchored to `2026-03-10T12:00:00.000Z`.

```
Seed: 6 courses
  - "React Deep Dive" (42% progress, topics: React, Hooks, Rendering)
  - "TypeScript Fundamentals" (35% progress, topics: TypeScript, Types)
  - "Node.js & Express" (0% progress, topics: Node, Express)
  - "Algorithms & Data Structures" (68% progress, topics: Algorithms, Big O, Trees)
  - "Python for Data Science" (20% progress, topics: Python, NumPy, Pandas)
  - "Advanced CSS & Animations" (55% progress, topics: CSS, Animations, Layout)

Seed: 9 notes
  - 6 Q&A notes across React Deep Dive + TypeScript Fundamentals:
    1. When should you use useMemo? (React) — Getting It, flagged
    2. What is the difference between useEffect and useLayoutEffect? (React) — Confused
    3. How does React reconciliation work? (React) — Clear
    4. What is a discriminated union in TypeScript? (TS) — Getting It, flagged
    5. When should you use `unknown` instead of `any`? (TS) — Confused
    6. What does the `satisfies` operator do? (TS) — Clear
  - 3 freeform notes:
    7. Chapter summary: React rendering model (React Deep Dive)
    8. Session recap: TypeScript utility types (TS Fundamentals) — flagged
    9. Quick reference: async/await patterns (Node.js & Express)

Seed: 9 daily entries (not 5 as originally planned)
  - 2026-03-10: 60 min, Focused
  - 2026-03-09: 120 min, Burned Out
  - 2026-03-08: 30 min, Neutral
  - 2026-03-07: 90 min, Focused
  - 2026-03-06: 45 min, Neutral
  - 2026-03-05: 75 min, Neutral
  - 2026-03-04: 50 min, Burned Out
  - 2026-03-03: 100 min, Focused
  - 2026-03-02: 40 min, Neutral

Seed: 0 review sessions.
```

> **Change from original plan:** Seed courses expanded from 3 to 6. Daily entries expanded from 5 to 9. The extra data makes the Overview charts and stats more convincing for future pages.

### Card Cap Rules

Cap is enforced in `mock-store.ts` `addNote`. Breakpoint is detected in `HomepageMockup` via a `useBreakpoint()` hook and passed as `noteCap` to `DemoStoreProvider`.

```
Desktop  (lg and above):  9 cards max  (3 columns × 3 rows)
Tablet   (md):            6 cards max  (2 columns × 3 rows)
Mobile   (sm and below):  3 cards max  (1 column  × 3 rows)
```

Mobile display is further customized: shows 1 Q&A + 2 freeform (hardcoded split, not pure cap enforcement).

When `addNote` is called and the cap is reached, the oldest note (by `createdAt`) is removed before the new one is added.

### MockNoteCard

- **File:** `app/(marketing)/ui/mock-note-card.tsx`
- A self-contained mock implementation of `NoteCard` wired to the demo store types. Does NOT import or modify the real `NoteCard` from `app/notes/ui/`.
- Supports full interactions: overflow menu (edit / delete / view full / view code), flag toggle, show/hide answer toggle on Q&A notes.

### Mock Sheets

- **`mock-note-editor-sheet.tsx`** — full create/edit sheet wired to demo store. Mirrors `NoteEditorSheet` from `app/notes/ui/notes-sheets.tsx` but saves to demo store.
- **`mock-notes-sheets.tsx`** — viewer sheet (`MockNoteViewerSheet`) and code viewer sheet (`MockCodeViewerSheet`). Read-only; provide an "Edit" action that chains to the editor.
- **`mock-sheet.tsx`** — `MockSheetPortalProvider` that constrains sheet portals to render inside `mockViewportRef` rather than `document.body`.

### Entrance Animation

- `Card` wrapper: `opacity 0→1`, `y: 20→0`, `500ms`, `cubic-bezier(0.32, 0.72, 0, 1)`, `whileInView`, `viewport: { once: true, amount: 0.15 }`.
- No staggered note card entrance animation in current implementation.

### Label above the mockup

- `"Try it — no account needed."` — `text-sm text-muted-foreground`, centered.

### Implementation Notes

- **Partially implemented.** File: `app/(marketing)/ui/homepage-mockup.tsx`.
- Only Notes page is implemented. Multi-page switcher, FloatingDock adapter, Courses/Overview/Daily Entries/Review mock pages are **not yet built**.

---

## Section 4 — Features

> **Not implemented.** This section was dropped from the current build. The three-column Features layout (Capture / Review / Track) described in the original plan does not exist in the codebase.

---

## Section 5 — How It Works

> **Significantly redesigned.** The original plan was a vertical numbered list (4 steps, two-column desktop layout with `Separator` between steps). The implemented version is a **horizontal scroll carousel** with 5 steps, each having an interactive visual mockup (not static) and prev/next navigation buttons.

### Layout

```
How it works
[subtitle]
[ ← ] [ → ]

┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ [Visual] │ │ [Visual] │ │ [Visual] │ │ [Visual] │ │ [Visual] │ →  (scrollable)
│          │ │          │ │          │ │          │ │          │
│ Title    │ │ Title    │ │ Title    │ │ Title    │ │ Title    │
│ Body     │ │ Body     │ │ Body     │ │ Body     │ │ Body     │
└──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘
```

- Section title: `text-2xl font-semibold`.
- Subtitle: `text-sm text-muted-foreground` — `"Set up a course, capture notes, log daily progress, review what you learned, and watch your stats."`.
- Prev/Next icon buttons (`ArrowLeft02Icon` / `ArrowRight02Icon`) rendered below the subtitle, above the carousel. Disabled state wired to scroll position.
- Carousel: `flex snap-x snap-mandatory overflow-x-auto` with `[scrollbar-width:none]`. Cards are `w-80 sm:w-96 shrink-0 snap-start`.
- Trailing padding-end (`pe-16 sm:pe-24`) creates a visual bleed hint of the next card.

### 5 Steps (implemented)

| Step | Title                    | Visual                                                                                                                                                                                                                         |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1    | `Create a course`        | `CreateCourseVisual` — Card with course title "Machine Learning Fundamentals", instructor "Andrew Ng", and an **interactive** `Slider` showing progress at 42%                                                                 |
| 2    | `Capture notes`          | `CaptureVisual` — Card with a Q&A note ("When should you use useMemo?"), interactive show/hide answer toggle, `PreviewCard` (hover desktop) or `Popover` (touch) for "Peek answer", Understanding + language badges            |
| 3    | `Log daily progress`     | `DailyLogVisual` — Card with study time "2h 25m", reflective text, and **interactive** 3-button mood selector (Burned / Neutral / Focused with emoji icons)                                                                    |
| 4    | `Start a review session` | `ReviewVisual` — Card with session progress "3 / 10 questions", question text, `PreviewCard`/`Popover` "Peek answer", and **interactive** 3-button understanding level selector (Confused / Getting It / Clear with Hugeicons) |
| 5    | `Watch analytics`        | `TrackVisual` — Card with a live `BarChart` (5 hardcoded bars, no axes/tooltips), "Study minutes" label, and "avg. 2.4h / day" stat                                                                                            |

> **Changes from original plan:**
>
> - Was 4 steps; now 5 steps (added "Create a course" and "Log daily progress").
> - Was vertical numbered list; now horizontal scroll carousel.
> - Was static visual mockups; visuals are now interactive (Slider, mood picker, understanding picker).
> - Step copy is different from the original.
> - `Separator` between steps is gone.
> - Carousel uses `PreviewCard` component for desktop hover-peek on answers (not in the original spec).

### Carousel Behavior

`useCarouselControls()` hook tracks scroll position via `scrollLeft` / `scrollWidth` / `clientWidth`. Scrolls by `max(280, clientWidth * 0.9)` per click. Updates prev/next button disabled state reactively.

### Entrance Animation

- Section title + subtitle: `opacity 0→1`, `y: 12→0`, `whileInView`, `viewport: { once: true, amount: 0.25 }`.
- Carousel cards: `opacity 0→1`, `y: 12→0`, `animate` (on mount), staggered `0ms / 50ms / 100ms / 150ms / 200ms`.

### Implementation Notes

- **Implemented.** File: `app/(marketing)/ui/homepage-how-it-works.tsx`.
- Imports `Bar`, `BarChart`, `ResponsiveContainer` from `recharts` directly (not lazy-loaded — these are static hardcoded data bars, not a live chart).
- Imports emoji SVG components from `app/daily-entries/ui/daily-entries-emojis`.

---

## Section 6 — Social Proof

> **Not implemented.** Dropped from the current build.

---

## Section 7 — Final CTA

### Layout

```
┌─────────────────────────────────────────────────────┐
│  Card (py-14, centered)                             │
│                                                     │
│  Start learning with intention.                     │
│                                                     │
│  "All disciplines repeated with consistency..."     │
│   — John C. Maxwell                                 │
│                                                     │
│  [ Get started → ]                                  │
│                                                     │
│  Rootly is free to use.                             │
│                                                     │
└─────────────────────────────────────────────────────┘
```

> **Change from original plan:** The sub-copy `"Rootly is free to use. No credit card required."` was replaced with an italic motivational quote from John C. Maxwell: _"All disciplines repeated with consistency every day lead to great achievements gained slowly over time."_ The `"Rootly is free to use."` line is kept below the button (shorter, no "No credit card required" line).

- Wrapped in a coss ui `Card` with `py-14`.
- `"Start learning with intention."` — `text-3xl font-semibold`.
- Quote: `text-sm text-muted-foreground italic`.
- Primary `Button` with `ArrowRight02Icon` → `/login`.
- `"Rootly is free to use."` — `text-sm text-muted-foreground`.

### Entrance Animation

- `motion.div` wrapper: `opacity 0→1`, `y: 16→0`, `400ms`, `whileInView`, `viewport: { once: true, amount: 0.25 }`.

### Implementation Notes

- **Implemented.** File: `app/(marketing)/ui/homepage-final-cta.tsx`.

---

## Section 8 — Footer

### Layout

```
┌─────────────────────────────────────────────────────┐
│  Separator                                          │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  [ RootlyLogo + "Rootly" ]    [ Account | Connect | Legal ]
│  Built with ♥ for self-taught developers.           │
│  © 2026 Rootly. All rights reserved.                │
│  [ ThemeSwitcherMultiButton ]                       │
│                                                     │
│  ──────────────────────────────────────────────     │
│  [ ROOTLY wordmark watermark — full width ]         │
│                                                     │
└─────────────────────────────────────────────────────┘
```

> **Changes from original plan:**
>
> - Footer is significantly expanded from the original single-line layout.
> - Left column: logo + wordmark, tagline, copyright, and a `ThemeSwitcherMultiButton` (Light / Dark / System tri-state selector).
> - Right column: `nav` grid with 3 link groups — **Account** (Login), **Connect** (GitHub), **Legal** (Privacy Policy, Terms of Service — both `#` placeholders).
> - A full-width `RootlyWord` SVG watermark renders at the bottom of the footer at large scale (`h-14 sm:h-20 lg:h-32`), `text-muted-foreground/25`, `select-none`.
> - No entrance animation on the footer (as specified).

### Implementation Notes

- **Implemented.** File: `app/(marketing)/ui/homepage-footer.tsx`.
- Uses `RootlyLogo`, `RootlyWord` (SVG wordmark component from `components/rootly-word.tsx`), `Separator`, `PageContainer`.
- `ThemeSwitcherMultiButton` is a custom component at `app/(marketing)/ui/theme-switcher-multi-button.tsx`.

---

## Route & File Structure (as implemented)

```
app/
  (marketing)/
    page.tsx          ← imports all sections
    layout.tsx        ← minimal layout wrapper
    ui/
      homepage-nav.tsx             ✅ implemented
      homepage-hero.tsx            ✅ implemented
      homepage-mockup.tsx          ✅ implemented (Notes only — multi-page pending)
      homepage-how-it-works.tsx    ✅ implemented (carousel redesign)
      homepage-final-cta.tsx       ✅ implemented
      homepage-footer.tsx          ✅ implemented

      mock-seed.ts                 ✅ implemented
      mock-store.ts                ✅ implemented
      mock-note-card.tsx           ✅ implemented (self-contained, does not import real NoteCard)
      mock-notes-page.tsx          ✅ implemented
      mock-note-editor-sheet.tsx   ✅ implemented
      mock-notes-sheets.tsx        ✅ implemented (viewer + code viewer)
      mock-sheet.tsx               ✅ implemented (MockSheetPortalProvider)
      theme-switcher-multi-button.tsx ✅ implemented

      homepage-mock-notes.ts       ⚠️  exists (likely a legacy/unused file — verify before removing)

      — NOT YET BUILT —
      mock-floating-dock.tsx       ❌ pending
      mock-courses-page.tsx        ❌ pending
      mock-overview-page.tsx       ❌ pending (lazy)
      mock-daily-entries-page.tsx  ❌ pending
      mock-review-page.tsx         ❌ pending
```

---

## Proxy Behavior (`proxy.ts`)

```
/  → unauthenticated: render (marketing)/page.tsx
   → authenticated:   redirect 307 /overview

/overview, /courses, /notes, /daily-entries, /review
   → unauthenticated: redirect 307 /login
   → authenticated:   render normally
```

Auth check: presence of Supabase cookie `sb-gforbcrkqdowocyfrrjj-auth-token` only.

---

## Motion Dependency

All scroll-triggered animations use **Motion (Framer Motion v12)** — `motion` in `package.json`. Use `motion/react` with `whileInView` + `viewport: { once: true }`. No raw CSS transitions for scroll reveals.

---

## Anti-Patterns

```
🚫 No hero image — the mockup IS the visual.
🚫 No video embeds or auto-playing demos.
🚫 No email capture / waitlist.
🚫 No competitor comparison table.
🚫 No pricing section.
🚫 No gradient text.
🚫 No looping background animations.
🚫 No more than 2 font weights per section.
🚫 No custom color outside coss ui token system.
🚫 No card borders or column backgrounds in Features.
🚫 No Supabase calls anywhere in the mockup.
🚫 No modifications to real page components, real UI components, or real data hooks.
🚫 No external state libraries (Zustand, Jotai, etc.) in the mockup.
🚫 No arbitrary Tailwind values for the mockup container sizing.
```
