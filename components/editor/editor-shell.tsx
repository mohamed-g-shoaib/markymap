"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { MarkmapCanvas } from "@/components/editor/markmap-canvas"
import { MarkdownInput } from "@/components/editor/markdown-input"
import { loadContent, saveContent } from "@/lib/storage"

const DEFAULT_MARKDOWN = `# Markymap Playground

## First branch

- Edit this markdown
- Watch the map update
- Export/import coming next`

type SaveState = "idle" | "saving" | "saved" | "error"

export function EditorShell() {
  const [markdown, setMarkdown] = React.useState(
    () => loadContent() ?? DEFAULT_MARKDOWN
  )
  const [saveState, setSaveState] = React.useState<SaveState>("idle")
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null)
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const importInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleChange = React.useCallback((nextValue: string) => {
    setMarkdown(nextValue)
    setSaveState("saving")

    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    saveTimerRef.current = setTimeout(() => {
      const didSave = saveContent(nextValue)
      if (!didSave) {
        setSaveState("error")
        return
      }

      setSaveState("saved")
      setLastSavedAt(new Date())
    }, 500)
  }, [])

  const handleReset = React.useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    setMarkdown(DEFAULT_MARKDOWN)

    const didSave = saveContent(DEFAULT_MARKDOWN)
    if (!didSave) {
      setSaveState("error")
      return
    }

    setSaveState("saved")
    setLastSavedAt(new Date())
  }, [])

  const handleExport = React.useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")

    anchor.href = url
    anchor.download = "markymap.md"
    anchor.click()

    URL.revokeObjectURL(url)
  }, [markdown])

  const handleImportClick = React.useCallback(() => {
    importInputRef.current?.click()
  }, [])

  const handleImport = React.useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const [file] = event.target.files ?? []
      event.target.value = ""

      if (!file) {
        return
      }

      try {
        const text = await file.text()

        if (!text.trim()) {
          return
        }

        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current)
        }

        setMarkdown(text)

        const didSave = saveContent(text)
        if (!didSave) {
          setSaveState("error")
          return
        }

        setSaveState("saved")
        setLastSavedAt(new Date())
      } catch {
        setSaveState("error")
      }
    },
    []
  )

  const saveStatusLabel = React.useMemo(() => {
    if (saveState === "saving") {
      return "Saving..."
    }

    if (saveState === "error") {
      return "Local save failed"
    }

    if (saveState === "saved") {
      if (!lastSavedAt) {
        return "Saved locally"
      }

      const hours = String(lastSavedAt.getHours()).padStart(2, "0")
      const minutes = String(lastSavedAt.getMinutes()).padStart(2, "0")

      return `Saved ${hours}:${minutes}`
    }

    return "Auto-save enabled"
  }, [lastSavedAt, saveState])

  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }
    }
  }, [])

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3 motion-fade">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="xs" onClick={handleImportClick}>
            Import .md
          </Button>
          <Button variant="outline" size="xs" onClick={handleExport}>
            Export .md
          </Button>
          <Button variant="ghost" size="xs" onClick={handleReset}>
            Reset
          </Button>
        </div>
        <p className="text-xs text-muted-foreground tabular-nums">
          {saveStatusLabel}
        </p>
      </div>
      <input
        ref={importInputRef}
        type="file"
        accept=".md,text/markdown,text/plain"
        className="sr-only"
        onChange={(event) => {
          void handleImport(event)
        }}
      />
      <Card className="overflow-hidden motion-fade">
        <div className="grid min-h-155 grid-cols-1 sm:grid-cols-[1fr_auto_1fr]">
          <MarkdownInput markdown={markdown} onChange={handleChange} />
          <Separator orientation="vertical" className="hidden sm:block" />
          <Separator className="sm:hidden" />
          <MarkmapCanvas markdown={markdown} />
        </div>
      </Card>
    </div>
  )
}
