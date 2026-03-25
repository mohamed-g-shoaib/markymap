"use client"

type MarkdownInputProps = {
  markdown: string
  onChange: (value: string) => void
}

export function MarkdownInput({ markdown, onChange }: MarkdownInputProps) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 items-center justify-between border-b bg-background px-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Markdown
        </p>
        <p className="text-xs text-muted-foreground tabular-nums">
          {markdown.length} chars
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <textarea
          value={markdown}
          onChange={(event) => onChange(event.target.value)}
          className="size-full min-h-0 resize-none overflow-x-hidden overflow-y-auto border-0 bg-transparent p-4 font-mono text-sm text-foreground outline-none"
        />
      </div>
    </div>
  )
}
