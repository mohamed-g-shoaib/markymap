import { EditorShell } from "@/components/editor/editor-shell"

export default function PlaygroundPage() {
  return (
    <main className="flex h-dvh flex-col gap-4 overflow-hidden px-4 layout-page-inset sm:px-6 lg:px-10">
      <div className="shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
      </div>
      <div className="min-h-0 flex-1">
        <EditorShell />
      </div>
    </main>
  )
}
