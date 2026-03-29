import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageContainer } from "@/app/(marketing)/ui/page-container"

export function HeroSection() {
  return (
    <section>
      <PageContainer>
        <div className="space-y-5 sm:space-y-6">
          <h1 className="hero-delay-0 animate-hero-enter text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Markymap turns plain notes into maps you can navigate and markdown
            you can read and edit.
          </h1>
          <p className="hero-delay-100 animate-hero-enter text-base text-pretty text-muted-foreground sm:text-lg">
            Write in Markdown, view as a mindmap, and switch instantly between
            both views as you plan and refine.
          </p>
          <div className="hero-delay-200 flex animate-hero-enter flex-row items-center gap-3 sm:gap-4">
            <Button className="order-1" render={<Link href="/playground" />}>
              Open playground
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="currentColor"
              />
            </Button>
            <ThemeToggle size="icon" className="order-2" />
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
