import Link from "next/link"
import { ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { PageContainer } from "@/app/(marketing)/ui/page-container"

export function HeroSection() {
  return (
    <section>
      <PageContainer>
        <div className="max-w-5xl">
          <h1 className="hero-delay-0 max-w-4xl animate-hero-enter text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            Markymap turns plain notes into maps you can actually navigate.
          </h1>
          <p className="hero-delay-100 mt-4 max-w-3xl animate-hero-enter text-base text-pretty text-muted-foreground sm:text-lg">
            Shape your structure fast, keep context attached to every branch,
            and revisit complex ideas without losing the thread.
          </p>
          <div className="hero-delay-200 mt-7 flex animate-hero-enter flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-4">
            <Button render={<Link href="/playground" />}>
              Open playground
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                size={16}
                color="currentColor"
              />
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
