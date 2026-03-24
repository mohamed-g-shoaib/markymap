"use client"

import * as React from "react"

export function useMediaQuery(query: string): boolean {
  const subscribe = React.useCallback(
    (callback: () => void) => {
      const mediaQuery = window.matchMedia(query)
      mediaQuery.addEventListener("change", callback)
      return () => {
        mediaQuery.removeEventListener("change", callback)
      }
    },
    [query]
  )

  const getSnapshot = React.useCallback(() => {
    return window.matchMedia(query).matches
  }, [query])

  const getServerSnapshot = React.useCallback(() => {
    return false
  }, [])

  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
