"use client"

import * as React from "react"
import { Markmap, deriveOptions, loadCSS, loadJS } from "markmap-view"
import * as markmap from "markmap-view"
import { Transformer } from "markmap-lib"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DEMO_SEED } from "@/app/(marketing)/ui/demo-seed"
import {
  DEFAULT_MARKMAP_JSON_OPTIONS,
  type MarkmapJsonOptions,
} from "@/lib/markmap-options"
import { getMarkmapTransformSnapshot } from "@/lib/markmap-transform"

const transformer = new Transformer()

function getDemoOptions(frontmatterOptions: MarkmapJsonOptions) {
  return deriveOptions({
    ...DEFAULT_MARKMAP_JSON_OPTIONS,
    ...frontmatterOptions,
  })
}

function ensureSvgSize(svg: SVGSVGElement) {
  const container = svg.parentElement
  if (!container) return

  const width = Math.max(1, Math.floor(container.clientWidth))
  const height = Math.max(1, Math.floor(container.clientHeight))

  svg.setAttribute("width", String(width))
  svg.setAttribute("height", String(height))
}

export function LiveDemoSection() {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const mmRef = React.useRef<Markmap | null>(null)

  const [markdown, setMarkdown] = React.useState(DEMO_SEED)
  const [frontmatterOptions, setFrontmatterOptions] =
    React.useState<MarkmapJsonOptions>({})

  const initMarkmap = React.useEffectEvent(() => {
    if (!svgRef.current) return

    ensureSvgSize(svgRef.current)

    const snapshot = getMarkmapTransformSnapshot(transformer, markdown)
    const { styles, scripts } = transformer.getUsedAssets(snapshot.features)

    if (styles) loadCSS(styles)
    if (scripts) loadJS(scripts, { getMarkmap: () => markmap })

    setFrontmatterOptions(snapshot.frontmatterOptions)

    mmRef.current = Markmap.create(
      svgRef.current,
      getDemoOptions(snapshot.frontmatterOptions),
      snapshot.root
    )
  })

  React.useEffect(() => {
    initMarkmap()

    return () => {
      mmRef.current?.destroy()
      mmRef.current = null
    }
  }, [])

  React.useEffect(() => {
    if (!mmRef.current) return

    if (svgRef.current) {
      ensureSvgSize(svgRef.current)
    }

    const snapshot = getMarkmapTransformSnapshot(transformer, markdown)
    const { styles, scripts } = transformer.getUsedAssets(snapshot.features)

    if (styles) loadCSS(styles)
    if (scripts) loadJS(scripts, { getMarkmap: () => markmap })

    setFrontmatterOptions(snapshot.frontmatterOptions)
    mmRef.current.setData(snapshot.root)
  }, [markdown])

  React.useEffect(() => {
    if (!mmRef.current) return

    mmRef.current.setOptions(getDemoOptions(frontmatterOptions))
  }, [frontmatterOptions])

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
    setMarkdown(event.target.value)
  }

  return (
    <section id="demo" className="flex min-h-0 flex-1 flex-col">
      <Card className="flex min-h-0 flex-1 flex-col overflow-hidden">
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
