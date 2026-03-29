"use client"

import { Card } from "@/components/ui/card"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { Separator } from "@/components/ui/separator"
import { MarkmapCanvas } from "@/components/editor/markmap-canvas"
import { MarkdownInput } from "@/components/editor/markdown-input"
import { useEditorShellState } from "@/components/editor/use-editor-shell-state"

export function EditorShell() {
  const {
    fitSignal,
    importInputRef,
    importedStatusIsError,
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
  } = useEditorShellState()

  return (
    <div className="flex min-h-0 flex-col space-y-3 sm:h-full">
      <EditorToolbar
        isSnippetsOpen={isSnippetsOpen}
        isTipsOpen={isTipsOpen}
        insertedSnippet={insertedSnippet}
        onExportBundle={handleExportBundle}
        onExportMarkdown={handleExportMarkdown}
        onImportClick={handleImportClick}
        onInsertTemplate={handleInsertTemplate}
        onReset={handleReset}
        onSnippetsOpenChange={setIsSnippetsOpen}
        onTipsOpenChange={setIsTipsOpen}
      />
      <input
        ref={importInputRef}
        type="file"
        accept=".json,.md,application/json,text/markdown,text/plain"
        className="sr-only"
        onChange={(event) => {
          void handleImport(event)
        }}
      />
      <Card className="min-h-176 overflow-hidden motion-fade sm:min-h-0 sm:flex-1">
        <div className="grid h-full min-h-0 grid-cols-1 grid-rows-[minmax(20rem,1fr)_auto_minmax(20rem,1fr)] sm:grid-cols-[1fr_auto_1fr] sm:grid-rows-1">
          <MarkdownInput
            markdown={markdown}
            onChange={handleChange}
            statusLabel={statusLabel}
            isStatusError={importedStatusIsError}
          />
          <Separator orientation="vertical" className="hidden sm:block" />
          <Separator className="sm:hidden" />
          <MarkmapCanvas
            markdown={markdown}
            jsonOptions={jsonOptions}
            onJsonOptionsChange={handleJsonOptionsChange}
            fitSignal={fitSignal}
          />
        </div>
      </Card>
    </div>
  )
}
