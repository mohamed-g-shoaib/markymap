"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { MapMarkdownSwitch } from "@/components/editor/map-markdown-switch"

type MarkmapControlsBarProps = {
  activeView: "map" | "markdown"
  canDrag: boolean
  canZoom: boolean
  zoomPercent: number
  onViewChange: (nextView: "map" | "markdown") => void
  onCollapseAll: () => void
  onExpandAll: () => void
  onFitView: () => void
  onResetView: () => void
  onRestoreDefaults: () => void
  onToggleDrag: () => void
  onToggleZoom: () => void
  onZoomIn: () => void
  onZoomOut: () => void
}

export function MarkmapControlsBar({
  activeView,
  canDrag,
  canZoom,
  zoomPercent,
  onViewChange,
  onCollapseAll,
  onExpandAll,
  onFitView,
  onResetView,
  onRestoreDefaults,
  onToggleDrag,
  onToggleZoom,
  onZoomIn,
  onZoomOut,
}: MarkmapControlsBarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b bg-background px-2 py-1 sm:h-10 sm:flex-nowrap sm:px-3 sm:py-0">
      <MapMarkdownSwitch activeView={activeView} onViewChange={onViewChange} />
      <div className="hidden scrollbar-subtle items-center gap-1 sm:flex sm:overflow-x-auto">
        {activeView === "map" ? (
          <>
            <Button size="xs" variant="ghost" onClick={onZoomOut}>
              -
            </Button>
            <Button size="xs" variant="ghost" onClick={onZoomIn}>
              +
            </Button>
            <Button size="xs" variant="ghost" onClick={onResetView}>
              {zoomPercent}%
            </Button>
            <Button size="xs" variant="ghost" onClick={onFitView}>
              Fit
            </Button>
            <Button size="xs" variant="ghost" onClick={onCollapseAll}>
              Collapse All
            </Button>
            <Button size="xs" variant="ghost" onClick={onExpandAll}>
              Expand All
            </Button>
            <Button size="xs" variant="ghost" onClick={onRestoreDefaults}>
              Defaults
            </Button>
            <Separator orientation="vertical" className="mx-1 h-4" />
            <Button
              size="xs"
              variant={canZoom ? "outline" : "ghost"}
              aria-pressed={canZoom}
              onClick={onToggleZoom}
            >
              {canZoom ? "Zoom On" : "Zoom Off"}
            </Button>
            <Button
              size="xs"
              variant={canDrag ? "outline" : "ghost"}
              aria-pressed={canDrag}
              onClick={onToggleDrag}
            >
              {canDrag ? "Drag On" : "Drag Off"}
            </Button>
          </>
        ) : null}
      </div>
      <div className="flex w-full flex-wrap items-center gap-1 sm:hidden">
        {activeView === "map" ? (
          <>
            <Button size="xs" variant="ghost" onClick={onZoomOut}>
              -
            </Button>
            <Button size="xs" variant="ghost" onClick={onZoomIn}>
              +
            </Button>
            <Button size="xs" variant="ghost" onClick={onResetView}>
              {zoomPercent}%
            </Button>
            <Button size="xs" variant="ghost" onClick={onFitView}>
              Fit
            </Button>
          </>
        ) : null}
      </div>
    </div>
  )
}
