"use client"

type MarkdownInputProps = {
  markdown: string
  onChange: (value: string) => void
  statusLabel: string
  isStatusError?: boolean
}

export function MarkdownInput({
  markdown,
  onChange,
  statusLabel,
  isStatusError = false,
}: MarkdownInputProps) {
  return (
    <div className="flex min-h-0 flex-col overflow-hidden">
      <div className="flex h-10 items-center justify-between border-b bg-background px-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Markdown
        </p>
        <div className="flex items-center gap-2 text-xs tabular-nums">
          <p
            className={
              isStatusError ? "text-destructive" : "text-muted-foreground"
            }
          >
            {statusLabel}
          </p>
          <span className="text-muted-foreground/60">|</span>
          <p className="text-muted-foreground">{markdown.length} chars</p>
        </div>
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
