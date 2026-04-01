"use client"

import * as React from "react"
import { Transformer } from "markmap-lib"
import { Markmap, deriveOptions, loadCSS, loadJS } from "markmap-view"
import * as markmap from "markmap-view"

import { MarkmapControlsBar } from "@/components/editor/markmap-controls-bar"
import { MarkdownPreview } from "@/components/editor/markdown-preview"
import {
  applyMarkmapFoldState,
  captureMarkmapFoldState,
  type MarkmapFoldState,
  type PersistableMarkmapNode,
} from "@/lib/markmap-fold-state"
import {
  DEFAULT_MARKMAP_JSON_OPTIONS,
  type MarkmapJsonOptions,
} from "@/lib/markmap-options"
import { getMarkmapTransformSnapshot } from "@/lib/markmap-transform"

const transformer = new Transformer()
const LARGE_MARKDOWN_THRESHOLD = 12_000
const LARGE_MARKDOWN_UPDATE_DELAY_MS = 120

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
  activeView: "map" | "markdown"
  persistedFoldState: MarkmapFoldState
  onFoldStateChange: (nextState: MarkmapFoldState) => void
  onJsonOptionsChange: (nextOptions: MarkmapJsonOptions) => void
  onViewChange: (nextView: "map" | "markdown") => void
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
  activeView,
  persistedFoldState,
  onFoldStateChange,
  onJsonOptionsChange,
  onViewChange,
  fitSignal,
}: MarkmapCanvasProps) {
  const deferredMarkdown = React.useDeferredValue(markdown)
  const svgRef = React.useRef<SVGSVGElement>(null)
  const mmRef = React.useRef<Markmap | null>(null)
  const persistedFoldStateRef = React.useRef(persistedFoldState)
  const renderMarkdownRef = React.useRef(markdown)
  const [renderMarkdown, setRenderMarkdown] = React.useState(markdown)

  const [frontmatterOptions, setFrontmatterOptions] =
    React.useState<MarkmapJsonOptions>({})

  React.useEffect(() => {
    persistedFoldStateRef.current = persistedFoldState
  }, [persistedFoldState])

  React.useEffect(() => {
    renderMarkdownRef.current = renderMarkdown
  }, [renderMarkdown])

  const resolvedJsonOptions = React.useMemo(
    () => ({
      ...DEFAULT_MARKMAP_JSON_OPTIONS,
      ...jsonOptions,
      ...frontmatterOptions,
    }),
    [frontmatterOptions, jsonOptions]
  )

  React.useEffect(() => {
    if (deferredMarkdown.length < LARGE_MARKDOWN_THRESHOLD) {
      setRenderMarkdown(deferredMarkdown)
      return
    }

    const timer = window.setTimeout(() => {
      setRenderMarkdown(deferredMarkdown)
    }, LARGE_MARKDOWN_UPDATE_DELAY_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [deferredMarkdown])

  const getSnapshot = React.useEffectEvent((nextMarkdown: string) => {
    const snapshot = getMarkmapTransformSnapshot(transformer, nextMarkdown)

    applyMarkmapFoldState(
      snapshot.root as PersistableMarkmapNode,
      persistedFoldStateRef.current
    )

    return snapshot
  })

  const persistCurrentFoldState = React.useEffectEvent(() => {
    const root = mmRef.current?.state.data

    if (!root) {
      return
    }

    const nextFoldState = captureMarkmapFoldState(
      root as PersistableMarkmapNode
    )

    persistedFoldStateRef.current = nextFoldState
    onFoldStateChange(nextFoldState)
  })

  const syncMarkmapData = React.useEffectEvent(async (nextMarkdown: string) => {
    if (!mmRef.current) {
      return
    }

    if (svgRef.current) {
      ensureSvgSize(svgRef.current)
    }

    const snapshot = getSnapshot(nextMarkdown)
    const assets = transformer.getUsedAssets(snapshot.features)

    if (assets.styles) loadCSS(assets.styles)
    if (assets.scripts) {
      loadJS(assets.scripts, { getMarkmap: () => markmap })
    }

    setFrontmatterOptions(snapshot.frontmatterOptions)

    const mm = mmRef.current
    await mm.setData(snapshot.root)

    // Keep map view fitted after data/view switches; otherwise switching
    // Markdown -> Map can leave the viewport offset from content bounds.
    if (svgRef.current) {
      ensureSvgSize(svgRef.current)
    }

    await mm.fit()
  })

  const initMarkmap = React.useEffectEvent(() => {
    if (!svgRef.current) return

    ensureSvgSize(svgRef.current)

    const snapshot = getSnapshot(renderMarkdown)
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
    void syncMarkmapData(renderMarkdown)
  }, [activeView, renderMarkdown])

  React.useEffect(() => {
    if (activeView !== "map") return
    void syncMarkmapData(renderMarkdownRef.current)
  }, [activeView, persistedFoldState])

  React.useEffect(() => {
    if (activeView !== "map") return
    if (!mmRef.current) return

    mmRef.current.setOptions(getMarkmapOptions(jsonOptions, frontmatterOptions))
  }, [activeView, frontmatterOptions, jsonOptions])

  React.useEffect(() => {
    if (activeView !== "map") return
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
  }, [activeView, resolvedJsonOptions.pan, resolvedJsonOptions.zoom])

  const handleZoomStep = React.useCallback((multiplier: number) => {
    if (!mmRef.current) return

    const currentScale = getCurrentScale(svgRef.current)
    const targetScale = Math.max(0.2, Math.min(4, currentScale * multiplier))
    const relativeFactor = targetScale / currentScale

    void mmRef.current.rescale(relativeFactor)
  }, [])

  const handleResetView = React.useCallback(() => {
    if (!mmRef.current) return

    const currentScale = getCurrentScale(svgRef.current)
    const relativeFactor = 1 / currentScale

    void mmRef.current.rescale(relativeFactor)
  }, [])

  const handleFitView = React.useCallback(() => {
    if (!mmRef.current) return

    void mmRef.current.fit()
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

      const { root, features } = transformer.transform(renderMarkdown)
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

      const nextFoldState = captureMarkmapFoldState(
        root as PersistableMarkmapNode
      )

      persistedFoldStateRef.current = nextFoldState
      onFoldStateChange(nextFoldState)
      void mmRef.current.setData(root)
    },
    [onFoldStateChange, renderMarkdown]
  )

  const handleResize = React.useEffectEvent(() => {
    if (!svgRef.current || !mmRef.current) return

    ensureSvgSize(svgRef.current)
    void mmRef.current.fit()
  })

  const handleFitSignal = React.useEffectEvent(() => {
    if (!mmRef.current) return

    void mmRef.current.fit()
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

  React.useEffect(() => {
    if (activeView !== "map") return
    handleFitSignal()
  }, [activeView, fitSignal])

  React.useEffect(() => {
    if (!svgRef.current) {
      return
    }

    const svgElement = svgRef.current
    const handleClick = (event: MouseEvent) => {
      const target = event.target

      if (!(target instanceof Element)) {
        return
      }

      if (!target.closest(".markmap-node")) {
        return
      }

      queueMicrotask(() => {
        persistCurrentFoldState()
      })
    }

    svgElement.addEventListener("click", handleClick)

    return () => {
      svgElement.removeEventListener("click", handleClick)
    }
  }, [])

  return (
    <div className="flex min-h-0 flex-col overflow-hidden">
      <MarkmapControlsBar
        activeView={activeView}
        canDrag={Boolean(resolvedJsonOptions.pan)}
        canZoom={Boolean(resolvedJsonOptions.zoom)}
        onViewChange={onViewChange}
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
      <div
        className={
          activeView === "map" ? "min-h-0 flex-1 p-2 sm:p-4" : "min-h-0 flex-1"
        }
      >
        <div className="size-full">
          <div
            className={activeView === "map" ? "size-full" : "hidden size-full"}
          >
            <svg ref={svgRef} className="size-full" />
          </div>
          {activeView === "markdown" ? (
            <MarkdownPreview markdown={markdown} className="h-full" />
          ) : null}
        </div>
      </div>
    </div>
  )
}
