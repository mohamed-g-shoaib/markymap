"use client"

import * as React from "react"
import { Transformer } from "markmap-lib"
import { Markmap, deriveOptions, loadCSS, loadJS } from "markmap-view"
import * as markmap from "markmap-view"

import { Button } from "@/components/ui/button"

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

type MarkmapCanvasProps = {
  markdown: string
}

export function MarkmapCanvas({ markdown }: MarkmapCanvasProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const mmRef = React.useRef<Markmap | null>(null)

  const initMarkmap = React.useEffectEvent(() => {
    if (!svgRef.current) return

    ensureSvgSize(svgRef.current)

    const { root, features } = transformer.transform(markdown)
    const assets = transformer.getUsedAssets(features)

    if (assets.styles) loadCSS(assets.styles)
    if (assets.scripts) {
      loadJS(assets.scripts, { getMarkmap: () => markmap })
    }

    mmRef.current = Markmap.create(
      svgRef.current,
      deriveOptions(defaultOptions),
      root
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

    const { root, features } = transformer.transform(markdown)
    const assets = transformer.getUsedAssets(features)

    if (assets.styles) loadCSS(assets.styles)
    if (assets.scripts) {
      loadJS(assets.scripts, { getMarkmap: () => markmap })
    }

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

  return (
    <div className="flex min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 items-center justify-between border-b bg-background px-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Map
        </p>
        <Button size="xs" variant="ghost" onClick={() => mmRef.current?.fit()}>
          Fit
        </Button>
      </div>
      <div className="min-h-0 flex-1 p-2 sm:p-4">
        <svg ref={svgRef} className="size-full" />
      </div>
    </div>
  )
}
