"use client"

import * as React from "react"
import { Markmap, deriveOptions, loadCSS, loadJS } from "markmap-view"
import * as markmap from "markmap-view"
import { Transformer } from "markmap-lib"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DEMO_SEED } from "@/app/(marketing)/ui/demo-seed"
import { MarkdownPreview } from "@/components/editor/markdown-preview"
import { MapMarkdownSwitch } from "@/components/editor/map-markdown-switch"
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
  const [activeView, setActiveView] = React.useState<"map" | "markdown">("map")
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
    if (activeView !== "map") return
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
  }, [activeView, markdown])

  React.useEffect(() => {
    if (activeView !== "map") return
    if (!mmRef.current) return

    mmRef.current.setOptions(getDemoOptions(frontmatterOptions))
  }, [activeView, frontmatterOptions])

  const handleResize = React.useEffectEvent(() => {
    if (!svgRef.current || !mmRef.current) return

    ensureSvgSize(svgRef.current)
    mmRef.current.fit()
  })

  React.useEffect(() => {
    if (activeView !== "map") return
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
  }, [activeView])

  const handleMarkdownChange = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setMarkdown(event.target.value)
  }

  return (
    <section id="demo" className="flex min-h-0 flex-1 flex-col">
      <Card className="flex flex-col overflow-hidden sm:min-h-0 sm:flex-1">
        <div className="grid grid-cols-1 grid-rows-[32rem_auto_32rem] sm:min-h-0 sm:flex-1 sm:grid-cols-[1fr_auto_1fr] sm:grid-rows-1">
          <div className="flex min-h-0 flex-col overflow-hidden">
            <div className="flex h-10 items-center justify-between gap-2 border-b bg-background px-3 sm:px-4">
              <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Markdown
              </p>
              <p className="min-w-0 truncate text-[11px] text-muted-foreground tabular-nums sm:text-xs">
                {markdown.length} chars
              </p>
            </div>
            <div className="min-h-0 flex-1 overflow-hidden">
              <textarea
                value={markdown}
                onChange={handleMarkdownChange}
                className="scrollbar-subtle size-full min-h-0 resize-none overflow-x-hidden overflow-y-auto border-0 bg-transparent p-4 font-mono text-sm text-foreground outline-none"
              />
            </div>
          </div>

          <Separator orientation="vertical" className="hidden sm:block" />
          <Separator className="sm:hidden" />

          <div className="flex min-h-0 flex-col overflow-hidden">
            <div className="flex min-h-10 flex-wrap items-center justify-between gap-2 border-b bg-background px-3 py-1 sm:h-10 sm:flex-nowrap sm:px-4 sm:py-0">
              <MapMarkdownSwitch
                activeView={activeView}
                onViewChange={setActiveView}
              />
              {activeView === "map" ? (
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => mmRef.current?.fit()}
                >
                  Fit
                </Button>
              ) : null}
            </div>
            <div
              className={
                activeView === "map"
                  ? "min-h-0 flex-1 p-2 sm:p-4"
                  : "min-h-0 flex-1"
              }
            >
              <div className="size-full">
                <div
                  className={
                    activeView === "map" ? "size-full" : "hidden size-full"
                  }
                >
                  <svg ref={svgRef} className="size-full" />
                </div>
                {activeView === "markdown" ? (
                  <MarkdownPreview markdown={markdown} />
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}
