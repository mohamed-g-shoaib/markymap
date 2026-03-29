"use client"

import * as React from "react"

import {
  DEFAULT_MARKDOWN,
  type EditorState,
  type SaveState,
  type SnippetKind,
} from "@/components/editor/editor-templates"
import {
  createEditorExchangeV1,
  parseEditorExchange,
} from "@/lib/editor-exchange"
import {
  DEFAULT_MARKMAP_JSON_OPTIONS,
  type MarkmapJsonOptions,
} from "@/lib/markmap-options"
import { loadEditorState, saveEditorState } from "@/lib/storage"

export function useEditorShellState() {
  const [editorState, setEditorState] = React.useState<EditorState>({
    markdown: DEFAULT_MARKDOWN,
    jsonOptions: {
      ...DEFAULT_MARKMAP_JSON_OPTIONS,
    },
  })
  const hasLoadedPersistedStateRef = React.useRef(false)
  const [saveState, setSaveState] = React.useState<SaveState>("idle")
  const [importMessage, setImportMessage] = React.useState<string | null>(null)
  const [isTipsOpen, setIsTipsOpen] = React.useState(false)
  const [isSnippetsOpen, setIsSnippetsOpen] = React.useState(false)
  const [insertedSnippet, setInsertedSnippet] =
    React.useState<SnippetKind | null>(null)
  const [fitSignal, setFitSignal] = React.useState(0)
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null)
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const insertFeedbackTimerRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null)
  const importInputRef = React.useRef<HTMLInputElement | null>(null)

  const markdown = editorState.markdown
  const jsonOptions = editorState.jsonOptions

  const handleJsonOptionsChange = React.useCallback(
    (nextOptions: MarkmapJsonOptions) => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
        saveTimerRef.current = null
      }

      let markdownSnapshot = DEFAULT_MARKDOWN
      setEditorState((previous) => {
        markdownSnapshot = previous.markdown

        return {
          ...previous,
          jsonOptions: nextOptions,
        }
      })

      const didSave = saveEditorState({
        markdown: markdownSnapshot,
        jsonOptions: nextOptions,
      })
      if (!didSave) {
        setSaveState("error")
        return
      }

      setImportMessage(null)
      setSaveState("saved")
      setLastSavedAt(new Date())
    },
    []
  )

  const handleChange = React.useCallback(
    (nextValue: string) => {
      setEditorState((previous) => ({
        ...previous,
        markdown: nextValue,
      }))
      setSaveState("saving")

      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }

      saveTimerRef.current = setTimeout(() => {
        const didSave = saveEditorState({
          markdown: nextValue,
          jsonOptions,
        })
        if (!didSave) {
          setSaveState("error")
          return
        }

        setImportMessage(null)
        setSaveState("saved")
        setLastSavedAt(new Date())
      }, 500)
    },
    [jsonOptions]
  )

  const handleReset = React.useCallback(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current)
    }

    setEditorState((previous) => ({
      ...previous,
      markdown: DEFAULT_MARKDOWN,
    }))

    const didSave = saveEditorState({
      markdown: DEFAULT_MARKDOWN,
      jsonOptions,
    })
    if (!didSave) {
      setSaveState("error")
      return
    }

    setImportMessage(null)
    setSaveState("saved")
    setLastSavedAt(new Date())
    setFitSignal((value) => value + 1)
  }, [jsonOptions])

  const handleInsertTemplate = React.useCallback(
    (template: string, kind: SnippetKind) => {
      const normalized = markdown.trimEnd()
      const nextMarkdown = normalized
        ? `${normalized}\n\n${template}`
        : template

      handleChange(nextMarkdown)

      if (insertFeedbackTimerRef.current) {
        clearTimeout(insertFeedbackTimerRef.current)
      }

      setInsertedSnippet(kind)
      insertFeedbackTimerRef.current = setTimeout(() => {
        setInsertedSnippet(null)
      }, 1400)
    },
    [handleChange, markdown]
  )

  const handleExportBundle = React.useCallback(() => {
    const payload = createEditorExchangeV1({ markdown, jsonOptions })
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")

    anchor.href = url
    anchor.download = "markymap.json"
    anchor.click()

    URL.revokeObjectURL(url)
  }, [jsonOptions, markdown])

  const handleExportMarkdown = React.useCallback(() => {
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

        const trimmed = text.trim()
        if (!trimmed) {
          setImportMessage("Import failed: file is empty.")
          setSaveState("error")
          return
        }

        const exchange = parseEditorExchange(text)
        const isJsonInput = file.name.toLowerCase().endsWith(".json")
        if (isJsonInput && !exchange.ok) {
          if (exchange.reason === "unsupported-version") {
            setImportMessage(
              `Import failed: unsupported bundle version ${exchange.version}.`
            )
          } else {
            setImportMessage(
              "Import failed: invalid Markymap JSON bundle format."
            )
          }

          setSaveState("error")
          return
        }

        const nextState: EditorState = exchange.ok
          ? {
              markdown: exchange.value.markdown,
              jsonOptions: {
                ...DEFAULT_MARKMAP_JSON_OPTIONS,
                ...exchange.value.jsonOptions,
              },
            }
          : {
              markdown: text,
              jsonOptions,
            }

        if (saveTimerRef.current) {
          clearTimeout(saveTimerRef.current)
          saveTimerRef.current = null
        }

        setEditorState(nextState)

        const didSave = saveEditorState(nextState)
        if (!didSave) {
          setSaveState("error")
          return
        }

        setImportMessage(null)
        setSaveState("saved")
        setLastSavedAt(new Date())
      } catch {
        setImportMessage("Import failed: could not read file.")
        setSaveState("error")
      }
    },
    [jsonOptions]
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

  const statusLabel = importMessage ?? saveStatusLabel

  React.useEffect(() => {
    if (hasLoadedPersistedStateRef.current) {
      return
    }

    hasLoadedPersistedStateRef.current = true
    const savedState = loadEditorState()

    if (!savedState) {
      return
    }

    setEditorState({
      markdown: savedState.markdown,
      jsonOptions: {
        ...DEFAULT_MARKMAP_JSON_OPTIONS,
        ...savedState.jsonOptions,
      },
    })
  }, [])

  React.useEffect(() => {
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current)
      }

      if (insertFeedbackTimerRef.current) {
        clearTimeout(insertFeedbackTimerRef.current)
      }
    }
  }, [])

  return {
    fitSignal,
    importInputRef,
    importedStatusIsError: Boolean(importMessage),
    insertedSnippet,
    isSnippetsOpen,
    isTipsOpen,
    jsonOptions,
    markdown,
    statusLabel,
    handleChange,
    handleExportBundle,
    handleExportMarkdown,
    handleImport,
    handleImportClick,
    handleInsertTemplate,
    handleJsonOptionsChange,
    handleReset,
    setIsSnippetsOpen,
    setIsTipsOpen,
  }
}
