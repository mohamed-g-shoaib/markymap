"use client"

import * as React from "react"
import { Transformer } from "markmap-lib"
import { Markmap, deriveOptions, loadCSS, loadJS } from "markmap-view"
import * as markmap from "markmap-view"

import { MarkmapControlsBar } from "@/components/editor/markmap-controls-bar"
import {
  DEFAULT_MARKMAP_JSON_OPTIONS,
  type MarkmapJsonOptions,
} from "@/lib/markmap-options"
import { getMarkmapTransformSnapshot } from "@/lib/markmap-transform"

const transformer = new Transformer()

type FoldableMarkmapNode = {
  children?: FoldableMarkmapNode[]
  payload?: {
    fold?: number
  }
}

function getMarkmapOptions(
  jsonOptions: MarkmapJsonOptions,
  frontmatterOptions: MarkmapJsonOptions
) {
  return deriveOptions({
    ...DEFAULT_MARKMAP_JSON_OPTIONS,
    ...jsonOptions,
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

type MarkmapCanvasProps = {
  markdown: string
  jsonOptions: MarkmapJsonOptions
  onJsonOptionsChange: (nextOptions: MarkmapJsonOptions) => void
  fitSignal?: number
}

function getCurrentScale(svgElement: SVGSVGElement | null) {
  if (!svgElement) return 1

  const zoomState = (svgElement as SVGSVGElement & { __zoom?: { k?: number } })
    .__zoom

  return typeof zoomState?.k === "number" ? zoomState.k : 1
}

export function MarkmapCanvas({
  markdown,
  jsonOptions,
  onJsonOptionsChange,
  fitSignal,
}: MarkmapCanvasProps) {
  const svgRef = React.useRef<SVGSVGElement>(null)
  const mmRef = React.useRef<Markmap | null>(null)
  const [zoomPercent, setZoomPercent] = React.useState(100)
  const [frontmatterOptions, setFrontmatterOptions] =
    React.useState<MarkmapJsonOptions>({})
  const resolvedJsonOptions = React.useMemo(
    () => ({
      ...DEFAULT_MARKMAP_JSON_OPTIONS,
      ...jsonOptions,
      ...frontmatterOptions,
    }),
    [frontmatterOptions, jsonOptions]
  )

  const syncZoomPercent = React.useEffectEvent(() => {
    const currentScale = getCurrentScale(svgRef.current)
    setZoomPercent(Math.max(20, Math.min(400, Math.round(currentScale * 100))))
  })

  const initMarkmap = React.useEffectEvent(() => {
    if (!svgRef.current) return

    ensureSvgSize(svgRef.current)

    const snapshot = getMarkmapTransformSnapshot(transformer, markdown)
    const assets = transformer.getUsedAssets(snapshot.features)

    if (assets.styles) loadCSS(assets.styles)
    if (assets.scripts) {
      loadJS(assets.scripts, { getMarkmap: () => markmap })
    }

    setFrontmatterOptions(snapshot.frontmatterOptions)

    mmRef.current = Markmap.create(
      svgRef.current,
      getMarkmapOptions(jsonOptions, snapshot.frontmatterOptions),
      snapshot.root
    )

    syncZoomPercent()
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
    const assets = transformer.getUsedAssets(snapshot.features)

    if (assets.styles) loadCSS(assets.styles)
    if (assets.scripts) {
      loadJS(assets.scripts, { getMarkmap: () => markmap })
    }

    setFrontmatterOptions(snapshot.frontmatterOptions)
    mmRef.current.setData(snapshot.root)
  }, [markdown])

  React.useEffect(() => {
    if (!mmRef.current) return

    mmRef.current.setOptions(getMarkmapOptions(jsonOptions, frontmatterOptions))
  }, [frontmatterOptions, jsonOptions])

  React.useEffect(() => {
    if (!mmRef.current) return

    const mm = mmRef.current
    const allowZoom = resolvedJsonOptions.zoom
    const allowDrag = resolvedJsonOptions.pan

    mm.zoom.filter((event: Event) => {
      const interactionEvent = event as Event & {
        button?: number
        ctrlKey?: boolean
        type: string
      }

      if (!allowZoom) {
        return false
      }

      if (!allowDrag && interactionEvent.type !== "wheel") {
        return false
      }

      if (mm.options.scrollForPan && interactionEvent.type === "wheel") {
        return Boolean(interactionEvent.ctrlKey) && !interactionEvent.button
      }

      return (
        (!interactionEvent.ctrlKey || interactionEvent.type === "wheel") &&
        !interactionEvent.button
      )
    })

    if (allowZoom) {
      mm.svg.call(mm.zoom)
      return
    }

    mm.svg.on(".zoom", null)
  }, [resolvedJsonOptions.pan, resolvedJsonOptions.zoom])

  const handleZoomStep = React.useCallback((multiplier: number) => {
    if (!mmRef.current) return

    const currentScale = getCurrentScale(svgRef.current)
    const targetScale = Math.max(0.2, Math.min(4, currentScale * multiplier))
    const relativeFactor = targetScale / currentScale

    void mmRef.current.rescale(relativeFactor).finally(() => {
      syncZoomPercent()
    })
  }, [])

  const handleResetView = React.useCallback(() => {
    if (!mmRef.current) return

    const currentScale = getCurrentScale(svgRef.current)
    const relativeFactor = 1 / currentScale

    void mmRef.current.rescale(relativeFactor).finally(() => {
      syncZoomPercent()
    })
  }, [])

  const handleFitView = React.useCallback(() => {
    if (!mmRef.current) return

    void mmRef.current.fit().finally(() => {
      syncZoomPercent()
    })
  }, [])

  const handleToggleZoom = React.useCallback(() => {
    onJsonOptionsChange({
      ...jsonOptions,
      zoom: !resolvedJsonOptions.zoom,
    })
  }, [jsonOptions, onJsonOptionsChange, resolvedJsonOptions.zoom])

  const handleTogglePan = React.useCallback(() => {
    onJsonOptionsChange({
      ...jsonOptions,
      pan: !resolvedJsonOptions.pan,
    })
  }, [jsonOptions, onJsonOptionsChange, resolvedJsonOptions.pan])

  const handleRestoreDefaults = React.useCallback(() => {
    onJsonOptionsChange({
      ...DEFAULT_MARKMAP_JSON_OPTIONS,
    })
  }, [onJsonOptionsChange])

  const handleFoldAll = React.useCallback(
    (collapsed: boolean) => {
      if (!mmRef.current) return

      const { root, features } = transformer.transform(markdown)
      const assets = transformer.getUsedAssets(features)

      if (assets.styles) loadCSS(assets.styles)
      if (assets.scripts) {
        loadJS(assets.scripts, { getMarkmap: () => markmap })
      }

      const setFoldState = (node: FoldableMarkmapNode, isRoot = false) => {
        const hasChildren = Boolean(node.children?.length)

        if (!isRoot && hasChildren) {
          node.payload = {
            ...node.payload,
            fold: collapsed ? 1 : 0,
          }
        }

        node.children?.forEach((child) => {
          setFoldState(child)
        })
      }

      setFoldState(root as FoldableMarkmapNode, true)

      void mmRef.current.setData(root).finally(() => {
        syncZoomPercent()
      })
    },
    [markdown]
  )

  const handleResize = React.useEffectEvent(() => {
    if (!svgRef.current || !mmRef.current) return

    ensureSvgSize(svgRef.current)
    void mmRef.current.fit().finally(() => {
      syncZoomPercent()
    })
  })

  const handleFitSignal = React.useEffectEvent(() => {
    if (!mmRef.current) return

    void mmRef.current.fit().finally(() => {
      syncZoomPercent()
    })
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

  React.useEffect(() => {
    handleFitSignal()
  }, [fitSignal])

  return (
    <div className="flex min-h-0 flex-col overflow-hidden">
      <MarkmapControlsBar
        canDrag={Boolean(resolvedJsonOptions.pan)}
        canZoom={Boolean(resolvedJsonOptions.zoom)}
        zoomPercent={zoomPercent}
        onCollapseAll={() => {
          handleFoldAll(true)
        }}
        onExpandAll={() => {
          handleFoldAll(false)
        }}
        onFitView={handleFitView}
        onResetView={handleResetView}
        onRestoreDefaults={handleRestoreDefaults}
        onToggleDrag={handleTogglePan}
        onToggleZoom={handleToggleZoom}
        onZoomIn={() => {
          handleZoomStep(1.25)
        }}
        onZoomOut={() => {
          handleZoomStep(0.8)
        }}
      />
      <div className="min-h-0 flex-1 p-2 sm:p-4">
        <svg ref={svgRef} className="size-full" />
      </div>
    </div>
  )
}
