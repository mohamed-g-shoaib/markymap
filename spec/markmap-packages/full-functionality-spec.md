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

Overall status: Complete.

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
5. Import supports `.md` and structured `.json` editor bundles.
6. Export supports `.md` and structured `.json` bundles.
7. Reset is implemented.
8. JSON options state is owned in editor shell and persisted with markdown.
9. Editor surface now uses composed subcomponents/hooks for maintainability (`use-editor-shell-state`, `editor-toolbar`, `mindmap-tips-drawer`, shared templates).

### 2.3 Map Controls

Implemented in `components/editor/markmap-canvas.tsx` with state wiring in `components/editor/editor-shell.tsx`.

1. Viewport controls: zoom in, zoom out, reset scale (100%), fit view.
2. Option-level toggles: zoom enabled/disabled and drag enabled/disabled.
3. Restore defaults action for core JSON options.
4. Option changes propagate through editor state and are persisted.
5. Zoom percentage now reflects current viewport scale and reset returns to absolute 100%.
6. Editor reset now triggers map auto-fit.
7. Control bar rendering is extracted into a dedicated composed component (`markmap-controls-bar`) to keep canvas logic focused.

### 2.4 Landing Demo (Intentional Behavior)

Implemented in `app/(marketing)/ui/demo.tsx`.

1. Demo is live and interactive.
2. Demo is preview-only and non-persistent by design.
3. Demo uses markmap pipeline correctly.

---

## 3. Optional Post-Completion Backlog

### 3.1 JSON Options End-to-End (Optional Enhancements)

Status: complete.

Implemented:

1. `jsonOptions` state in `editor-shell.tsx`.
2. Passing `jsonOptions` into `MarkmapCanvas`.
3. `mm.setOptions(deriveOptions(jsonOptions))` update path.
4. Persistence/load of options alongside markdown in storage helpers.
5. Runtime merge of parsed markdown `frontmatter.markmap` options into renderer options.
6. Shared transform snapshot helper to ensure frontmatter is applied consistently in playground and landing demo renderers.

Optional enhancements:

1. Rich, first-class options editing surface beyond compact toolbar toggles.

Why this matters:

1. Unlocks configurable behavior (`zoom`, `pan`, `duration`, spacing, expand levels, colors).
2. Aligns with package docs and frontmatter capability.

### 3.2 First-Class Toolbar Controls (Optional Enhancements)

Status: complete for current product scope.

Optional enhancements:

1. Additional authoring-oriented controls as product UX matures.

Implemented now:

1. Zoom in / zoom out.
2. Reset view (100%) and fit view.
3. Collapse all / expand all helpers.
4. Drag/zoom toggles via JSON options.
5. Restore defaults action for map options.
6. File/view actions grouped under a compact menu with icon-based triggers to reduce header clutter.

Why this matters:

1. A core interactive map experience requires viewport control beyond a single fit action.

### 3.3 Import/Export Fidelity Beyond Raw Markdown (Optional Enhancements)

Status: complete for current schema/version.

Optional enhancements:

1. Additional migration entries for future schema versions beyond `1`.

Implemented now:

1. Structured export format includes `{ version, markdown, jsonOptions }`.
2. Structured import path supports same bundle format.
3. Versioned schema baseline (`version: 1`) exists.
4. Import guardrails show explicit failures for empty files, invalid bundle formats, and unsupported bundle versions.
5. Centralized parser/serializer layer exists for bundle versioning and migrations.
6. Legacy unversioned JSON bundles are migrated into version `1` on import.

Why this matters:

1. Markdown-only round-trip loses map-level configuration.

### 3.4 Markmap Authoring Features UX (Optional Enhancements)

Status: complete for current product scope.

Implemented:

1. In-app guidance/examples for frontmatter `markmap` JSON options.
2. In-app guidance/examples for magic comments: `fold`, `foldAll`.
3. Guide-first authoring flow via bottom drawer, with nested snippet drawer for ready-made examples.
4. Quick template insertion helpers with explicit success feedback state in snippet actions.
5. Comprehensive markdown-for-mindmaps guidance covering structure, lists, rich markdown, behavior options, and fold strategies.
6. Starter snippets are compact and guidance focuses on layout-oriented frontmatter fields with reliable behavior.
7. Guide now includes explicit markdown-writing basics (headings, lists, inline formatting, links) before markmap-specific behavior.
8. Drawer typography baseline was increased for better readability across drawers.

Optional enhancements:

1. Optional deeper docs and advanced examples as UX matures.

Why this matters:

1. Users cannot reliably discover advanced behavior without guidance.

### 3.5 Markdown Authoring UX Improvements (Optional Enhancements)

Status: complete for current scope (functional authoring baseline).

Current editor uses a basic textarea by design.

Potential improvements:

1. Better indentation and list ergonomics.
2. Keyboard shortcuts for common structure edits.
3. Optional syntax assistance.
4. Better handling of very large documents.

Why this matters:

1. Full functionality should feel production-grade for actual writing, not only rendering.

### 3.6 Performance Hardening for Large Docs (Completed)

Implemented:

1. Large-document update deferral in `components/editor/markmap-canvas.tsx`:
   - markdown rendering input is deferred (`useDeferredValue`)
   - very large markdown updates are staged with a short delay threshold before map transform/update
2. Threshold-based behavior keeps small-document updates immediate while reducing map update pressure for large inputs.

Why this matters:

1. Prevents lag and preserves responsiveness at scale.

### 3.7 Validation/Test Coverage (Completed)

Implemented:

1. Round-trip import/export schema tests in `lib/editor-exchange.test.ts`.
2. Persistence + error-path storage tests in `lib/storage.test.ts`.
3. Markmap lifecycle regression test (mount/update/unmount) in `components/editor/markmap-canvas.test.tsx`.
4. Test runtime/config added via `vitest.config.ts` + `vitest.setup.ts` and package scripts (`test`, `test:watch`).

Why this matters:

1. Reduces regressions as editor complexity grows.

---

## 4. Post-Completion Roadmap (Optional)

### Phase 1 (Completed)

1. Implement `jsonOptions` state and canvas option updates.
2. Build practical toolbar controls on top of options.
3. Add structured import/export format with markdown + options.

### Phase 2 (Completed)

1. Add in-app help/examples for frontmatter and magic comments.
2. Improve markdown editing ergonomics.
3. Add performance guardrails for larger files.

### Phase 3 (Completed)

1. Add focused tests across lifecycle, options, and import/export.
2. Add edge-case hardening and migration handling for future schema changes.

---

## 5. Acceptance Criteria

Full functionality is considered complete when all criteria below are satisfied:

1. Markdown + map options are both editable, persisted, imported, and exported.
2. Map controls cover practical viewport and interaction needs.
3. Markmap frontmatter and magic comments are documented in-product.
4. Large markdown inputs remain responsive under expected usage.
5. Critical workflows are covered by tests (rendering, persistence, import/export, options updates).

Current outcome:

1. Criteria 1-5 are satisfied in the current implementation baseline.

---

## 6. Source Files Referenced

1. `spec/markmap-packages/context.md`
2. `components/editor/markmap-canvas.tsx`
3. `components/editor/markdown-input.tsx`
4. `components/editor/editor-shell.tsx`
5. `lib/storage.ts`
6. `app/(playground)/playground/page.tsx`
7. `app/(marketing)/ui/demo.tsx`
8. `lib/editor-exchange.test.ts`
9. `lib/storage.test.ts`
10. `components/editor/markmap-canvas.test.tsx`
11. `vitest.config.ts`
