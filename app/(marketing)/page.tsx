import type { Metadata } from "next"
import { ViewTransition } from "react"

import { HeroSection } from "@/app/(marketing)/ui/hero"
import { LiveDemoSection } from "@/app/(marketing)/ui/demo"
import { FooterSection } from "@/app/(marketing)/ui/footer"
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
    siteName: "Markymap",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Markymap | Markdown to Mindmap",
      },
    ],
  },
}

export default function MarketingPage() {
  return (
    <ViewTransition
      enter={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      exit={{
        "nav-forward": "nav-forward",
        "nav-back": "nav-back",
        default: "none",
      }}
      default="none"
    >
      <main className="flex min-h-dvh flex-col gap-5 overflow-y-auto layout-page-inset sm:h-dvh sm:justify-center sm:gap-6 sm:overflow-hidden">
        <HeroSection />
        <PageContainer className="flex min-h-0 flex-col">
          <LiveDemoSection />
        </PageContainer>
        <FooterSection />
      </main>
    </ViewTransition>
  )
}
