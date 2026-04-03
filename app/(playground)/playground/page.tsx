import { PlaygroundEditorMount } from "@/components/editor/playground-editor-mount"
import type { Metadata } from "next"
import { ViewTransition } from "react"

export const metadata: Metadata = {
  title: "Playground | Markymap Editor",
  description:
    "Create, edit, and export interactive mindmaps in your browser. Auto-saves locally for a smooth markdown authoring experience.",
  openGraph: {
    title: "Playground | Markymap Editor",
    description:
      "Create, edit, and export interactive mindmaps in your browser. Auto-saves locally for a smooth markdown authoring experience.",
    url: "/playground",
    siteName: "Markymap",
    images: [
      {
        url: "/playground/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Playground | Markymap Editor",
      },
    ],
  },
}

export default function PlaygroundPage() {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <main className="flex min-h-dvh flex-col gap-4 overflow-y-auto px-4 layout-page-inset sm:h-dvh sm:overflow-hidden sm:px-6 lg:px-10">
        <div className="min-h-0 flex-1">
          <PlaygroundEditorMount />
        </div>
      </main>
    </ViewTransition>
  )
}
