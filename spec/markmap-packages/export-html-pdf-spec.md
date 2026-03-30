# Markymap Export HTML/PDF Spec

> Purpose: define the implementation plan for high-fidelity export formats on the playground route, with Vercel deployment constraints treated as first-class requirements.
> Source baseline: current editor/export implementation, `spec/context.md`, and package research completed on 2026-03-30.

---

## 1. Goal Definition

Markymap currently exports:

1. `.json` for structured editor state
2. `.md` for raw markdown

This is insufficient for users who want to save:

1. the **interactive mindmap itself** in a portable format
2. the **rendered markdown document** as a shareable artifact
3. either surface as a **PDF**

This spec adds two new export targets:

1. **Map HTML** — downloadable interactive markmap document
2. **Markdown PDF** — printable snapshot of the rendered markdown document

The existing `.json` and `.md` exports remain supported.

---

## 1.1 Required Skills

Load these skills before implementing this spec:

1. `next-best-practices`
2. `vercel-react-best-practices`
3. `react-useeffect`
4. `tailwind-css-patterns`
5. `typescript-advanced-types`

Recommended:

1. `coss` for export menu UX changes
2. `fixing-motion-performance` if export interactions or preview states gain extra animation

### Skill-to-Workstream Mapping

1. Route handler and runtime choices:
   `next-best-practices`
2. Client/server boundary for export requests:
   `next-best-practices`, `vercel-react-best-practices`
3. Shared export serializer/types:
   `typescript-advanced-types`
4. Client export state wiring:
   `react-useeffect`, `vercel-react-best-practices`
5. Toolbar and menu expansion:
   `coss`, `tailwind-css-patterns`

---

## 2. Key Product Requirements

### 2.1 User-Facing Outcomes

The playground export menu must support:

1. `Export .json`
2. `Export .md`
3. `Export map .html`
4. `Export markdown .pdf`

### 2.2 Fidelity Requirements

1. Map HTML must preserve markmap interactivity:
   - zoom
   - pan
   - fold/unfold
   - current markmap data/options
2. Markdown PDF must preserve current rendered markdown features:
   - GFM
   - math via KaTeX
   - syntax highlighting
   - sanitized output
3. Markdown PDF output must be derived from the same export HTML, not from a low-fidelity canvas screenshot hack.

### 2.3 Deployment Requirements

Because deployment is on **Vercel**:

1. PDF generation must run in a **Node.js runtime** route handler.
2. The PDF engine must use a **serverless-compatible Chromium strategy**.
3. Client components must not import or execute PDF/browser automation packages directly.

---

## 3. Architecture Decision

### 3.1 Chosen Export Strategy

Use a split pipeline by artifact type:

1. **Map HTML**
   - Generate server-side with `markmap-lib` + `markmap-render`
2. **Markdown PDF**
   - Generate export HTML first, then print that HTML to PDF via headless Chromium

### 3.2 Why This Approach

This is the strongest fit because:

1. markmap’s own render stack already knows how to emit interactive HTML
2. the app already uses most of the markdown parsing plugins needed for markdown document export
3. PDF from generated HTML yields better fidelity than `html2canvas`/client screenshot approaches
4. the server-side pipeline keeps heavy work and incompatible packages out of the client bundle

### 3.3 Explicit Non-Goals

This spec does **not** include:

1. PNG export
2. DOCX export
3. map PDF export
4. markdown HTML export
5. preserving live viewport state in exported PDFs
6. background batch export jobs
7. queued long-running exports or storage uploads

---

## 4. Package Decisions

### 4.1 New Packages To Add

Core export packages:

1. `markmap-render`
2. `unified`
3. `remark-parse`
4. `remark-rehype`
5. `rehype-stringify`

PDF on Vercel:

1. `puppeteer-core`
2. `@sparticuz/chromium`

### 4.2 Existing Packages To Reuse

Already installed and should be reused:

1. `markmap-lib`
2. `markmap-view`
3. `remark-gfm`
4. `remark-math`
5. `rehype-katex`
6. `rehype-highlight`
7. `rehype-sanitize`
8. `katex`
9. `highlight.js`

### 4.3 Packages We Should Avoid Here

Do not use:

1. `html2canvas`
2. `html2pdf.js`
3. `jspdf` HTML rendering path
4. client-only screenshot libraries for the primary export path

Reason:

1. lower CSS/SVG fidelity
2. poorer markmap compatibility
3. worse performance for large documents
4. weaker consistency between HTML and PDF outputs

---

## 5. Export Modes And Data Flow

### 5.1 Map HTML

Input:

1. markdown
2. effective JSON options

Pipeline:

1. transform markdown with `markmap-lib`
2. collect used assets
3. render standalone HTML with `markmap-render`
4. return as downloadable `text/html`

Output characteristics:

1. standalone HTML file
2. interactive map remains usable offline if assets are embedded inline
3. file name default: `markymap-map.html`

### 5.2 Markdown PDF

Input:

1. markdown

Pipeline:

1. parse markdown with `unified`
2. apply `remark-gfm`
3. conditionally apply math/highlight plugins if needed
4. sanitize output
5. stringify final HTML
6. wrap in a complete document shell with app-level export styles
7. print the HTML to PDF via Chromium

Output characteristics:

1. downloadable `application/pdf`
2. file name default: `markymap-markdown.pdf`
3. optimized for document reading on standard page sizes

---

## 6. Vercel-Specific Runtime Plan

### 6.1 Runtime Choice

All PDF route handlers must explicitly use:

```ts
export const runtime = "nodejs"
```

Reason:

1. Edge runtime is the wrong fit for Chromium-based PDF generation
2. `puppeteer-core` and Chromium execution require Node-compatible runtime behavior

### 6.2 Route Handler Shape

Preferred API shape:

1. `POST /api/export/map/html`
2. `POST /api/export/markdown/pdf`

Why separate routes:

1. simpler response typing
2. easier content-type handling
3. clearer debugging on Vercel
4. less branch-heavy server logic

Alternative:

1. one `POST /api/export` route with `kind` + `format`

Decision:

1. Prefer **separate route handlers** unless implementation reveals unnecessary duplication.

### 6.3 Chromium Strategy

For Vercel deployment:

1. use `puppeteer-core`
2. use `@sparticuz/chromium`
3. keep Chromium imports in server-only route handler code
4. if needed, add package externalization in `next.config.ts` after validating build behavior

### 6.4 Response Behavior

All export routes should:

1. validate request body
2. return `400` on invalid payload
3. return `500` on export failures
4. set `Content-Type`
5. set `Content-Disposition: attachment; filename="..."`

---

## 7. Shared Module Design

To keep route handlers thin, introduce shared server utilities.

### 7.1 Proposed Files

1. `lib/export/export-types.ts`
2. `lib/export/export-validation.ts`
3. `lib/export/render-map-html.ts`
4. `lib/export/render-markdown-html.ts`
5. `lib/export/render-pdf.ts`
6. `lib/export/export-shell.ts`

### 7.2 Responsibilities

`render-map-html.ts`

1. transform markdown
2. merge/export effective markmap options
3. return standalone HTML

`render-markdown-html.ts`

1. run unified pipeline
2. produce a complete exportable HTML document

`render-pdf.ts`

1. launch Chromium
2. render provided HTML
3. return PDF bytes

`export-shell.ts`

1. centralize base document wrapper
2. apply shared export CSS
3. manage print-specific CSS rules

### 7.3 Validation Types

The request payload should be explicit and versionable.

Suggested baseline:

```ts
type ExportPayload = {
  markdown: string
  jsonOptions?: MarkmapJsonOptions
}
```

Future-safe extension:

```ts
type ExportTarget = "map" | "markdown"
type ExportFormat = "html" | "pdf"
```

---

## 8. UI Integration Plan

### 8.1 Toolbar Changes

Expand the current `Options` export section in the playground toolbar to include:

1. `Export .json`
2. `Export .md`
3. `Export map .html`
4. `Export markdown .pdf`

### 8.2 Client Interaction Model

Client behavior should be:

1. fire a `POST` request to the relevant route
2. receive `Blob` response
3. trigger a download using `URL.createObjectURL`

### 8.3 Status And Error UX

The editor should surface temporary status for export actions:

1. idle
2. exporting
3. export failed

At minimum:

1. disable duplicate clicks while the same export is in flight
2. show the loading state inline on the specific export menu item with a spinner
3. do not reuse the editor shell status bar for export-loading feedback

### 8.4 Progressive Enhancement

If PDF export fails on deployment/runtime constraints, HTML export should still remain available and fully functional.

---

## 9. Styling And Document Shell Requirements

### 9.1 Export HTML Shell

Both HTML export types need complete documents:

1. `<!doctype html>`
2. `head`
3. `meta charset`
4. `meta viewport`
5. title
6. embedded CSS needed for good standalone rendering

### 9.2 Print CSS

PDF-targeted documents should include:

1. print-safe page margins
2. `-webkit-print-color-adjust: exact`
3. readable typography and contrast
4. avoidance of clipped scroll containers

### 9.3 Markdown PDF Layout

Markdown PDF should likely default to:

1. portrait orientation
2. print background enabled
3. constrained readable measure

---

## 10. Implementation Phases

### Phase 1 — Shared Server Export Foundation

Status: Complete.

1. Install required packages
2. Add shared export type/validation helpers
3. Add map HTML renderer
4. Add markdown HTML renderer
5. Add export document shell

Acceptance criteria:

1. server utilities can generate valid map HTML and markdown HTML from markdown input

### Phase 2 — Route Handlers

Status: Complete.

1. Add HTML export route handlers
2. Add PDF export route handlers
3. Add Vercel-safe Node runtime declarations
4. Add robust error responses

Acceptance criteria:

1. each route returns the correct content type and attachment filename

### Phase 3 — Playground Wiring

Status: Complete.

1. Extend toolbar menu
2. Add client request/download helpers
3. Add export loading/error state
4. Keep existing `.json` and `.md` exports intact
5. Remove unreliable `map/pdf` and `markdown/html` actions

Acceptance criteria:

1. users can download `.json`, `.md`, `map .html`, and `markdown .pdf` from the playground UI

### Phase 4 — Validation And Hardening

Status: In progress.

1. verify local build
2. verify Vercel-compatible build assumptions
3. add focused tests for route validation and shared renderers
4. test larger markdown documents for timeout/rate issues

Completed so far:

1. local production build has already succeeded with the export routes present
2. Vercel-oriented bundling assumptions have been validated at build level
3. export routes now include stronger request validation, no-store headers, and PDF timeout guards

Still open:

1. focused automated tests for export helpers/routes
2. larger-document export verification
3. browser/manual verification of the export flows

Acceptance criteria:

1. export flow is reliable in both local and deployed environments

---

## 11. Validation Plan

### 11.1 Local Validation

Run:

1. `pnpm typecheck`
2. `pnpm lint`
3. `pnpm test`
4. targeted manual export verification in `pnpm dev`

### 11.2 Manual Verification Matrix

Test these cases:

1. short plain markdown
2. nested heading-heavy markdown
3. markdown with GFM tables/task lists
4. markdown with fenced code blocks
5. markdown with math
6. markdown with markmap frontmatter options
7. markdown with `<!-- markmap: fold -->` comments

Verify for each:

1. map HTML downloads and opens
2. markdown PDF downloads and is readable

### 11.3 Deployment Validation

On Vercel preview deployment, verify:

1. route handlers build successfully
2. Chromium launches successfully
3. PDF generation returns within acceptable latency
4. output file sizes remain reasonable

---

## 12. Risks And Mitigations

### 12.1 Vercel Bundle/Runtime Risk

Risk:

1. Chromium-related packages may require bundling adjustments

Mitigation:

1. keep Chromium code isolated to server routes/utilities
2. use Node runtime only
3. add `serverExternalPackages` only if build evidence requires it

### 12.2 PDF Latency Risk

Risk:

1. PDF generation is slower than HTML generation

Mitigation:

1. keep HTML and PDF routes separate
2. keep HTML generation shared and minimal
3. avoid unnecessary asset/network fetches inside export documents

### 12.3 Fidelity Drift Risk

Risk:

1. markdown preview and exported markdown could diverge

Mitigation:

1. share the same plugin choices and sanitization rules where practical
2. centralize markdown export pipeline in one server utility

### 12.4 Large Document Risk

Risk:

1. very large maps may create slow or clipped PDFs

Mitigation:

1. start with practical page defaults
2. prefer readability over perfect whole-map single-page fit
3. refine scale/orientation rules after manual testing

---

## 13. Initial File Targets

Likely new files:

1. `app/api/export/map/html/route.ts`
2. `app/api/export/markdown/pdf/route.ts`
3. `lib/export/export-types.ts`
4. `lib/export/export-validation.ts`
5. `lib/export/render-map-html.ts`
6. `lib/export/render-markdown-html.ts`
7. `lib/export/render-pdf.ts`
8. `lib/export/export-shell.ts`

Likely edited files:

1. `components/editor/editor-toolbar.tsx`
2. `components/editor/use-editor-shell-state.ts`
3. `package.json`
4. `next.config.ts` or `next.config.mjs` only if build externalization is required

---

## 14. Decision Summary

Final recommendation for implementation:

1. Add **interactive map HTML export** with `markmap-render`
2. Add **rendered markdown PDF export** by printing markdown HTML through `puppeteer-core` + `@sparticuz/chromium`
3. Implement PDF via **Node.js route handlers** designed for **Vercel**
4. Keep `.json` and `.md` export paths untouched
5. Do not ship `map/pdf` or `markdown/html` until they have a truly reliable implementation path

Overall status: In progress.
