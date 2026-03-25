import { EditorShell } from "@/components/editor/editor-shell"

export default function PlaygroundPage() {
  return (
    <main className="w-full px-4 py-10 sm:px-6 lg:px-10">
      <div className="mb-5">
        <h1 className="text-2xl font-semibold tracking-tight">Playground</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Write markdown on the left and explore the live mindmap on the right.
        </p>
      </div>
      <EditorShell />
    </main>
  )
}
