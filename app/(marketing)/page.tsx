import type { Metadata } from "next"

import { HeroSection } from "@/app/(marketing)/ui/hero"
import { LiveDemoSection } from "@/app/(marketing)/ui/demo"
import { PageContainer } from "@/app/(marketing)/ui/page-container"

export const metadata: Metadata = {
  title: "Markymap",
  description: "Markdown that maps itself.",
}

export default function MarketingPage() {
  return (
    <main className="flex h-dvh flex-col gap-5 overflow-hidden layout-page-inset sm:gap-6">
      <HeroSection />
      <PageContainer className="flex min-h-0 flex-1 flex-col">
        <LiveDemoSection />
      </PageContainer>
    </main>
  )
}
