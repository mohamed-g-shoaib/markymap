# Markmap Full Functionality Spec

> Purpose: capture the complete implementation status and remaining work for full Markdown + mindmap functionality.
> Source baseline: current codebase plus `spec/markmap-packages/context.md`.

---

## 1. Goal Definition

"Full functionality" means Markymap can:

1. Author Markdown comfortably in the playground.
2. Render interactive mindmaps accurately and efficiently.
3. Persist and restore user work and map settings reliably.
4. Import/export data with sufficient fidelity.
5. Expose practical controls for map behavior and viewport.
6. Support markmap-native authoring features (JSON options and magic comments).

---

## 1.1 Required Skills

Load these skills before implementing this spec:

1. `next-best-practices`
2. `vercel-react-best-practices`
3. `react-useeffect`
4. `coss`
5. `tailwind-css-patterns`
6. `typescript-advanced-types`

Recommended (phase-dependent):

1. `vercel-composition-patterns` for toolbar/state API composition.
2. `fixing-motion-performance` if adding animated map controls or heavy transitions.
3. `tailwind-design-system` if extracting reusable editor/map settings components.

### Skill-to-Workstream Mapping

1. JSON options state, parsing, and canvas update flow:
   `react-useeffect`, `vercel-react-best-practices`, `typescript-advanced-types`
2. Toolbar controls and component composition:
   `coss`, `vercel-composition-patterns`, `tailwind-css-patterns`
3. Import/export schema and migration safety:
   `typescript-advanced-types`, `next-best-practices`
4. Performance hardening for larger markdown:
   `vercel-react-best-practices`, `fixing-motion-performance`
5. UI/system consistency and reusable primitives:
   `tailwind-css-patterns`, `tailwind-design-system`, `coss`

---

## 2. Current Status (Implemented)

### 2.1 Core Markdown -> Mindmap Pipeline

Implemented in `components/editor/markmap-canvas.tsx`.

1. Module-level `Transformer` singleton is used.
2. Markdown is transformed with `transformer.transform(markdown)`.
3. Required assets are loaded via `getUsedAssets(features)`.
4. SVG renderer is mounted via `Markmap.create(...)`.
5. Content updates reuse the same instance with `mm.setData(root)`.
6. Instance cleanup uses `mm.destroy()` on unmount.
7. Fit action is available via a UI button.

### 2.2 Editor Shell

Implemented in `components/editor/editor-shell.tsx` and `components/editor/markdown-input.tsx`.

1. Shared markdown state is owned in editor shell.
2. Input and canvas stay synchronized.
3. Debounced local save exists for playground markdown content.
4. Save-state feedback is visible (saving/saved/error).
5. Import `.md`, export `.md`, and reset are implemented.

### 2.3 Landing Demo (Intentional Behavior)

Implemented in `app/(marketing)/ui/demo.tsx`.

1. Demo is live and interactive.
2. Demo is preview-only and non-persistent by design.
3. Demo uses markmap pipeline correctly.

---

## 3. Remaining Work (For Full Functionality)

### 3.1 JSON Options End-to-End (High)

Not complete yet.

Missing:

1. `jsonOptions` state in `editor-shell.tsx`.
2. Option UI and data model for editable map options.
3. Passing `jsonOptions` into `MarkmapCanvas`.
4. `mm.setOptions(deriveOptions(jsonOptions))` update path.
5. Persistence of options alongside markdown.

Why this matters:

1. Unlocks configurable behavior (`zoom`, `pan`, `duration`, spacing, expand levels, colors).
2. Aligns with package docs and frontmatter capability.

### 3.2 First-Class Toolbar Controls (High)

Current controls are minimal.

Missing:

1. Zoom in / zoom out.
2. Reset view / fit view variants.
3. Expand/collapse helpers (or equivalent UX).
4. Pan/zoom toggles if exposing option-level controls.
5. Clear map settings entry point.

Why this matters:

1. A core interactive map experience requires viewport control beyond a single fit action.

### 3.3 Import/Export Fidelity Beyond Raw Markdown (High)

Current import/export is markdown-only.

Missing:

1. Structured export format including markdown + jsonOptions.
2. Structured import path for same format.
3. Versioned schema for future compatibility.
4. Guardrails for malformed imports.

Why this matters:

1. Markdown-only round-trip loses map-level configuration.

### 3.4 Markmap Authoring Features UX (Medium)

Capabilities exist in markmap stack but product-level support is incomplete.

Missing:

1. In-app guidance/examples for frontmatter `markmap` JSON options.
2. In-app guidance/examples for magic comments: `fold`, `foldAll`.
3. Quick template insertion helpers (optional but recommended).

Why this matters:

1. Users cannot reliably discover advanced behavior without guidance.

### 3.5 Markdown Authoring UX Improvements (Medium)

Current editor uses a basic textarea.

Potential improvements:

1. Better indentation and list ergonomics.
2. Keyboard shortcuts for common structure edits.
3. Optional syntax assistance.
4. Better handling of very large documents.

Why this matters:

1. Full functionality should feel production-grade for actual writing, not only rendering.

### 3.6 Performance Hardening for Large Docs (Medium)

Current transform-per-keystroke is correct but may degrade with large content.

Missing:

1. Render/update throttling strategy for large documents.
2. Optional deferred or staged rendering for heavy inputs.
3. Performance thresholds and fallback behavior.

Why this matters:

1. Prevents lag and preserves responsiveness at scale.

### 3.7 Validation/Test Coverage (Medium)

Missing:

1. Round-trip tests for persistence and import/export.
2. Tests for options application and update behavior.
3. Regression tests for markmap lifecycle (mount/update/unmount).
4. Error-path tests (storage failures, bad import payloads).

Why this matters:

1. Reduces regressions as editor complexity grows.

---

## 4. Priority Execution Plan

### Phase 1 (Immediate)

1. Implement `jsonOptions` state and canvas option updates.
2. Build practical toolbar controls on top of options.
3. Add structured import/export format with markdown + options.

### Phase 2 (Near-Term)

1. Add in-app help/examples for frontmatter and magic comments.
2. Improve markdown editing ergonomics.
3. Add performance guardrails for larger files.

### Phase 3 (Stabilization)

1. Add focused tests across lifecycle, options, and import/export.
2. Add edge-case hardening and migration handling for future schema changes.

---

## 5. Acceptance Criteria

Full functionality is considered complete when:

1. Markdown + map options are both editable, persisted, imported, and exported.
2. Map controls cover practical viewport and interaction needs.
3. Markmap frontmatter and magic comments are documented in-product.
4. Large markdown inputs remain responsive under expected usage.
5. Critical workflows are covered by tests (rendering, persistence, import/export, options updates).

---

## 6. Source Files Referenced

1. `spec/markmap-packages/context.md`
2. `components/editor/markmap-canvas.tsx`
3. `components/editor/markdown-input.tsx`
4. `components/editor/editor-shell.tsx`
5. `lib/storage.ts`
6. `app/(playground)/playground/page.tsx`
7. `app/(marketing)/ui/demo.tsx`
