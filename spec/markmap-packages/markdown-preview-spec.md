# Markdown Preview Mode Spec

> Purpose: add a production-safe Markdown preview mode alongside current mindmap rendering, with strong defaults for security, performance, and long-term maintainability.

---

## 1. Scope

Add a right-panel view switcher so users can choose between:

1. Map (current markmap renderer)
2. Markdown (new rendered markdown preview)

The switcher should replace the current single "Map" indicator in the panel header.

---

## 2. Required Skills

Load these before implementation:

1. `next-best-practices`
2. `vercel-react-best-practices`
3. `react-useeffect`
4. `make-interfaces-feel-better`
5. `coss`

Why:

1. Next.js client/server boundaries and hydration safety
2. Render-path performance and lazy loading
3. Correct effect usage for preview toggles/state
4. Clean, interruptible toggle motion and UI polish
5. Consistent coss control composition in toolbar/header

---

## 3. Package Strategy

### 3.1 Baseline (Recommended Day-1)

Install:

1. `react-markdown`
2. `remark-gfm`
3. `rehype-sanitize`

Rationale:

1. GFM coverage for practical authoring (tables, task lists, autolinks, footnotes)
2. Safe defaults with explicit sanitation control
3. Lowest complexity for immediate value

### 3.2 Optional Feature Packs (Only when needed)

Math pack:

1. `remark-math`
2. `rehype-katex`
3. `katex`

Code highlight pack:

1. `rehype-highlight`
2. `highlight.js`

Line-break compatibility pack:

1. `remark-breaks`

Do not include optional packs in baseline unless required by product goals.

---

## 4. Security Model

### 4.1 Defaults

1. Keep raw HTML disabled in markdown preview.
2. Keep `urlTransform` safe defaults (no unsafe protocol widening).
3. Sanitize rendered AST with `rehype-sanitize`.

### 4.2 If raw HTML is ever enabled

1. Treat as trusted-content mode only.
2. Add explicit sanitize schema allowlist.
3. Document trust boundaries in UI/help text.

### 4.3 Plugin ordering

Use this pipeline order for safest behavior in this app:

1. parse markdown
2. remark plugins (`remark-gfm`, optional `remark-math`)
3. sanitize
4. optional rendering transforms that require classes/markup

If optional plugins require custom classes, expand sanitize schema intentionally and minimally.

---

## 5. UX + Component Behavior

### 5.1 Panel header

Current label "Map" becomes a compact segmented control:

1. `Map`
2. `Markdown`

Behavior:

1. Map remains default on load.
2. Switching tabs does not alter markdown content.
3. Switching tabs does not reset map viewport.

### 5.2 View rendering strategy

1. Render only the active view (avoid double work).
2. Preserve map instance in memory when hidden if practical, otherwise preserve viewport state before remount.
3. Keep the right panel dimensions unchanged to avoid layout jump.

### 5.3 Styling expectations

1. Markdown preview should use existing token system (`bg-background`, `text-foreground`, etc.).
2. Maintain readable measure and spacing in preview body.
3. Ensure long code/links wrap or scroll without breaking layout.

---

## 6. Performance Plan

### 6.1 Active-view-only computation

1. When active view is Map: skip markdown render work.
2. When active view is Markdown: skip map `setData` updates if hidden and state is unchanged.

### 6.2 Heavy plugin lazy loading

1. Keep baseline always available.
2. Lazy-load optional math/highlight packs only when feature is enabled or detected.

### 6.3 Stability + memoization

1. Memoize markdown renderer inputs by markdown string and plugin config.
2. Avoid effect-chained state updates for derived view state.
3. Keep transient parser/cache references in `useRef` where needed.

---

## 7. Edge Cases and Expected Behavior

1. Empty markdown: show subtle empty-state copy in Markdown preview.
2. Very large markdown: keep typing responsive; preview can update with existing debounce cadence.
3. Unsupported syntax: degrade gracefully as plain text/code, never crash panel.
4. Malformed tables/task lists: render best effort.
5. Unsafe links/content: sanitize and/or strip unsafe values.
6. Math without math pack: show readable source, no runtime failure.
7. Frontmatter and markmap comments: avoid confusing output in Markdown preview (strip or render intentionally).
8. Theme switching: preview follows current theme tokens immediately.

---

## 8. Implementation Targets

Primary files to update:

1. `components/editor/markmap-canvas.tsx`
2. `components/editor/markmap-controls-bar.tsx` (if header control is extracted there)
3. `components/editor/editor-shell.tsx` (state ownership if needed)
4. `app/globals.css` (preview typography utilities only if necessary)

New files likely:

1. `components/editor/markdown-preview.tsx` (dedicated renderer)
2. `lib/markdown-preview-options.ts` (optional central plugin config)

---

## 9. Rollout Plan

### Phase 1: Baseline Safe Preview

1. Add Map/Markdown switch UI.
2. Implement markdown renderer with `react-markdown + remark-gfm + rehype-sanitize`.
3. Ensure active-view-only rendering.

### Phase 2: Reliability + UX polish

1. Handle frontmatter/comment output policy cleanly.
2. Add empty-state and overflow handling.
3. Add focused visual polish to tab control and preview typography.

### Phase 3: Optional advanced packs

1. Add math pack with KaTeX CSS integration.
2. Add code highlighting pack.
3. Add lazy loading for optional packs.

---

## 10. Acceptance Criteria

Feature is complete when:

1. Users can switch between Map and Markdown in the right panel header.
2. Baseline markdown features (GFM) render correctly.
3. Unsafe content is sanitized with no script execution paths.
4. Typing responsiveness remains acceptable on large notes.
5. Map behavior and viewport are preserved when returning from Markdown view.
6. Theme and layout remain consistent across both preview modes.
7. Typecheck, lint, and runtime diagnostics are clean for touched files.
