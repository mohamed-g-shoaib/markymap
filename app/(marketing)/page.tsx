import type { Metadata } from "next"

import { HeroSection } from "@/app/(marketing)/ui/hero"
import { LiveDemoSection } from "@/app/(marketing)/ui/demo"
import { PageContainer } from "@/app/(marketing)/ui/page-container"

export const metadata: Metadata = {
  title: "Markymap",
  description:
    "Write in markdown, switch between map and markdown preview instantly.",
}

export default function MarketingPage() {
  return (
    <main className="flex min-h-dvh flex-col gap-5 overflow-y-auto layout-page-inset sm:h-dvh sm:gap-6 sm:overflow-hidden">
      <HeroSection />
      <PageContainer className="flex min-h-0 flex-1 flex-col">
        <LiveDemoSection />
      </PageContainer>
    </main>
  )
}
