import * as React from "react"

import { cn } from "@/lib/utils"

type PageContainerVariant = "wide" | "measure"

type PageContainerProps = {
  children: React.ReactNode
  className?: string
  variant?: PageContainerVariant
}

const containerVariants: Record<PageContainerVariant, string> = {
  wide: "mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-10",
  measure: "mx-auto w-full max-w-3xl px-4 sm:px-6",
}

export function PageContainer({
  children,
  className,
  variant = "wide",
}: PageContainerProps) {
  return (
    <div className={cn(containerVariants[variant], className)}>{children}</div>
  )
}
