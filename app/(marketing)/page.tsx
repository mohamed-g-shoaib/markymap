import type { Metadata } from "next"

import { HeroSection } from "@/app/(marketing)/ui/hero"
import { LiveDemoSection } from "@/app/(marketing)/ui/demo"
import { PageContainer } from "@/app/(marketing)/ui/page-container"

export const metadata: Metadata = {
  title: "Markymap: Free Markdown to Mindmap Generator & Editor",
  description:
    "Transform your markdown notes into interactive mindmaps instantly. Markymap is a fast, local-first editor built for visual thinking and productivity.",
  openGraph: {
    title: "Markymap: Free Markdown to Mindmap Generator & Editor",
    description:
      "Transform your markdown notes into interactive mindmaps instantly. Markymap is a fast, local-first editor built for visual thinking and productivity.",
    url: "/",
  },
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
