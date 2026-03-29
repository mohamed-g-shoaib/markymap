"use client"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  FRONTMATTER_TEMPLATE,
  MAGIC_COMMENTS_TEMPLATE,
  STARTER_TEMPLATE,
  type SnippetKind,
} from "@/components/editor/editor-templates"

type MindmapTipsDrawerProps = {
  isSnippetsOpen: boolean
  isTipsOpen: boolean
  insertedSnippet: SnippetKind | null
  onInsertTemplate: (template: string, kind: SnippetKind) => void
  onSnippetsOpenChange: (open: boolean) => void
  onTipsOpenChange: (open: boolean) => void
}

export function MindmapTipsDrawer({
  isSnippetsOpen,
  isTipsOpen,
  insertedSnippet,
  onInsertTemplate,
  onSnippetsOpenChange,
  onTipsOpenChange,
}: MindmapTipsDrawerProps) {
  return (
    <Drawer open={isTipsOpen} onOpenChange={onTipsOpenChange}>
      <DrawerTrigger render={<Button variant="outline" size="sm" />}>
        Markmap Tips
      </DrawerTrigger>
      <DrawerPopup position="bottom" variant="inset" showBar showCloseButton>
        <DrawerHeader allowSelection>
          <DrawerTitle>Mindmap Markdown Guide</DrawerTitle>
          <DrawerDescription>
            Build clean, navigable mindmaps with markdown structure first, then
            open snippets for ready-made patterns.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerPanel allowSelection>
          <div className="space-y-5">
            <section className="space-y-2 rounded-md border bg-muted/24 p-3">
              <h3 className="text-base font-semibold text-foreground">
                Write Markdown First
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Treat this like normal markdown notes. The map is just a visual
                view of your headings and lists.
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                <li>
                  Use <code># Project</code>, <code>## Workstream</code>,
                  <code>### Task Group</code>.
                </li>
                <li>Use bullet lists for tasks, owners, and risks.</li>
                <li>Use numbered lists for sequence-based steps.</li>
              </ul>
            </section>

            <section className="space-y-2 rounded-md border bg-muted/24 p-3">
              <h3 className="text-base font-semibold text-foreground">
                Practical Patterns
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                These are the three most useful patterns for daily work.
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                <li>Meeting prep: agenda, decisions, action items.</li>
                <li>Feature planning: goals, timeline, owners.</li>
                <li>Study notes: topic tree with references.</li>
              </ul>
            </section>

            <section className="space-y-2 rounded-md border bg-muted/24 p-3">
              <h3 className="text-base font-semibold text-foreground">
                Collapse And Focus
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Keep maps readable by folding detail branches and setting a
                sensible initial depth.
              </p>
              <ul className="list-disc space-y-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                <li>
                  Add <code>&lt;!-- markmap: fold --&gt;</code> to collapse a
                  branch by default.
                </li>
                <li>
                  Use <code>initialExpandLevel</code> in frontmatter for a clean
                  first view.
                </li>
              </ul>
            </section>

            <section className="space-y-2 rounded-md border bg-muted/24 p-3">
              <h3 className="text-base font-semibold text-foreground">
                Ready-To-Use Snippets
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Open the snippet drawer for practical templates you can paste
                directly into project notes.
              </p>
            </section>

            <Drawer
              open={isSnippetsOpen}
              onOpenChange={onSnippetsOpenChange}
              position="bottom"
            >
              <DrawerTrigger render={<Button variant="outline" size="sm" />}>
                Open Ready-to-Use Snippets
              </DrawerTrigger>
              <DrawerPopup
                position="bottom"
                variant="inset"
                showBar
                showCloseButton
              >
                <DrawerHeader allowSelection>
                  <DrawerTitle>Snippet Library</DrawerTitle>
                  <DrawerDescription>
                    Insert common markmap patterns directly into your markdown.
                  </DrawerDescription>
                </DrawerHeader>
                <DrawerPanel allowSelection>
                  <div className="space-y-5">
                    <section className="space-y-2 rounded-md border bg-muted/24 p-3">
                      <h3 className="text-base font-semibold text-foreground">
                        Markmap Starter Example
                      </h3>
                      <pre className="overflow-x-auto rounded-md border bg-background/70 p-3 text-sm text-foreground">
                        {STARTER_TEMPLATE}
                      </pre>
                      <Button
                        size="xs"
                        variant={
                          insertedSnippet === "starter" ? "default" : "outline"
                        }
                        onClick={() => {
                          onInsertTemplate(STARTER_TEMPLATE, "starter")
                        }}
                      >
                        {insertedSnippet === "starter"
                          ? "Inserted"
                          : "Insert Starter Example"}
                      </Button>
                    </section>

                    <section className="space-y-2 rounded-md border bg-muted/24 p-3">
                      <h3 className="text-base font-semibold text-foreground">
                        JSON Frontmatter
                      </h3>
                      <pre className="overflow-x-auto rounded-md border bg-background/70 p-3 text-sm text-foreground">
                        {FRONTMATTER_TEMPLATE}
                      </pre>
                      <Button
                        size="xs"
                        variant={
                          insertedSnippet === "frontmatter"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => {
                          onInsertTemplate(FRONTMATTER_TEMPLATE, "frontmatter")
                        }}
                      >
                        {insertedSnippet === "frontmatter"
                          ? "Inserted"
                          : "Insert Frontmatter Template"}
                      </Button>
                    </section>

                    <section className="space-y-2 rounded-md border bg-muted/24 p-3">
                      <h3 className="text-base font-semibold text-foreground">
                        Magic Comments
                      </h3>
                      <pre className="overflow-x-auto rounded-md border bg-background/70 p-3 text-sm text-foreground">
                        {MAGIC_COMMENTS_TEMPLATE}
                      </pre>
                      <Button
                        size="xs"
                        variant={
                          insertedSnippet === "magic-comments"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => {
                          onInsertTemplate(
                            MAGIC_COMMENTS_TEMPLATE,
                            "magic-comments"
                          )
                        }}
                      >
                        {insertedSnippet === "magic-comments"
                          ? "Inserted"
                          : "Insert Magic Comment Template"}
                      </Button>
                    </section>
                  </div>
                </DrawerPanel>
                <DrawerFooter>
                  <DrawerClose render={<Button variant="outline" />}>
                    Close Snippets
                  </DrawerClose>
                </DrawerFooter>
              </DrawerPopup>
            </Drawer>
          </div>
        </DrawerPanel>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>Close</DrawerClose>
        </DrawerFooter>
      </DrawerPopup>
    </Drawer>
  )
}
