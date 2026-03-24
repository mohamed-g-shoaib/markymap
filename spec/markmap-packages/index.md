# Markmap Packages — Documentation Index

> This file is the navigation index for all markmap package documentation.
> Each entry includes the canonical URL, a one-line summary, and a relevance note
> for the Markymap project so that any LLM reading this knows exactly which
> packages to focus on and which to skip.

---

## Packages Relevant to Markymap

These are the packages that power the core rendering pipeline in Markymap.
Read their full context in `spec/markmap-packages/context.md`.

### markmap-lib

- **URL**: https://markmap.js.org/docs/packages--markmap-lib
- **Role**: Transforms Markdown strings into a node tree (`root`) plus a `features` map
- **Relevance**: CRITICAL — the entry point for all Markdown → mindmap data conversion
- **Key exports**: `Transformer`, `builtInPlugins`

### markmap-view

- **URL**: https://markmap.js.org/docs/packages--markmap-view
- **Role**: Renders the node tree as an interactive, zoomable, pannable SVG mindmap
- **Relevance**: CRITICAL — the actual renderer mounted onto an SVG element in the React component
- **Key exports**: `Markmap`, `loadCSS`, `loadJS`, `deriveOptions`

### JSON Options

- **URL**: https://markmap.js.org/docs/json-options
- **Role**: Serialisable subset of Markmap's low-level options; can be embedded in Markdown frontmatter
- **Relevance**: HIGH — used to configure color, zoom, pan, animation duration, expand level, node width, etc.
- **Key options**: `color`, `colorFreezeLevel`, `duration`, `initialExpandLevel`, `maxWidth`, `zoom`, `pan`, `spacingHorizontal`, `spacingVertical`, `lineWidth`

### Magic Comments

- **URL**: https://markmap.js.org/docs/magic-comments
- **Role**: Inline HTML comments in Markdown that set initial fold state of nodes
- **Relevance**: MEDIUM — useful to document for users authoring markmaps; supported natively by markmap-lib
- **Supported actions**: `fold`, `foldAll`

---

## Packages NOT Used in Markymap

These packages are documented here for completeness but are not part of the
Markymap rendering pipeline. Do not install or import them unless requirements change.

### markmap-render

- **URL**: https://markmap.js.org/docs/packages--markmap-render
- **Role**: Generates a full standalone interactive HTML file from root + assets via `fillTemplate()`
- **Why skipped**: Markymap renders the SVG directly inside a React component using `markmap-view`;
  we do not need to generate standalone HTML files

### markmap-autoloader

- **URL**: https://markmap.js.org/docs/packages--markmap-autoloader
- **Role**: Browser script that scans the DOM for `.markmap` elements and auto-renders them
- **Why skipped**: Markymap is a React app with explicit component-driven rendering;
  auto-discovery of DOM elements is not needed

### markmap-toolbar

- **URL**: https://markmap.js.org/docs/packages--markmap-toolbar
- **Role**: Creates a floating toolbar element and attaches it to a Markmap instance
- **Why skipped**: Markymap ships its own toolbar built with coss ui components;
  the markmap-toolbar package produces vanilla DOM elements that don't fit the design system

### markmap-cli

- **URL**: https://markmap.js.org/docs/packages--markmap-cli
- **Role**: CLI tool — converts a `.md` file to a standalone HTML markmap file
- **Why skipped**: Command-line tool only; not relevant to the web application

### coc-markmap

- **URL**: https://markmap.js.org/docs/packages--coc-markmap
- **Role**: Neovim/Vim plugin via coc.nvim
- **Why skipped**: Editor plugin; not relevant to the web application

### Use with Node.js Guide

- **URL**: https://markmap.js.org/docs/guide--use-with-nodejs
- **Role**: Shows how to render a markmap to a PNG image server-side using Puppeteer
- **Why skipped**: Markymap is a client-side React app; server-side PNG rendering is out of scope

---

## Quick Reference — Install Commands

```bash
# The only two packages needed for Markymap
pnpm add markmap-lib markmap-view
```

---

## Full Documentation

All fetched page content is consolidated in:
`spec/markmap-packages/context.md`
