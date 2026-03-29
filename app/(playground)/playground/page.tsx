import { PlaygroundEditorMount } from "@/components/editor/playground-editor-mount"

export default function PlaygroundPage() {
  return (
    <main className="flex min-h-dvh flex-col gap-4 overflow-y-auto px-4 layout-page-inset sm:h-dvh sm:overflow-hidden sm:px-6 lg:px-10">
      <div className="shrink-0">
        <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
      </div>
      <div className="min-h-0 flex-1">
        <PlaygroundEditorMount />
      </div>
    </main>
  )
}
