"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"
import type * as React from "react"

import { cn } from "@/lib/utils"

function Spinner({
  className,
  size = 16,
}: {
  className?: string
  size?: number
}) {
  return (
    <HugeiconsIcon
      aria-label="Loading"
      className={cn("animate-spin", className)}
      color="currentColor"
      icon={Loading03Icon}
      role="status"
      size={size}
    />
  )
}

export { Spinner }
