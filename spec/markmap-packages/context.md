# Markmap Packages — Implementation Context

> This file is the authoritative reference for implementing the Markdown → Mindmap rendering
> pipeline in Markymap. It consolidates all markmap package documentation into a single,
> actionable document. Read this in full before writing any markmap-related code.

---

## Table of Contents

1. [Package Overview & Install](#1-package-overview--install)
2. [The Rendering Pipeline](#2-the-rendering-pipeline)
3. [markmap-lib — Transformer API](#3-markmap-lib--transformer-api)
4. [markmap-view — Renderer API](#4-markmap-view--renderer-api)
5. [JSON Options Reference](#5-json-options-reference)
6. [Magic Comments Reference](#6-magic-comments-reference)
7. [React Integration Architecture](#7-react-integration-architecture)
8. [Implementation Plan](#8-implementation-plan)
9. [Known Gotchas & Constraints](#9-known-gotchas--constraints)

---

## 1. Package Overview & Install

Only two packages are needed. Both are runtime dependencies.

```bash
pnpm add markmap-lib markmap-view
```

| Package        | Version strategy | Purpose                              |
| -------------- | ---------------- | ------------------------------------ |
| `markmap-lib`  | latest           | Markdown → node tree transformer     |
| `markmap-view` | latest           | Node tree → interactive SVG renderer |

Do **not** install:

- `markmap-render` — generates standalone HTML, not needed in React
- `markmap-autoloader` — DOM auto-discovery, not needed in React
- `markmap-toolbar` — vanilla DOM toolbar, replaced by our coss ui toolbar
- `markmap-cli` — command-line tool only

---

## 2. The Rendering Pipeline

```
Markdown string
      │
      ▼
┌─────────────────────┐
│   markmap-lib       │
│   Transformer       │
│   .transform(md)    │
└─────────┬───────────┘
          │ { root, features }
          ▼
┌─────────────────────┐
│   markmap-lib       │
│   Transformer       │
│   .getUsedAssets()  │
└─────────┬───────────┘
          │ { styles, scripts }
          ▼
┌─────────────────────┐
│   markmap-view      │
│   loadCSS(styles)   │
│   loadJS(scripts)   │
└─────────┬───────────┘
          │ assets loaded into DOM
          ▼
┌─────────────────────┐
│   markmap-view      │
│   Markmap.create(   │
│     svgEl,          │
│     options,        │
│     root            │
│   )                 │
└─────────┬───────────┘
          │ Markmap instance
          ▼
   Interactive SVG mindmap
```

**Key insight**: The `Transformer` is stateless per-transform — it can be instantiated once
and reused for every call to `.transform()`. The `Markmap` instance is stateful and is
bound to a specific SVG DOM element.

---

## 3. markmap-lib — Transformer API

**Source**: https://markmap.js.org/docs/packages--markmap-lib

### Installation

```bash
pnpm add markmap-lib
```

### Importing

With all built-in plugins (recommended for Markymap):

```ts
import { Transformer, builtInPlugins } from "markmap-lib"

// With default built-in plugins (KaTeX, Prism, etc.)
const transformer = new Transformer()

// With additional custom plugins on top of built-ins
const transformer = new Transformer([...builtInPlugins, myPlugin])
```

Without built-in plugins (fine-grained control, available since v0.16.0):

```ts
import { Transformer } from "markmap-lib/no-plugins"
import { pluginFrontmatter } from "markmap-lib/plugins"

// No plugins
const transformer = new Transformer()

// Only the plugins you specify
const transformer = new Transformer([pluginFrontmatter])
```

### Core Method: `transformer.transform(markdown)`

Takes a Markdown string. Returns `{ root, features }`.

```ts
const markdown = `
# My Mindmap

## Branch A
- Item 1
- Item 2

## Branch B
- Item 3
`

const { root, features } = transformer.transform(markdown)
```

- `root` — the root node of the tree. Type: `INode`. Pass directly to `Markmap.create`.
- `features` — an object describing which features (KaTeX, Prism, etc.) were activated
  during parsing. Used to determine which assets are actually needed.

### Getting Assets

After transforming, get only the assets actually required by the content:

```ts
// PREFERRED: only assets that the transformed content actually uses
const { styles, scripts } = transformer.getUsedAssets(features)
```

Or get all possible assets regardless of content (useful when content changes frequently):

```ts
// ALL possible assets — safe but may load more than needed
const { styles, scripts } = transformer.getAssets()
```

- `styles` — array of CSS asset descriptors (to be loaded by `loadCSS`)
- `scripts` — array of JS asset descriptors (to be loaded by `loadJS`)

### What Built-in Plugins Provide

The default `Transformer` includes built-in plugins that enable:

- **KaTeX** — math rendering (`$...$` and `$$...$$`)
- **Prism** — syntax-highlighted code blocks
- **Frontmatter** — YAML frontmatter parsing for JSON options
- **hljs** — alternative code highlighting

For Markymap's initial implementation, use the default `new Transformer()` with all
built-in plugins. The assets will only be loaded if the content actually uses those features.

---

## 4. markmap-view — Renderer API

**Source**: https://markmap.js.org/docs/packages--markmap-view

### Installation

```bash
pnpm add markmap-view
```

### Importing (ESM — used in Markymap)

```ts
import { Markmap, loadCSS, loadJS, deriveOptions } from "markmap-view"
```

### SVG Element Requirement

The renderer needs an SVG element with explicit dimensions in the DOM:

```tsx
<svg id="markmap" style={{ width: "100%", height: "100%" }} />
```

The SVG must be mounted in the DOM before `Markmap.create` is called. In React,
this means using a `ref` and calling `Markmap.create` after mount.

### Loading Assets

Before creating the Markmap instance, load the assets returned by `transformer.getUsedAssets()`:

```ts
const { styles, scripts } = transformer.getUsedAssets(features)

if (styles) loadCSS(styles)
if (scripts) {
  loadJS(scripts, {
    // Required: gives plugins access to the markmap module
    getMarkmap: () => markmap,
  })
}
```

> **Important**: `loadCSS` and `loadJS` insert elements into the document `<head>`.
> They are idempotent — calling them multiple times with the same assets is safe.
> In React, this means you can call them on every re-render without concern.

### Creating a Markmap Instance

```ts
// Using a CSS selector string
const mm = Markmap.create("#markmap", options, root)

// Using an actual SVG element (preferred in React with refs)
const svgEl = svgRef.current
const mm = Markmap.create(svgEl, options, root)
```

- **First argument**: CSS selector string OR actual `SVGSVGElement`
- **Second argument**: `IMarkmapOptions` (low-level) or `undefined`. Use `deriveOptions()` to convert JSON options to this format.
- **Third argument**: `root` node from `transformer.transform()`
- **Returns**: A `Markmap` instance

### Markmap Instance API

Once created, the instance (`mm`) exposes:

```ts
// Update the data (re-renders the mindmap with new root data)
mm.setData(root)

// Update options after creation
mm.setOptions(options)

// Fit the mindmap to the SVG viewport
mm.fit()

// Destroy the instance and clean up
mm.destroy()
```

### Updating an Existing Markmap

When the Markdown content changes, **do not destroy and recreate** the Markmap.
Instead update in place to preserve zoom/pan state:

```ts
// Transform new markdown
const { root, features } = transformer.transform(newMarkdown)

// Load any new assets
const assets = transformer.getUsedAssets(features)
if (assets.styles) loadCSS(assets.styles)
if (assets.scripts) loadJS(assets.scripts, { getMarkmap: () => markmap })

// Update the existing instance
mm.setData(root)
```

### Converting JSON Options to Low-Level Options

```ts
import { deriveOptions } from "markmap-view"

const jsonOptions = {
  color: ["#6366f1", "#8b5cf6", "#06b6d4"],
  duration: 300,
  initialExpandLevel: 2,
}

const options = deriveOptions(jsonOptions)
const mm = Markmap.create(svgEl, options, root)
```

---

## 5. JSON Options Reference

**Source**: https://markmap.js.org/docs/json-options

JSON options are serialisable (no functions), making them safe to store in localStorage,
export to files, and embed in Markdown frontmatter.

### How to Embed in Markdown Frontmatter

```markdown
---
markmap:
  color:
    - "#6366f1"
    - "#8b5cf6"
  duration: 300
  initialExpandLevel: 2
---

# My Mindmap

## Branch A

...
```

The `Transformer` with the `pluginFrontmatter` plugin (included in `builtInPlugins`) will
parse this automatically and merge it into the node tree options.

### Complete Option Reference

#### `color`

- **Type**: `string | string[]`
- **Default**: `d3.schemeCategory10` (10-color categorical palette)
- A list of CSS color values used for branch and circle colors at each level.
- Colors cycle through the list. If only one color is given, all branches share it.

```json
{ "color": ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981"] }
```

#### `colorFreezeLevel`

- **Type**: `number`
- **Default**: `0` (no freeze)
- Freeze color assignment at a specific depth level. All descendants of a node at
  the freeze level will inherit that node's color.
- Useful for making large markmaps more visually organized.

```json
{ "colorFreezeLevel": 2 }
```

#### `duration`

- **Type**: `number` (milliseconds)
- **Default**: `500`
- Animation duration for fold/unfold transitions.
- Set to `0` to disable animations entirely (useful for screenshots or low-motion preference).

```json
{ "duration": 300 }
```

#### `maxWidth`

- **Type**: `number` (pixels)
- **Default**: `0` (no limit)
- Maximum width of each node's content box. Nodes wider than this will wrap.

```json
{ "maxWidth": 300 }
```

#### `initialExpandLevel`

- **Type**: `number`
- **Default**: `-1` (expand all levels)
- The maximum depth of nodes to expand when the markmap first renders.
- `1` shows only the root and its direct children.
- `-1` expands everything.

```json
{ "initialExpandLevel": 2 }
```

#### `zoom`

- **Type**: `boolean`
- **Default**: `true`
- Whether to allow the user to zoom the markmap with scroll/pinch.

```json
{ "zoom": true }
```

#### `pan`

- **Type**: `boolean`
- **Default**: `true`
- Whether to allow the user to pan (drag) the markmap.

```json
{ "pan": true }
```

#### `spacingHorizontal`

- **Type**: `number` (pixels)
- **Default**: `80`
- Horizontal spacing between parent and child nodes.

```json
{ "spacingHorizontal": 80 }
```

#### `spacingVertical`

- **Type**: `number` (pixels)
- **Default**: `5`
- Vertical spacing between sibling nodes.

```json
{ "spacingVertical": 5 }
```

#### `lineWidth`

- **Type**: `number` (pixels)
- **Since**: `v0.18.8`
- The stroke width of lines (branches) connecting nodes.
- Defaults to a calculated value based on depth if not set.

```json
{ "lineWidth": 2 }
```

#### `extraJs`

- **Type**: `string[]`
- **Default**: none
- Additional JavaScript URLs to load. URLs starting with `npm:` are resolved to CDN.

```json
{ "extraJs": ["npm:katex/dist/katex.min.js"] }
```

#### `extraCss`

- **Type**: `string[]`
- **Default**: none
- Additional CSS URLs to load. URLs starting with `npm:` are resolved to CDN.

```json
{ "extraCss": ["npm:katex/dist/katex.min.css"] }
```

#### `htmlParser`

- **Type**: `{ selector: string }`
- Override the internal HTML parser's element selectors.

#### `activeNode` _(markmap.js.org and VSCode only)_

- **Type**: `{ placement: 'center' | 'visible' }`
- **Default**: `{ placement: 'visible' }`
- Controls where the active node is placed in the viewport.
- Not applicable to Markymap's custom implementation.

### Default Options for Markymap

A sensible baseline for Markymap to store in localStorage or apply as defaults:

```ts
const DEFAULT_JSON_OPTIONS = {
  color: [
    "#6366f1", // indigo
    "#8b5cf6", // violet
    "#06b6d4", // cyan
    "#10b981", // emerald
    "#f59e0b", // amber
    "#ef4444", // red
  ],
  duration: 300,
  initialExpandLevel: -1,
  zoom: true,
  pan: true,
  spacingHorizontal: 80,
  spacingVertical: 5,
  maxWidth: 0,
} as const
```

---

## 6. Magic Comments Reference

**Source**: https://markmap.js.org/docs/magic-comments

Magic comments are inline HTML comments placed directly on a Markdown list item or heading.
They are parsed natively by `markmap-lib` and control the initial fold state of a node.

### Syntax

```
<!-- markmap: ACTION -->
```

The comment must begin with exactly `markmap: ` (with a space after the colon).

### Supported Actions

#### `fold`

Folds only the node the comment is placed on. Its direct children are hidden on initial render.

```markdown
## Section A <!-- markmap: fold -->

- child 1
- child 2
```

#### `foldAll`

Folds the node and all of its descendants recursively.

```markdown
- Large branch <!-- markmap: foldAll -->
  - sub 1
    - sub 1.1
    - sub 1.2
  - sub 2
    - sub 2.1
```

### Example

```markdown
# Project Overview

## Active Work <!-- markmap: fold -->

- Feature A
- Feature B

## Archive <!-- markmap: foldAll -->

- Old feature 1
  - sub item
- Old feature 2
  - sub item
```

On initial render, "Active Work" will be collapsed (its children hidden), and
"Archive" will be collapsed along with all of its nested children.

---

## 7. React Integration Architecture

This section describes the exact component architecture to use when implementing
the markmap editor in Markymap.

### Component Split

```
app/page.tsx                     ← Server Component (RSC)
└── components/editor/
    ├── editor-shell.tsx         ← "use client" boundary, owns shared state
    ├── markdown-input.tsx       ← "use client", textarea for raw markdown
    └── markmap-canvas.tsx       ← "use client", SVG + Markmap instance
```

### State Ownership

`editor-shell.tsx` is the shared parent that owns:

- `markdown` — the current Markdown string (state)
- `jsonOptions` — the current JSON options (state, loaded from localStorage)
- Passes `markdown` down to both `markdown-input` and `markmap-canvas`

### markmap-canvas.tsx — Implementation Pattern

```tsx
"use client"

import * as React from "react"
import { Transformer } from "markmap-lib"
import * as markmap from "markmap-view"
import { Markmap, loadCSS, loadJS, deriveOptions } from "markmap-view"

// Singleton transformer — instantiated once per module, not per component render.
// new Transformer() is expensive (initialises markdown-it + all plugins).
// .transform() is a pure function — safe to call from any number of renders.
const transformer = new Transformer()

interface MarkmapCanvasProps {
  markdown: string
  jsonOptions?: Record<string, unknown>
}

export function MarkmapCanvas({ markdown, jsonOptions }: MarkmapCanvasProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const mmRef = React.useRef<Markmap | null>(null)

  // useEffectEvent — reads the latest markdown/jsonOptions at call time but is
  // NOT reactive, so it does not appear in the mount effect's dependency array.
  // This is the correct React 19 pattern: no eslint-disable, no stale closure.
  const initMarkmap = React.useEffectEvent(() => {
    if (!svgRef.current) return

    const { root, features } = transformer.transform(markdown)
    const assets = transformer.getUsedAssets(features)

    if (assets.styles) loadCSS(assets.styles)
    if (assets.scripts) loadJS(assets.scripts, { getMarkmap: () => markmap })

    const options = jsonOptions ? deriveOptions(jsonOptions) : undefined
    mmRef.current = Markmap.create(svgRef.current, options, root)
  })

  // Mount: create the Markmap instance exactly once.
  // initMarkmap is an EffectEvent — intentionally excluded from deps.
  // The empty array is genuinely correct here, not a suppressed warning.
  useEffect(() => {
    initMarkmap()
    return () => {
      mmRef.current?.destroy()
      mmRef.current = null
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps -- initMarkmap is an EffectEvent, not a reactive value

  // Update: re-render when markdown changes without destroying the instance.
  // Preserves zoom, pan, and folded state. Cheaper than a full re-create.
  useEffect(() => {
    if (!mmRef.current) return

    const { root, features } = transformer.transform(markdown)
    const assets = transformer.getUsedAssets(features)

    if (assets.styles) loadCSS(assets.styles)
    if (assets.scripts) loadJS(assets.scripts, { getMarkmap: () => markmap })

    mmRef.current.setData(root)
  }, [markdown])

  // Update options separately when they change.
  useEffect(() => {
    if (!mmRef.current || !jsonOptions) return
    mmRef.current.setOptions(deriveOptions(jsonOptions))
  }, [jsonOptions])

  // ✅ No inline style — sized via Tailwind to fill its container.
  return <svg ref={svgRef} className="size-full" />
}
```

### Why the Transformer is a Module Singleton

`new Transformer()` loads and initialises markdown-it and all plugins. This is expensive.
It must be created once at module level, not inside a component or effect. The transformer
instance is completely safe to share — `.transform()` is a pure function with no side effects
on the instance.

```ts
// ✅ Module level — created once
const transformer = new Transformer();

export function MarkmapCanvas() { ... }
```

```ts
// ❌ Inside component — recreated on every render
export function MarkmapCanvas() {
  const transformer = new Transformer() // wrong
}
```

### Why `useEffectEvent` Instead of `eslint-disable`

The mount effect reads `markdown` and `jsonOptions` to perform the initial render, but it
must not re-run when those values change (re-running would destroy and recreate the entire
Markmap instance, resetting zoom and pan).

The naive fix is to suppress the dependency lint rule:

```ts
// ❌ Never do this — hides a real problem and creates a stale closure
// eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

The correct React 19 fix is `useEffectEvent`. An EffectEvent is a function that:

- Always reads the **latest** values of its captured variables at call time (no stale closure)
- Is **not reactive** — changes to its captured values do not trigger the enclosing effect

```ts
// ✅ Correct — latest values, no re-trigger, no suppressed warnings
const initMarkmap = React.useEffectEvent(() => {
  // reads latest markdown and jsonOptions here
})

useEffect(() => {
  initMarkmap() // called once on mount, always uses current values
}, [])
```

This pattern is already in use in `components/theme-provider.tsx` (`toggleTheme`,
`onClick` EffectEvents). Always follow this pattern. Never suppress exhaustive-deps.

### Why Two Separate useEffect Calls

The mount effect creates the instance. The update effect uses `mm.setData()` to update
data without destroying the instance, which:

1. Preserves the user's current zoom and pan state
2. Plays the fold/unfold animation smoothly
3. Is significantly cheaper than a full re-create

### Fit-to-View

After setting new data, call `mm.fit()` to re-fit the mindmap to the viewport if desired.
In Markymap, this should be a user-triggered action (toolbar button), not automatic,
so the user's zoom state is not reset on every keystroke.

---

## 8. Implementation Plan

Tasks in order of dependency. Each task is self-contained and can be completed independently.

### Task 1 — Install packages

```bash
pnpm add markmap-lib markmap-view
```

Verify types are included. Both packages ship their own TypeScript declarations.

### Task 2 — Create the Markmap canvas component

File: `components/editor/markmap-canvas.tsx`

- `"use client"` directive
- Module-level `Transformer` singleton
- `svgRef` and `mmRef` refs
- Mount effect: create instance
- Update effect: `mm.setData()` on markdown change
- Options effect: `mm.setOptions()` on jsonOptions change
- Returns bare `<svg>` element sized to fill its container

### Task 3 — Create the Markdown input component

File: `components/editor/markdown-input.tsx`

- `"use client"` directive
- Uses `<Textarea>` from `components/ui/textarea`
- Calls `onChange(value)` prop on every keystroke
- Debounce is handled by the parent (editor-shell), not here
- Displays line numbers optionally (future enhancement)

### Task 4 — Create the editor shell

File: `components/editor/editor-shell.tsx`

- `"use client"` directive
- Owns `markdown` state — **initialise with lazy `useState` to read localStorage once
  synchronously before first render**, avoiding a `useEffect` + extra render cycle:
  ```ts
  // ✅ Lazy initializer — runs once, no effect, no flicker
  const [markdown, setMarkdown] = useState(
    () => loadContent() ?? DEFAULT_MARKDOWN
  )
  const [jsonOptions, setJsonOptions] = useState(
    () => loadOptions() ?? DEFAULT_JSON_OPTIONS
  )
  ```
- Auto-saves to localStorage with a **500ms debounce** using `useRef` for the timer ID
  (transient value — must not live in `useState`). Debounce fires from the `onChange`
  handler, not from a `useEffect` watching markdown:

  ```ts
  // ✅ useRef for timer — no re-renders, no watching effect
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleMarkdownChange(value: string) {
    setMarkdown(value)
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => saveContent(value), 500)
  }
  ```

- Passes `markdown` and `setMarkdown` down to both `MarkdownInput` and `MarkmapCanvas`
- Renders a split-pane layout: input left, canvas right

### Task 5 — Wire up the root page

File: `app/page.tsx`

- Remains a Server Component
- Imports and renders `EditorShell` as a leaf client component
- Exports `generateMetadata()` for SEO

### Task 6 — Implement localStorage persistence layer

Logic lives in `editor-shell.tsx` or a dedicated `lib/storage.ts`:

```ts
// lib/storage.ts

const CONTENT_KEY = "markymap:content"
const OPTIONS_KEY = "markymap:options"

export function loadContent(): string | null {
  try {
    return localStorage.getItem(CONTENT_KEY)
  } catch {
    return null
  }
}

export function saveContent(markdown: string): void {
  try {
    localStorage.setItem(CONTENT_KEY, markdown)
  } catch {
    // Quota exceeded or private browsing — silently ignore
  }
}

export function loadOptions(): Record<string, unknown> | null {
  try {
    const raw = localStorage.getItem(OPTIONS_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveOptions(options: Record<string, unknown>): void {
  try {
    localStorage.setItem(OPTIONS_KEY, JSON.stringify(options))
  } catch {}
}
```

Always wrap localStorage calls in try/catch — it can throw in:

- Private/incognito browsing mode
- When storage quota is exceeded
- In environments where localStorage is blocked

### Task 7 — Implement Export

Export the current markdown as a `.md` file download:

```ts
export function exportMarkdown(
  markdown: string,
  filename = "mindmap.md"
): void {
  const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
```

### Task 8 — Implement Import

Import a `.md` file and load it into the editor:

```ts
export function importMarkdown(onLoad: (markdown: string) => void): void {
  const input = document.createElement("input")
  input.type = "file"
  input.accept = ".md,text/markdown,text/plain"
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onLoad(reader.result)
      }
    }
    reader.readAsText(file)
  }
  input.click()
}
```

### Task 9 — Toolbar

Build using `components/ui/toolbar.tsx` from coss ui. Actions:

| Action        | Implementation                                                 |
| ------------- | -------------------------------------------------------------- |
| Fit to view   | `mmRef.current?.fit()` — expose via callback prop or ref       |
| Export        | calls `exportMarkdown(markdown)`                               |
| Import        | calls `importMarkdown(setMarkdown)`                            |
| Toggle editor | shows/hides the left panel                                     |
| Zoom in / out | call `mm.setOptions({ zoom: true })` + trigger via D3 zoom API |

---

## 9. Known Gotchas & Constraints

### Skills Audit Notes (verified against project skill files)

The implementation plan in this file has been audited against the following skills:

- `.agents/skills/react-useeffect/` — useEffect anti-patterns and alternatives
- `.agents/skills/vercel-react-best-practices/` — rules 5.10 (lazy state init), 5.12 (useRef for transient values), 8.3 (useEffectEvent)
- `.agents/skills/next-best-practices/rsc-boundaries.md` — client/server boundary rules
- `.agents/skills/next-best-practices/directives.md` — `'use client'` placement rules

**All four violations found in the original plan have been corrected:**

| #   | Violation                                                              | Fix Applied                                                               |
| --- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 1   | `eslint-disable` suppressing stale closure in mount effect             | `useEffectEvent` (`initMarkmap`) reads latest values non-reactively       |
| 2   | `style={{ width: '100%', height: '100%' }}` inline style on `<svg>`    | Replaced with `className="size-full"` (Tailwind)                          |
| 3   | localStorage loaded in `useEffect` (extra render, possible double-run) | Lazy `useState(() => loadContent() ?? DEFAULT)` — runs once synchronously |
| 4   | Debounce timer not specified — implied `useEffect` watch               | `useRef` for timer, debounce fires in `onChange` handler, not an effect   |

### SSR / Next.js App Router

`markmap-lib` and `markmap-view` access browser APIs (`document`, `window`, `SVGElement`).
They **cannot** run on the server. Ensure:

1. Any file importing these packages has `"use client"` at the top.
2. The module-level `new Transformer()` is inside a `"use client"` file.
3. If dynamic imports are needed, use:

```ts
const { Transformer } = await import("markmap-lib")
```

But prefer static imports inside `"use client"` components — they're simpler and work correctly
because Next.js excludes `"use client"` modules from the SSR bundle.

### Markmap Instance Lifecycle

The `Markmap` instance must be destroyed when the component unmounts:

```ts
useEffect(() => {
  const mm = Markmap.create(svgEl, options, root)
  mmRef.current = mm

  return () => {
    mm.destroy()
    mmRef.current = null
  }
}, [])
```

Failing to destroy leaks D3 zoom event listeners and animation frame handles.

### `loadJS` and `loadCSS` are Document-Level

These functions insert `<link>` and `<script>` tags into `document.head`. They are not
React-managed. They do not need to be cleaned up because:

1. They are idempotent (safe to call multiple times)
2. The assets they load (KaTeX, Prism) are reusable across renders
3. Removing them on unmount would break any other markmap on the page

### SVG Must Have Explicit Dimensions

If the SVG has `width: 0` or `height: 0` at the time `Markmap.create` is called,
the markmap renders invisibly. Always ensure the SVG container has non-zero dimensions
before calling `Markmap.create`. Use `useLayoutEffect` if dimension timing is critical,
or ensure CSS is applied before the effect runs.

### `setData` vs Recreating

Always use `mm.setData(root)` to update the mindmap when content changes.
Never destroy and recreate the instance in response to content changes —
this resets zoom, pan, and the folded state of all nodes.

Only recreate the instance when the SVG element itself changes (e.g. the component remounts).

### Transformer Plugin Assets

The default `Transformer` loads assets for KaTeX, Prism, etc. via `getUsedAssets(features)`.
These assets point to CDN URLs. If offline support is required in the future, use
`transformer.getAssets()` and `{ jsonOptions: { ... } }` with `markmap-render`'s
`fillTemplate` to inline them, but this is out of scope for the initial implementation.

### TypeScript Types

Both packages ship TypeScript declarations. Key types to be aware of:

```ts
// From markmap-lib
import type { INode } from "markmap-lib" // the root node type

// From markmap-view
import type { Markmap } from "markmap-view" // the instance class
import type { IMarkmapOptions } from "markmap-view" // low-level options
```

Check the actual exported type names after installation with:

```bash
pnpm exec tsc --noEmit
```

And adjust imports based on what the packages actually export.

---

## Summary — What to Build First

1. `pnpm add markmap-lib markmap-view`
2. `lib/storage.ts` — localStorage read/write with try/catch
3. `components/editor/markmap-canvas.tsx` — SVG renderer, module-level transformer
4. `components/editor/markdown-input.tsx` — controlled textarea
5. `components/editor/editor-shell.tsx` — state owner, auto-save, layout
6. Update `app/page.tsx` to render `EditorShell`
7. Add export/import utilities
8. Build the toolbar with coss ui components
