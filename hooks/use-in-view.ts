"use client"

import * as React from "react"

type UseInViewOptions = {
  once?: boolean
  threshold?: number
  root?: Element | null
  rootMargin?: string
}

export function useInView(options: UseInViewOptions = {}) {
  const {
    once = true,
    threshold = 0.15,
    root = null,
    rootMargin = "0px",
  } = options
  const [node, setNode] = React.useState<Element | null>(null)
  const [inView, setInView] = React.useState(false)

  const ref = React.useCallback((element: Element | null) => {
    setNode(element)
  }, [])

  React.useEffect(() => {
    if (!node) return

    if (typeof IntersectionObserver === "undefined") {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry?.isIntersecting ?? false

        if (!isIntersecting) return

        setInView(true)

        if (once) {
          observer.unobserve(node)
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    )

    observer.observe(node)

    return () => {
      observer.disconnect()
    }
  }, [node, once, root, rootMargin, threshold])

  return [ref, inView] as const
}
