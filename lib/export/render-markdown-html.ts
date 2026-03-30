import rehypeHighlight from "rehype-highlight"
import rehypeKatex from "rehype-katex"
import rehypeSanitize, {
  defaultSchema,
  type Options as SanitizeSchema,
} from "rehype-sanitize"
import rehypeStringify from "rehype-stringify"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import remarkParse from "remark-parse"
import remarkRehype from "remark-rehype"
import { unified } from "unified"

import {
  createHtmlDocument,
  getMarkdownExportHeadTags,
  getMarkdownExportStyles,
} from "@/lib/export/export-shell"

const LEADING_FRONTMATTER_PATTERN = /^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/
const MARKMAP_COMMENT_PATTERN = /<!--\s*markmap:\s*(?:fold|foldAll)\s*-->/gi

const MARKDOWN_EXPORT_SANITIZE_ATTRIBUTES = {
  ...defaultSchema.attributes,
  code: [
    ...((defaultSchema.attributes?.code as unknown[]) ?? []),
    ["className", /^language-./, "math-inline", "math-display"],
  ],
  span: [
    ...((defaultSchema.attributes?.span as unknown[]) ?? []),
    ["className"],
  ],
} as NonNullable<SanitizeSchema["attributes"]>

const MARKDOWN_EXPORT_SANITIZE_SCHEMA: SanitizeSchema = {
  ...defaultSchema,
  attributes: MARKDOWN_EXPORT_SANITIZE_ATTRIBUTES,
}

function getPreviewMarkdown(markdown: string) {
  let next = markdown.replace(MARKMAP_COMMENT_PATTERN, "").trimStart()

  if (LEADING_FRONTMATTER_PATTERN.test(next)) {
    next = next.replace(LEADING_FRONTMATTER_PATTERN, "")
  }

  return next.trimStart()
}

export async function renderMarkdownHtml(input: { markdown: string }) {
  const previewMarkdown = getPreviewMarkdown(input.markdown)
  const bodyContent = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeSanitize, MARKDOWN_EXPORT_SANITIZE_SCHEMA)
      .use(rehypeKatex)
      .use(rehypeHighlight)
      .use(rehypeStringify)
      .process(previewMarkdown)
  )
  const styles = await getMarkdownExportStyles()

  return createHtmlDocument({
    title: "Markymap Markdown Export",
    headTags: getMarkdownExportHeadTags(),
    styles,
    body: `<main class="markdown-export">${bodyContent}</main>`,
  })
}
