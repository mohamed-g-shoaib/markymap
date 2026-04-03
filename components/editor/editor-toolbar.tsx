"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowDown01Icon, Home01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { MindmapTipsDrawer } from "@/components/editor/mindmap-tips-drawer"
import { useTheme } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuCheckboxItem,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu"
import { Spinner } from "@/components/ui/spinner"
import type { SnippetKind } from "@/components/editor/editor-templates"

type EditorToolbarProps = {
  isSnippetsOpen: boolean
  isTipsOpen: boolean
  insertedSnippet: SnippetKind | null
  pendingExport: "map-html" | "markdown-pdf" | null
  onExportBundle: () => void
  onExportMapHtml: () => void | Promise<void>
  onExportMarkdown: () => void
  onExportMarkdownPdf: () => void | Promise<void>
  onImportClick: () => void
  onInsertTemplate: (template: string, kind: SnippetKind) => void
  onResetDocument: () => void
  onSnippetsOpenChange: (open: boolean) => void
  onTipsOpenChange: (open: boolean) => void
}

export function EditorToolbar({
  isSnippetsOpen,
  isTipsOpen,
  insertedSnippet,
  pendingExport,
  onExportBundle,
  onExportMapHtml,
  onExportMarkdown,
  onExportMarkdownPdf,
  onImportClick,
  onInsertTemplate,
  onResetDocument,
  onSnippetsOpenChange,
  onTipsOpenChange,
}: EditorToolbarProps) {
  const { soundEnabled, setSoundEnabled } = useTheme()
  const [isOptionsOpen, setIsOptionsOpen] = React.useState(false)
  const hasPendingExport = pendingExport !== null
  const previousPendingExportRef = React.useRef(pendingExport)

  React.useEffect(() => {
    if (previousPendingExportRef.current && !pendingExport) {
      setIsOptionsOpen(false)
    }

    previousPendingExportRef.current = pendingExport
  }, [pendingExport])

  const handleOptionsOpenChange = React.useCallback(
    (open: boolean) => {
      if (hasPendingExport) {
        setIsOptionsOpen(true)
        return
      }

      setIsOptionsOpen(open)
    },
    [hasPendingExport]
  )

  const handleMenuAction = React.useCallback(
    (action: () => void | Promise<void>) => {
      setIsOptionsOpen(true)
      void action()
    },
    []
  )

  return (
    <div className="flex flex-col gap-3 motion-fade">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
        <p className="text-sm text-muted-foreground">
          Write markdown on the left and explore the live mindmap on the right.
        </p>
      </div>
      <div className="flex w-full flex-wrap items-center justify-start gap-2">
        <Menu
          onOpenChange={handleOptionsOpenChange}
          open={hasPendingExport || isOptionsOpen}
        >
          <MenuTrigger
            className="[&[data-popup-open]_[data-slot=options-chevron]]:rotate-180"
            render={<Button variant="outline" size="sm" />}
          >
            Options
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              color="currentColor"
              data-slot="options-chevron"
              className="motion-disclosure-chevron"
            />
          </MenuTrigger>
          <MenuPopup align="start">
            <MenuGroup>
              <MenuGroupLabel className="text-primary/72">
                Document
              </MenuGroupLabel>
              <MenuItem onClick={onImportClick}>Import</MenuItem>
              <MenuItem onClick={onResetDocument}>Reset document</MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel className="text-primary/72">
                Project Export
              </MenuGroupLabel>
              <MenuItem onClick={onExportBundle}>Export .json</MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel className="text-primary/72">
                Markdown Export
              </MenuGroupLabel>
              <MenuItem onClick={onExportMarkdown}>Export .md</MenuItem>
              <MenuItem
                disabled={hasPendingExport}
                onClick={() => {
                  handleMenuAction(onExportMarkdownPdf)
                }}
              >
                {pendingExport === "markdown-pdf" ? (
                  <>
                    <Spinner size={16} />
                    Exporting markdown .pdf
                  </>
                ) : (
                  "Export markdown .pdf"
                )}
              </MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel className="text-primary/72">
                Map Export
              </MenuGroupLabel>
              <MenuItem
                disabled={hasPendingExport}
                onClick={() => {
                  handleMenuAction(onExportMapHtml)
                }}
              >
                {pendingExport === "map-html" ? (
                  <>
                    <Spinner size={16} />
                    Exporting map .html
                  </>
                ) : (
                  "Export map .html"
                )}
              </MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel className="text-primary/72">
                Preferences
              </MenuGroupLabel>
              <MenuCheckboxItem
                checked={soundEnabled}
                variant="switch"
                onCheckedChange={setSoundEnabled}
              >
                Interaction sounds
              </MenuCheckboxItem>
            </MenuGroup>
          </MenuPopup>
        </Menu>

        <MindmapTipsDrawer
          isSnippetsOpen={isSnippetsOpen}
          isTipsOpen={isTipsOpen}
          insertedSnippet={insertedSnippet}
          onInsertTemplate={onInsertTemplate}
          onSnippetsOpenChange={onSnippetsOpenChange}
          onTipsOpenChange={onTipsOpenChange}
        />
        <Button
          variant="outline"
          size="icon-sm"
          render={<Link href="/" transitionTypes={["nav-back"]} />}
          aria-label="Go to homepage"
        >
          <HugeiconsIcon icon={Home01Icon} size={16} color="currentColor" />
        </Button>
        <ThemeToggle useSwitchSound />
      </div>
    </div>
  )
}
