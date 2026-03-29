"use client"

import * as React from "react"

import { EditorShell } from "@/components/editor/editor-shell"

export function PlaygroundEditorMount() {
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-full min-h-0 animate-pulse rounded-lg border border-border/60 bg-muted/25" />
    )
  }

  return <EditorShell />
}
