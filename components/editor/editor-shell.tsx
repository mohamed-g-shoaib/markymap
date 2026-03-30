"use client"

import { Card } from "@/components/ui/card"
import { EditorToolbar } from "@/components/editor/editor-toolbar"
import { Separator } from "@/components/ui/separator"
import { MarkmapCanvas } from "@/components/editor/markmap-canvas"
import { MarkdownInput } from "@/components/editor/markdown-input"
import { useEditorShellState } from "@/components/editor/use-editor-shell-state"

export function EditorShell() {
  const {
    activeView,
    fitSignal,
    importInputRef,
    importedStatusIsError,
    insertedSnippet,
    isSnippetsOpen,
    isTipsOpen,
    jsonOptions,
    markdown,
    pendingExport,
    statusLabel,
    handleChange,
    handleExportBundle,
    handleExportMapHtml,
    handleExportMarkdown,
    handleExportMarkdownPdf,
    handleImport,
    handleImportClick,
    handleInsertTemplate,
    handleJsonOptionsChange,
    handleReset,
    handleViewChange,
    setIsSnippetsOpen,
    setIsTipsOpen,
  } = useEditorShellState()

  return (
    <div className="flex min-h-0 flex-col space-y-3 sm:h-full">
      <EditorToolbar
        isSnippetsOpen={isSnippetsOpen}
        isTipsOpen={isTipsOpen}
        insertedSnippet={insertedSnippet}
        pendingExport={pendingExport}
        onExportBundle={handleExportBundle}
        onExportMapHtml={handleExportMapHtml}
        onExportMarkdown={handleExportMarkdown}
        onExportMarkdownPdf={handleExportMarkdownPdf}
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
      <Card className="overflow-hidden motion-fade sm:min-h-0 sm:flex-1">
        <div className="grid grid-cols-1 grid-rows-[32rem_auto_32rem] sm:min-h-0 sm:flex-1 sm:grid-cols-[1fr_auto_1fr] sm:grid-rows-1">
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
            activeView={activeView}
            onJsonOptionsChange={handleJsonOptionsChange}
            onViewChange={handleViewChange}
            fitSignal={fitSignal}
          />
        </div>
      </Card>
    </div>
  )
}
