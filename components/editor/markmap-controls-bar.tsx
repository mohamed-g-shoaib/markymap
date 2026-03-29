"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type MarkmapControlsBarProps = {
  canDrag: boolean
  canZoom: boolean
  zoomPercent: number
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
  canDrag,
  canZoom,
  zoomPercent,
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
    <div className="flex h-10 items-center justify-between gap-2 border-b bg-background px-2 sm:px-3">
      <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        Map
      </p>
      <div className="flex items-center gap-1 overflow-x-auto">
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
      </div>
    </div>
  )
}
