"use client"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { MindmapTipsDrawer } from "@/components/editor/mindmap-tips-drawer"
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
  return (
    <div className="flex flex-col gap-2 motion-fade sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Write markdown on the left and explore the live mindmap on the right.
      </p>
      <div className="flex items-center justify-end gap-2">
        <Menu>
          <MenuTrigger render={<Button variant="outline" size="sm" />}>
            Workspace
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={16}
              color="currentColor"
            />
          </MenuTrigger>
          <MenuPopup align="end">
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
      </div>
    </div>
  )
}
