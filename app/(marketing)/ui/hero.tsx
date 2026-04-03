import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { SoundToggle } from "@/components/sound-toggle"
import { ThemeToggle } from "@/components/theme-toggle"
import { PageContainer } from "@/app/(marketing)/ui/page-container"

export function HeroSection() {
  return (
    <section>
      <PageContainer>
        <div className="space-y-5 sm:space-y-6">
          <h1 className="hero-delay-0 animate-hero-enter text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Markymap turns plain notes into maps you can actually navigate.
          </h1>
          <p className="hero-delay-100 animate-hero-enter text-base text-pretty text-muted-foreground sm:text-lg">
            Preview the map instantly here, then open the playground to edit
            markdown, switch views, and export your final result.
          </p>
          <div className="hero-delay-200 flex animate-hero-enter flex-row items-center gap-2.5 sm:gap-3">
            <Button
              className="order-1"
              render={
                <Link href="/playground" transitionTypes={["nav-forward"]} />
              }
            >
              Open playground
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="currentColor"
              />
            </Button>
            <div className="order-2 inline-flex items-center gap-2">
              <ThemeToggle size="icon" useSwitchSound />
              <SoundToggle size="icon" />
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
