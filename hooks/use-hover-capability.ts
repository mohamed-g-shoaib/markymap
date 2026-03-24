"use client"

import * as React from "react"

const HOVER_POINTER_MEDIA_QUERY = "(hover: hover) and (pointer: fine)"

function subscribe(onStoreChange: () => void) {
  const mediaQuery = window.matchMedia(HOVER_POINTER_MEDIA_QUERY)

  mediaQuery.addEventListener("change", onStoreChange)

  return () => {
    mediaQuery.removeEventListener("change", onStoreChange)
  }
}

function getSnapshot() {
  return window.matchMedia(HOVER_POINTER_MEDIA_QUERY).matches
}

function getServerSnapshot() {
  return false
}

export function useHoverCapability() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
