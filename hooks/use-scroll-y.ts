"use client"

import * as React from "react"

function subscribe(onStoreChange: () => void) {
  const listener = () => onStoreChange()

  window.addEventListener("scroll", listener, { passive: true })
  window.addEventListener("resize", listener)

  return () => {
    window.removeEventListener("scroll", listener)
    window.removeEventListener("resize", listener)
  }
}

function getSnapshot() {
  return window.scrollY || window.pageYOffset || 0
}

function getServerSnapshot() {
  return 0
}

export function useScrollY() {
  return React.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
