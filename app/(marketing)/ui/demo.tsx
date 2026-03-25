"use client"

import * as React from "react"
import { Markmap, deriveOptions, loadCSS, loadJS } from "markmap-view"
import * as markmap from "markmap-view"
import { Transformer } from "markmap-lib"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DEMO_SEED, DEMO_STORAGE_KEY } from "@/app/(marketing)/ui/demo-seed"

const transformer = new Transformer()

const defaultOptions = {
  duration: 300,
  initialExpandLevel: -1,
  spacingHorizontal: 80,
  spacingVertical: 5,
  zoom: true,
  pan: true,
} as const

function ensureSvgSize(svg: SVGSVGElement) {
  const container = svg.parentElement
  if (!container) return

  const width = Math.max(1, Math.floor(container.clientWidth))
  const height = Math.max(1, Math.floor(container.clientHeight))

  svg.setAttribute("width", String(width))
  svg.setAttribute("height", String(height))
}

function loadInitialMarkdown() {
  try {
    return localStorage.getItem(DEMO_STORAGE_KEY) ?? DEMO_SEED
  } catch {
    return DEMO_SEED
  }
}

export function LiveDemoSection() {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const mmRef = React.useRef<Markmap | null>(null)
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const [markdown, setMarkdown] = React.useState(DEMO_SEED)

  React.useEffect(() => {
    setMarkdown(loadInitialMarkdown())
  }, [])

  const initMarkmap = React.useEffectEvent(() => {
    if (!svgRef.current) return

    ensureSvgSize(svgRef.current)

    const { root, features } = transformer.transform(markdown)
    const { styles, scripts } = transformer.getUsedAssets(features)

    if (styles) loadCSS(styles)
    if (scripts) loadJS(scripts, { getMarkmap: () => markmap })

    mmRef.current = Markmap.create(
      svgRef.current,
      deriveOptions(defaultOptions),
      root
    )
  })

  React.useEffect(() => {
    initMarkmap()

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }

      mmRef.current?.destroy()
      mmRef.current = null
    }
  }, [])

  React.useEffect(() => {
    if (!mmRef.current) return

    if (svgRef.current) {
      ensureSvgSize(svgRef.current)
    }

    const { root, features } = transformer.transform(markdown)
    const { styles, scripts } = transformer.getUsedAssets(features)

    if (styles) loadCSS(styles)
    if (scripts) loadJS(scripts, { getMarkmap: () => markmap })

    mmRef.current.setData(root)
  }, [markdown])

  const handleResize = React.useEffectEvent(() => {
    if (!svgRef.current || !mmRef.current) return

    ensureSvgSize(svgRef.current)
    mmRef.current.fit()
  })

  React.useEffect(() => {
    if (!svgRef.current || typeof ResizeObserver === "undefined") {
      return
    }

    const target = svgRef.current.parentElement ?? svgRef.current
    const observer = new ResizeObserver(() => {
      handleResize()
    })

    observer.observe(target)
    handleResize()

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleMarkdownChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const nextValue = event.target.value
    setMarkdown(nextValue)

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(() => {
      try {
        localStorage.setItem(DEMO_STORAGE_KEY, nextValue)
      } catch {
        // Ignore storage failures.
      }
    }, 300)
  }

  return (
    <section id="demo" className="flex min-h-0 flex-1 flex-col">
      <p className="mb-2 text-center text-sm text-muted-foreground">
        No account needed. Edit the markdown and watch it map.
      </p>

      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="hidden items-center justify-between border-b bg-muted/40 px-4 py-2.5 sm:flex">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-destructive/60" />
            <span className="size-3 rounded-full bg-warning/60" />
            <span className="size-3 rounded-full bg-success/60" />
          </div>
          <p className="text-xs text-muted-foreground">
            markymap.app/playground
          </p>
          <span className="w-16" />
        </div>

        <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[1fr_auto_1fr]">
          <div className="flex min-h-0 flex-col overflow-hidden">
            <div className="flex h-10 items-center justify-between border-b bg-background px-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Markdown
              </p>
              <p className="text-xs text-muted-foreground tabular-nums">
                {markdown.length} chars
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <textarea
                value={markdown}
                onChange={handleMarkdownChange}
                className="size-full min-h-0 resize-none overflow-x-hidden overflow-y-auto border-0 bg-transparent p-4 font-mono text-sm text-foreground outline-none"
              />
            </div>
          </div>

          <Separator orientation="vertical" className="hidden sm:block" />
          <Separator className="sm:hidden" />

          <div className="flex min-h-0 flex-col overflow-hidden">
            <div className="flex h-10 items-center justify-between border-b bg-background px-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Map
              </p>
              <Button
                variant="ghost"
                size="xs"
                onClick={() => mmRef.current?.fit()}
              >
                Fit
              </Button>
            </div>
            <div className="min-h-0 flex-1 p-2 sm:p-4">
              <svg ref={svgRef} className="size-full" />
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
