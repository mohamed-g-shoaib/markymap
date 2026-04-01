"use client"

import * as React from "react"
import { Markmap, deriveOptions, loadCSS, loadJS } from "markmap-view"
import * as markmap from "markmap-view"
import { Transformer } from "markmap-lib"

import { Card } from "@/components/ui/card"
import { DEMO_SEED } from "@/app/(marketing)/ui/demo-seed"
import { MarkdownPreview } from "@/components/editor/markdown-preview"
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
    zoom: false,
    pan: false,
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

function disableMapInteractions(mm: Markmap) {
  mm.zoom.filter(() => false)
  mm.svg.on(".zoom", null)
}

export function LiveDemoSection() {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const mmRef = React.useRef<Markmap | null>(null)

  const initMarkmap = React.useEffectEvent(() => {
    if (!svgRef.current) return

    ensureSvgSize(svgRef.current)

    const snapshot = getMarkmapTransformSnapshot(transformer, DEMO_SEED)
    const { styles, scripts } = transformer.getUsedAssets(snapshot.features)

    if (styles) loadCSS(styles)
    if (scripts) loadJS(scripts, { getMarkmap: () => markmap })

    const mm = Markmap.create(
      svgRef.current,
      getDemoOptions(snapshot.frontmatterOptions),
      snapshot.root
    )

    disableMapInteractions(mm)
    mmRef.current = mm
  })

  React.useEffect(() => {
    initMarkmap()

    return () => {
      mmRef.current?.destroy()
      mmRef.current = null
    }
  }, [])

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

  return (
    <section id="demo" className="flex min-h-0 flex-1 flex-col">
      <div className="grid gap-3 lg:min-h-0 lg:flex-1 lg:grid-cols-2">
        <Card className="min-h-104 overflow-hidden lg:h-full lg:min-h-0">
          <div className="size-full p-1">
            <div className="size-full overflow-hidden rounded-xl border border-border/70 bg-background">
              <svg ref={svgRef} className="size-full" />
            </div>
          </div>
        </Card>
        <Card className="min-h-104 overflow-hidden lg:h-full lg:min-h-0">
          <div className="size-full p-1">
            <MarkdownPreview
              markdown={DEMO_SEED}
              className="h-full rounded-xl border border-border/70 bg-background"
            />
          </div>
        </Card>
      </div>
    </section>
  )
}
