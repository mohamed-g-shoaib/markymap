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
      <div className="flex h-10 items-center justify-between gap-2 border-b bg-background px-3 sm:px-4">
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Markdown
        </p>
        <div className="flex min-w-0 items-center gap-1.5 text-[11px] tabular-nums sm:gap-2 sm:text-xs">
          <p
            className={
              isStatusError
                ? "truncate text-destructive"
                : "truncate text-muted-foreground"
            }
          >
            {statusLabel}
          </p>
          <span className="text-muted-foreground/60 sm:inline">|</span>
          <p className="text-muted-foreground">{markdown.length} chars</p>
        </div>
      </div>
      <div className="min-h-0 flex-1 overflow-hidden">
        <textarea
          value={markdown}
          onChange={(event) => onChange(event.target.value)}
          className="scrollbar-subtle size-full min-h-0 resize-none overflow-x-hidden overflow-y-auto border-0 bg-transparent p-4 font-mono text-sm text-foreground outline-none"
        />
      </div>
    </div>
  )
}
