"use client"

import * as React from "react"
import { Tick02Icon, Copy01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"
import ReactMarkdown from "react-markdown"
import type { Options as ReactMarkdownOptions } from "react-markdown"
import rehypeSanitize, { defaultSchema } from "rehype-sanitize"
import remarkGfm from "remark-gfm"
import { ScrollFadeEffect } from "@/components/ui/scroll-fade-effect"
import { cn } from "@/lib/utils"

type PluginList = NonNullable<ReactMarkdownOptions["remarkPlugins"]>

type MarkdownPreviewProps = {
  markdown: string
  className?: string
}

type CodeBlockProps = {
  className?: string
  children?: React.ReactNode
  code: string
}

const LEADING_FRONTMATTER_PATTERN = /^---\s*\n[\s\S]*?\n---\s*(?:\n|$)/
const MARKMAP_COMMENT_PATTERN = /<!--\s*markmap:\s*(?:fold|foldAll)\s*-->/gi
const MATH_SYNTAX_PATTERN = /\$\$[\s\S]*?\$\$|\$[^$\n]+\$|\\\(|\\\[/
const CODE_BLOCK_SYNTAX_PATTERN = /(^|\n)\s*(```|~~~)/

const MARKDOWN_PREVIEW_SANITIZE_SCHEMA = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    code: [
      ...((defaultSchema.attributes?.code as unknown[]) ?? []),
      ["className", /^language-./, "math-inline", "math-display"],
    ],
  },
}

function getPreviewMarkdown(markdown: string) {
  let next = markdown.replace(MARKMAP_COMMENT_PATTERN, "").trimStart()

  if (LEADING_FRONTMATTER_PATTERN.test(next)) {
    next = next.replace(LEADING_FRONTMATTER_PATTERN, "")
  }

  return next.trimStart()
}

function getCodeLanguage(className: string | undefined) {
  if (!className) {
    return "text"
  }

  const match = /language-([\w-]+)/.exec(className)

  return match?.[1] ?? "text"
}

function getCodeText(node: React.ReactNode) {
  function walk(value: React.ReactNode): string {
    if (value === null || value === undefined || typeof value === "boolean") {
      return ""
    }

    if (typeof value === "string" || typeof value === "number") {
      return String(value)
    }

    if (Array.isArray(value)) {
      return value.map(walk).join("")
    }

    if (React.isValidElement<{ children?: React.ReactNode }>(value)) {
      return walk(value.props.children)
    }

    return ""
  }

  return walk(node).replace(/\n$/, "")
}

function MarkdownCodeBlock({ className, children, code }: CodeBlockProps) {
  const [copied, setCopied] = React.useState(false)
  const language = getCodeLanguage(className)

  const handleCopy = React.useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return
    }

    void navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      window.setTimeout(() => {
        setCopied(false)
      }, 1200)
    })
  }, [code])

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-border/80 bg-muted/35">
      <div className="flex h-8 items-center justify-between border-b border-border/80 px-2.5">
        <p className="font-mono text-[10px] tracking-wide text-muted-foreground uppercase">
          {language}
        </p>
        <button
          type="button"
          className="inline-flex h-5 w-5 items-center justify-center p-0 text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-0 focus-visible:outline-none"
          aria-label={copied ? "Code copied" : "Copy code"}
          onClick={handleCopy}
        >
          <HugeiconsIcon
            icon={copied ? Tick02Icon : Copy01Icon}
            size={14}
            color="currentColor"
          />
        </button>
      </div>
      <pre className="markdown-code-scroll m-0 scrollbar-subtle overflow-x-auto px-2.5 py-2">
        <code className={className}>{children ?? code}</code>
      </pre>
    </div>
  )
}

export function MarkdownPreview({ markdown, className }: MarkdownPreviewProps) {
  const previewMarkdown = React.useMemo(
    () => getPreviewMarkdown(markdown),
    [markdown]
  )
  const [remarkMathPlugin, setRemarkMathPlugin] = React.useState<
    PluginList[number] | null
  >(null)
  const [rehypeKatexPlugin, setRehypeKatexPlugin] = React.useState<
    PluginList[number] | null
  >(null)
  const [rehypeHighlightPlugin, setRehypeHighlightPlugin] = React.useState<
    PluginList[number] | null
  >(null)
  const hasContent = previewMarkdown.trim().length > 0
  const shouldEnableMath = React.useMemo(
    () => MATH_SYNTAX_PATTERN.test(previewMarkdown),
    [previewMarkdown]
  )
  const shouldEnableHighlight = React.useMemo(
    () => CODE_BLOCK_SYNTAX_PATTERN.test(previewMarkdown),
    [previewMarkdown]
  )

  React.useEffect(() => {
    if (!shouldEnableMath) {
      return
    }

    if (remarkMathPlugin && rehypeKatexPlugin) {
      return
    }

    let cancelled = false

    void Promise.all([import("remark-math"), import("rehype-katex")])
      .then(([remarkMathModule, rehypeKatexModule]) => {
        if (cancelled) {
          return
        }

        setRemarkMathPlugin(
          () => remarkMathModule.default as PluginList[number]
        )
        setRehypeKatexPlugin(
          () => rehypeKatexModule.default as PluginList[number]
        )
      })
      .catch(() => {
        // If optional plugins fail to load, preview gracefully falls back to plain markdown rendering.
      })

    return () => {
      cancelled = true
    }
  }, [rehypeKatexPlugin, remarkMathPlugin, shouldEnableMath])

  React.useEffect(() => {
    if (!shouldEnableHighlight) {
      return
    }

    if (rehypeHighlightPlugin) {
      return
    }

    let cancelled = false

    void import("rehype-highlight")
      .then((rehypeHighlightModule) => {
        if (cancelled) {
          return
        }

        setRehypeHighlightPlugin(
          () => rehypeHighlightModule.default as PluginList[number]
        )
      })
      .catch(() => {
        // If optional highlighting plugin fails to load, preview falls back to plain code blocks.
      })

    return () => {
      cancelled = true
    }
  }, [rehypeHighlightPlugin, shouldEnableHighlight])

  const isMathReady = Boolean(
    shouldEnableMath && remarkMathPlugin && rehypeKatexPlugin
  )
  const isHighlightReady = Boolean(
    shouldEnableHighlight && rehypeHighlightPlugin
  )

  const remarkPlugins = React.useMemo(() => {
    const plugins: PluginList = [remarkGfm]

    if (isMathReady && remarkMathPlugin) {
      plugins.push(remarkMathPlugin)
    }

    return plugins
  }, [isMathReady, remarkMathPlugin])

  const rehypePlugins = React.useMemo(() => {
    const plugins: NonNullable<ReactMarkdownOptions["rehypePlugins"]> = [
      [rehypeSanitize, MARKDOWN_PREVIEW_SANITIZE_SCHEMA],
    ]

    if (isMathReady && rehypeKatexPlugin) {
      plugins.push(rehypeKatexPlugin)
    }

    if (isHighlightReady && rehypeHighlightPlugin) {
      plugins.push(rehypeHighlightPlugin)
    }

    return plugins
  }, [isHighlightReady, isMathReady, rehypeHighlightPlugin, rehypeKatexPlugin])

  const components = React.useMemo<ReactMarkdownOptions["components"]>(
    () => ({
      pre(props) {
        const childrenArray = React.Children.toArray(props.children)
        const firstChild = childrenArray[0]

        if (!React.isValidElement(firstChild)) {
          return <pre {...props} />
        }

        const codeProps = firstChild.props as {
          className?: string
          children?: React.ReactNode
        }
        const code = getCodeText(codeProps.children ?? "")

        return (
          <MarkdownCodeBlock className={codeProps.className} code={code}>
            {codeProps.children}
          </MarkdownCodeBlock>
        )
      },
    }),
    []
  )

  if (!hasContent) {
    return (
      <div className={cn("h-full", className)}>
        <div className="flex h-full items-center justify-center px-6 text-center">
          <p className="max-w-sm text-sm text-muted-foreground">
            Nothing to preview yet. Start writing on the left and switch back to
            Map whenever you want structure view.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("h-full", className)}>
      <ScrollFadeEffect
        orientation="vertical"
        className="markdown-preview-surface scrollbar-subtle h-full px-4 py-4 sm:px-5"
      >
        <div className="w-full text-sm leading-6 text-foreground [&_a]:text-link [&_a]:break-all [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_code]:rounded-sm [&_code]:bg-muted [&_code]:px-1.5 [&_code]:py-0.5 [&_h1]:mt-6 [&_h1]:mb-3 [&_h1]:text-2xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mt-6 [&_h2]:mb-3 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mt-5 [&_h3]:mb-2 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:my-6 [&_hr]:border-border [&_li]:my-1 [&_ol]:my-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_p]:my-3 [&_pre_code]:rounded-none [&_pre_code]:bg-transparent [&_pre_code]:px-0 [&_pre_code]:py-0 [&_table]:my-4 [&_table]:w-full [&_table]:border-collapse [&_table]:overflow-hidden [&_table]:rounded-xl [&_td]:border [&_td]:border-border [&_td]:px-2.5 [&_td]:py-1.5 [&_th]:border [&_th]:border-border [&_th]:bg-muted/45 [&_th]:px-2.5 [&_th]:py-1.5 [&_th]:text-left [&_th]:font-medium [&_ul]:my-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul>li>input]:mr-2 [&_ul>li>input]:align-middle [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
          <ReactMarkdown
            remarkPlugins={remarkPlugins}
            rehypePlugins={rehypePlugins}
            components={components}
          >
            {previewMarkdown}
          </ReactMarkdown>
        </div>
      </ScrollFadeEffect>
    </div>
  )
}
