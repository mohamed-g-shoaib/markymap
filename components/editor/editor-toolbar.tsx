"use client"

import Link from "next/link"
import { ArrowDown01Icon, Home01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { MindmapTipsDrawer } from "@/components/editor/mindmap-tips-drawer"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import {
  Menu,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuPopup,
  MenuSeparator,
  MenuTrigger,
} from "@/components/ui/menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import type { SnippetKind } from "@/components/editor/editor-templates"

type EditorToolbarProps = {
  isSnippetsOpen: boolean
  isTipsOpen: boolean
  insertedSnippet: SnippetKind | null
  onExportBundle: () => void
  onExportMarkdown: () => void
  onImportClick: () => void
  onInsertTemplate: (template: string, kind: SnippetKind) => void
  onReset: () => void
  onSnippetsOpenChange: (open: boolean) => void
  onTipsOpenChange: (open: boolean) => void
}

export function EditorToolbar({
  isSnippetsOpen,
  isTipsOpen,
  insertedSnippet,
  onExportBundle,
  onExportMarkdown,
  onImportClick,
  onInsertTemplate,
  onReset,
  onSnippetsOpenChange,
  onTipsOpenChange,
}: EditorToolbarProps) {
  const isMobile = useMediaQuery("(max-width: 639px)")

  return (
    <div className="flex flex-col gap-2 motion-fade sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Write markdown on the left and explore the live mindmap on the right.
      </p>
      <div className="flex w-full flex-wrap items-center justify-start gap-2 sm:w-auto sm:justify-end">
        <Menu>
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
          <MenuPopup align={isMobile ? "start" : "center"}>
            <MenuGroup>
              <MenuGroupLabel>Import / Export</MenuGroupLabel>
              <MenuItem onClick={onImportClick}>Import</MenuItem>
              <MenuItem onClick={onExportBundle}>Export .json</MenuItem>
              <MenuItem onClick={onExportMarkdown}>Export .md</MenuItem>
            </MenuGroup>
            <MenuSeparator />
            <MenuGroup>
              <MenuGroupLabel>View</MenuGroupLabel>
              <MenuItem onClick={onReset}>Reset + Auto-fit</MenuItem>
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
          render={<Link href="/" />}
          aria-label="Go to homepage"
        >
          <HugeiconsIcon icon={Home01Icon} size={16} color="currentColor" />
        </Button>
        <ThemeToggle />
      </div>
    </div>
  )
}
