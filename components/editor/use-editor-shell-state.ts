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
import type { MarkmapFoldState } from "@/lib/markmap-fold-state"
import {
  getViewPreference,
  loadEditorState,
  saveEditorState,
  saveViewPreference,
} from "@/lib/storage"

type PendingExport = "map-html" | "markdown-pdf" | null

export function useEditorShellState() {
  const [editorState, setEditorState] = React.useState<EditorState>({
    markdown: DEFAULT_MARKDOWN,
    jsonOptions: {
      ...DEFAULT_MARKMAP_JSON_OPTIONS,
    },
  })
  const [activeView, setActiveView] = React.useState<"map" | "markdown">("map")
  const hasLoadedPersistedStateRef = React.useRef(false)
  const [saveState, setSaveState] = React.useState<SaveState>("idle")
  const [importMessage, setImportMessage] = React.useState<string | null>(null)
  const [exportMessage, setExportMessage] = React.useState<string | null>(null)
  const [exportMessageIsError, setExportMessageIsError] = React.useState(false)
  const [pendingExport, setPendingExport] = React.useState<PendingExport>(null)
  const [isTipsOpen, setIsTipsOpen] = React.useState(false)
  const [isSnippetsOpen, setIsSnippetsOpen] = React.useState(false)
  const [insertedSnippet, setInsertedSnippet] =
    React.useState<SnippetKind | null>(null)
  const [fitSignal, setFitSignal] = React.useState(0)
  const [lastSavedAt, setLastSavedAt] = React.useState<Date | null>(null)
  const foldStateRef = React.useRef<MarkmapFoldState>({})
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)
  const insertFeedbackTimerRef = React.useRef<ReturnType<
    typeof setTimeout
  > | null>(null)
  const importInputRef = React.useRef<HTMLInputElement | null>(null)
  const editorStateRef = React.useRef(editorState)

  const markdown = editorState.markdown
  const jsonOptions = editorState.jsonOptions

  React.useEffect(() => {
    editorStateRef.current = editorState
  }, [editorState])

  const downloadBlob = React.useCallback((blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement("a")

    anchor.href = url
    anchor.download = filename
    anchor.click()

    URL.revokeObjectURL(url)
  }, [])

  const handleRemoteExport = React.useCallback(
    async (input: {
      exportKey: Exclude<PendingExport, null>
      endpoint: string
      filename: string
    }) => {
      if (pendingExport) {
        return
      }

      setPendingExport(input.exportKey)
      setExportMessage(null)
      setExportMessageIsError(false)

      try {
        const response = await fetch(input.endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            markdown,
            jsonOptions,
          }),
        })

        if (!response.ok) {
          throw new Error("Request failed")
        }

        const blob = await response.blob()
        downloadBlob(blob, input.filename)
        setExportMessage("Export ready.")
        setExportMessageIsError(false)
      } catch {
        setExportMessage("Export failed.")
        setExportMessageIsError(true)
      } finally {
        setPendingExport(null)
      }
    },
    [downloadBlob, jsonOptions, markdown, pendingExport]
  )

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
        foldState: foldStateRef.current,
        markdown: markdownSnapshot,
        jsonOptions: nextOptions,
      })
      if (!didSave) {
        setSaveState("error")
        return
      }

      setImportMessage(null)
      setExportMessage(null)
      setExportMessageIsError(false)
      setSaveState("saved")
      setLastSavedAt(new Date())
    },
    []
  )

  const handleViewChange = React.useCallback((nextView: "map" | "markdown") => {
    setActiveView(nextView)
    saveViewPreference(nextView)
    setImportMessage(null)
    setExportMessage(null)
    setExportMessageIsError(false)
  }, [])

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
          foldState: foldStateRef.current,
          markdown: nextValue,
          jsonOptions,
        })
        if (!didSave) {
          setSaveState("error")
          return
        }

        setImportMessage(null)
        setExportMessage(null)
        setExportMessageIsError(false)
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

    foldStateRef.current = {}
    setEditorState((previous) => ({
      ...previous,
      markdown: DEFAULT_MARKDOWN,
    }))

    const didSave = saveEditorState({
      foldState: foldStateRef.current,
      markdown: DEFAULT_MARKDOWN,
      jsonOptions,
    })
    if (!didSave) {
      setSaveState("error")
      return
    }

    setImportMessage(null)
    setExportMessage(null)
    setExportMessageIsError(false)
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
    downloadBlob(blob, "markymap.json")
  }, [downloadBlob, jsonOptions, markdown])

  const handleExportMarkdown = React.useCallback(() => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" })
    downloadBlob(blob, "markymap.md")
  }, [downloadBlob, markdown])

  const handleExportMapHtml = React.useCallback(() => {
    return handleRemoteExport({
      exportKey: "map-html",
      endpoint: "/api/export/map/html",
      filename: "markymap-map.html",
    })
  }, [handleRemoteExport])

  const handleExportMarkdownPdf = React.useCallback(() => {
    return handleRemoteExport({
      exportKey: "markdown-pdf",
      endpoint: "/api/export/markdown/pdf",
      filename: "markymap-markdown.pdf",
    })
  }, [handleRemoteExport])

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

        foldStateRef.current = {}
        setEditorState(nextState)

        const didSave = saveEditorState({
          foldState: foldStateRef.current,
          ...nextState,
        })
        if (!didSave) {
          setSaveState("error")
          return
        }

        setImportMessage(null)
        setExportMessage(null)
        setExportMessageIsError(false)
        setSaveState("saved")
        setLastSavedAt(new Date())
      } catch {
        setExportMessage(null)
        setExportMessageIsError(false)
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

  const statusLabel = exportMessage ?? importMessage ?? saveStatusLabel

  const handleFoldStateChange = React.useCallback(
    (nextFoldState: MarkmapFoldState) => {
      foldStateRef.current = nextFoldState

      const didSave = saveEditorState({
        foldState: nextFoldState,
        markdown: editorStateRef.current.markdown,
        jsonOptions: editorStateRef.current.jsonOptions,
      })

      if (!didSave) {
        setSaveState("error")
      }
    },
    []
  )

  React.useEffect(() => {
    if (hasLoadedPersistedStateRef.current) {
      return
    }

    hasLoadedPersistedStateRef.current = true
    const savedState = loadEditorState()

    if (!savedState) {
      return
    }

    foldStateRef.current = savedState.foldState
    setEditorState({
      markdown: savedState.markdown,
      jsonOptions: {
        ...DEFAULT_MARKMAP_JSON_OPTIONS,
        ...savedState.jsonOptions,
      },
    })

    const savedView = getViewPreference()
    setActiveView(savedView)
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
    activeView,
    fitSignal,
    importInputRef,
    importedStatusIsError: exportMessageIsError || Boolean(importMessage),
    insertedSnippet,
    isSnippetsOpen,
    isTipsOpen,
    jsonOptions,
    markdown,
    pendingExport,
    persistedFoldState: foldStateRef.current,
    statusLabel,
    handleChange,
    handleExportBundle,
    handleExportMapHtml,
    handleExportMarkdown,
    handleExportMarkdownPdf,
    handleFoldStateChange,
    handleImport,
    handleImportClick,
    handleInsertTemplate,
    handleJsonOptionsChange,
    handleReset,
    handleViewChange,
    setIsSnippetsOpen,
    setIsTipsOpen,
  }
}
