"use client"

import { Button } from "@/components/ui/button"

type MapMarkdownSwitchProps = {
  activeView: "map" | "markdown"
  onViewChange: (nextView: "map" | "markdown") => void
}

export function MapMarkdownSwitch({
  activeView,
  onViewChange,
}: MapMarkdownSwitchProps) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-border/80 bg-muted/35 p-0.5">
      <Button
        size="xs"
        variant={activeView === "map" ? "outline" : "ghost"}
        className="motion-surface-interaction"
        aria-pressed={activeView === "map"}
        onClick={() => {
          onViewChange("map")
        }}
      >
        Map
      </Button>
      <Button
        size="xs"
        variant={activeView === "markdown" ? "outline" : "ghost"}
        className="motion-surface-interaction"
        aria-pressed={activeView === "markdown"}
        onClick={() => {
          onViewChange("markdown")
        }}
      >
        Markdown
      </Button>
    </div>
  )
}
