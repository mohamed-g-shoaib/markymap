const BASE_DOCUMENT_STYLES = `
:root {
  color-scheme: light;
  --background: #fcfcfb;
  --foreground: #161615;
  --muted: #f1f0ee;
  --muted-foreground: #5f5b57;
  --border: rgba(22, 22, 21, 0.12);
  --code-bg: #f4f3f1;
  --link: #1565c0;
}

* {
  box-sizing: border-box;
}

html {
  background: var(--background);
  color: var(--foreground);
  font-family:
    "Google Sans",
    "Inter",
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    sans-serif;
}

body {
  margin: 0;
  background: var(--background);
  color: var(--foreground);
}

a {
  color: var(--link);
}

pre,
code,
kbd,
samp {
  font-family:
    "Google Sans Code",
    "SFMono-Regular",
    Consolas,
    "Liberation Mono",
    Menlo,
    monospace;
}

@page {
  margin: 16mm;
}

@media print {
  html,
  body {
    background: #ffffff;
  }

  body {
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
`

const MARKDOWN_EXPORT_HEAD_TAGS = [
  '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.44/dist/katex.min.css" />',
  '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css" />',
]

const MARKDOWN_DOCUMENT_STYLES = `
.markdown-export {
  width: min(100%, 960px);
  margin: 0 auto;
  padding: 40px 24px 56px;
}

.markdown-export > :first-child {
  margin-top: 0;
}

.markdown-export > :last-child {
  margin-bottom: 0;
}

.markdown-export h1,
.markdown-export h2,
.markdown-export h3,
.markdown-export h4,
.markdown-export h5,
.markdown-export h6 {
  line-height: 1.15;
  letter-spacing: -0.02em;
}

.markdown-export h1 {
  margin: 0 0 18px;
  font-size: 2.125rem;
}

.markdown-export h2 {
  margin: 36px 0 14px;
  font-size: 1.625rem;
}

.markdown-export h3 {
  margin: 28px 0 12px;
  font-size: 1.25rem;
}

.markdown-export p,
.markdown-export ul,
.markdown-export ol,
.markdown-export blockquote,
.markdown-export table,
.markdown-export pre,
.markdown-export hr {
  margin: 16px 0;
}

.markdown-export ul,
.markdown-export ol {
  padding-left: 24px;
}

.markdown-export li + li {
  margin-top: 6px;
}

.markdown-export blockquote {
  border-left: 3px solid var(--border);
  color: var(--muted-foreground);
  padding-left: 16px;
}

.markdown-export hr {
  border: 0;
  border-top: 1px solid var(--border);
}

.markdown-export table {
  width: 100%;
  border-collapse: collapse;
}

.markdown-export th,
.markdown-export td {
  border: 1px solid var(--border);
  padding: 10px 12px;
  text-align: left;
  vertical-align: top;
}

.markdown-export th {
  background: var(--muted);
}

.markdown-export code {
  background: var(--code-bg);
  border-radius: 6px;
  padding: 0.15em 0.4em;
  font-size: 0.95em;
}

.markdown-export pre {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: 16px;
  background: #f8f7f5;
  padding: 14px 16px;
}

.markdown-export pre code {
  background: transparent;
  border-radius: 0;
  padding: 0;
}

.markdown-export img,
.markdown-export svg {
  max-width: 100%;
}

@media print {
  .markdown-export {
    width: auto;
    margin: 0;
    padding: 0;
  }
}
`

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

export async function getMarkdownExportStyles() {
  return [BASE_DOCUMENT_STYLES, MARKDOWN_DOCUMENT_STYLES].join("\n")
}

export function getMarkdownExportHeadTags() {
  return MARKDOWN_EXPORT_HEAD_TAGS
}

export function createHtmlDocument(input: {
  body: string
  headTags?: string[]
  lang?: string
  styles?: string
  title: string
}) {
  const { body, headTags = [], lang = "en", styles = "", title } = input

  return [
    "<!doctype html>",
    `<html lang="${escapeHtml(lang)}">`,
    "<head>",
    '<meta charset="UTF-8" />',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0" />',
    `<title>${escapeHtml(title)}</title>`,
    ...headTags,
    styles ? `<style>${styles}</style>` : "",
    "</head>",
    "<body>",
    body,
    "</body>",
    "</html>",
  ]
    .filter(Boolean)
    .join("")
}
