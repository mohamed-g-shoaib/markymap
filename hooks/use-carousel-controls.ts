"use client"

import * as React from "react"

const CAN_SCROLL_LEFT = 1
const CAN_SCROLL_RIGHT = 2
const EMPTY_SNAPSHOT = 0

function getSnapshot(element: HTMLElement | null): number {
  if (!element) {
    return EMPTY_SNAPSHOT
  }

  const { scrollLeft, scrollWidth, clientWidth } = element
  let snapshot = EMPTY_SNAPSHOT

  if (scrollLeft > 0) {
    snapshot |= CAN_SCROLL_LEFT
  }

  if (scrollLeft + clientWidth < scrollWidth - 4) {
    snapshot |= CAN_SCROLL_RIGHT
  }

  return snapshot
}

export function useCarouselControls() {
  const [element, setElement] = React.useState<HTMLElement | null>(null)

  const containerRef = React.useCallback((node: HTMLElement | null) => {
    setElement(node)
  }, [])

  const subscribe = React.useCallback(
    (onStoreChange: () => void) => {
      if (!element) {
        return () => {}
      }

      const onScroll = () => onStoreChange()
      const onResize = () => onStoreChange()

      element.addEventListener("scroll", onScroll, { passive: true })
      window.addEventListener("resize", onResize)

      onStoreChange()

      return () => {
        element.removeEventListener("scroll", onScroll)
        window.removeEventListener("resize", onResize)
      }
    },
    [element]
  )

  const snapshot = React.useSyncExternalStore(
    subscribe,
    () => getSnapshot(element),
    () => EMPTY_SNAPSHOT
  )

  const scrollByAmount = React.useCallback(
    (direction: 1 | -1) => {
      if (!element) return

      const amount = Math.max(288, element.clientWidth * 0.85)

      element.scrollBy({
        left: amount * direction,
        behavior: "smooth",
      })
    },
    [element]
  )

  return {
    containerRef,
    canScrollLeft: (snapshot & CAN_SCROLL_LEFT) === CAN_SCROLL_LEFT,
    canScrollRight: (snapshot & CAN_SCROLL_RIGHT) === CAN_SCROLL_RIGHT,
    scrollPrev: () => scrollByAmount(-1),
    scrollNext: () => scrollByAmount(1),
  }
}
