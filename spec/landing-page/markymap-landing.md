# Wireframe — Markymap Landing Page (Lean Revision)

> Route: /
> File: app/(marketing)/page.tsx
> Audience: first-time visitors
> CTA target: /playground
> Primary goal: communicate value quickly and move users into the editor.

---

## Why This Revision Exists

The previous expanded marketing layout was intentionally reduced.

Current direction favors:

1. Faster comprehension
2. Fewer sections
3. Lower visual and maintenance overhead
4. Direct path from landing to playground

---

## Hard Constraints

1. Use coss UI components from components/ui only.
2. No inline styles.
3. No gradient text.
4. Keep the live markmap demo as the proof centerpiece.
5. Preserve wide marketing container and full-bleed playground shell.

---

## Current Page Architecture (Source Of Truth)

```
HERO
LIVE DEMO
```

Removed from landing route:

1. Navbar
2. How-it-works section
3. Trust strip
4. Final CTA
5. Footer
6. Hero secondary CTA ("See live demo")
7. Hero branch-ledger panel

---

## Global Layout Strategy

### Marketing Width

1. Use the wide page container variant.
2. Max width target remains 1800px.
3. Horizontal padding remains px-4 sm:px-6 lg:px-10.

### Playground Width

1. Keep page-level shell full-bleed.
2. No hard max width wrapper.

---

## Section 1 — Hero

### Purpose

Introduce Markymap with one clear statement and one action.

### Content Shape

1. Eyebrow: Markdown mindmaps
2. Headline: Turn plain notes into a map you can actually navigate.
3. Supporting line 1: structure and context
4. Supporting line 2: visual, editable, easy to revisit
5. Single primary CTA: Open playground

### Spacing

Use reduced top spacing to account for no navbar:

1. Section top: pt-16 (sm:pt-20)
2. Section bottom: pb-4 (sm:pb-6)

---

## Section 2 — Live Demo

### Purpose

Provide immediate proof using real markmap rendering.

### Keep

1. Split markdown/map panels
2. markmap-lib + markmap-view integration
3. Preview-only editable state seeded from DEMO_SEED on each visit (no persistence)

### Remove

1. Demo helper copy above the card ("No account needed. Edit the markdown and watch it map.")
2. Demo faux window chrome/header row (red/yellow/green dots + preview URL strip)

### Visual Parity Rule

1. Landing demo card framing should match the playground panel style.
2. Demo should start directly with the split editor/map body, with no extra top chrome.

### Layout Rhythm

Use tighter spacing after hero for the lean page:

1. Main content gap: space-y-14 (sm:space-y-16)
2. Main bottom padding: pb-8 (sm:pb-10)

---

## Motion Language

1. Keep existing hero enter animation utilities.
2. Use opacity/transform/filter only.
3. Respect prefers-reduced-motion behavior already defined in globals.css.

---

## File Structure (Current)

```
app/
  (marketing)/
    page.tsx
    ui/
      page-container.tsx
      hero.tsx
      demo.tsx
      demo-seed.ts

app/
  (playground)/
    playground/
      page.tsx
```

Deleted from marketing ui scope in this revision:

1. nav.tsx
2. how-it-works.tsx
3. how-it-works-stage.tsx
4. trust-strip.tsx
5. final-cta.tsx
6. footer.tsx
7. theme-switcher-multi-button.tsx

---

## Acceptance Checklist

1. Landing route renders hero and live demo only.
2. No navbar or footer is rendered.
3. Hero has a single CTA.
4. Hero has no branch-ledger panel.
5. No references/imports remain to removed sections.
6. Demo helper copy above the card is not rendered.
7. Demo traffic-light header strip is not rendered.
8. Spec and context docs match the live implementation.
