# Floating Dock Recreation Guide

This document explains how to recreate the floating dock used in this portfolio in another Next.js project.

It is written as an implementation handoff for another agent. The goal is not to describe the idea loosely, but to give the exact moving pieces needed to rebuild it with the same behavior and feel.

## What This Dock Includes

- fixed bottom-center dock
- active background frame that slides between items
- tooltip labels for dock items
- contact popover with inline action chips
- theme toggle
- layered backdrop blur field behind the dock on larger screens
- restrained motion tuned for a calm editorial interface

## Stack Assumptions

The original dock was built in:

- Next.js App Router
- React
- TypeScript
- Tailwind CSS v4
- Base UI
- `next-themes`

If the target project uses a different setup, adapt imports and utility syntax as needed.

## Required Packages

Install these if they do not already exist in the target project:

```bash
pnpm add @base-ui/react @hugeicons/react @hugeicons/core-free-icons next-themes clsx tailwind-merge
```

## Recommended File Structure

Use this structure in the target project:

```text
components/
  floating-dock.tsx
  ui/
    tooltip.tsx
    popover.tsx
    kbd.tsx
lib/
  utils.ts
```

You will also need to add a few global CSS utilities in the project stylesheet, usually `app/globals.css`.

## 1. Utility Helper

Create `lib/utils.ts`:

```ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## 2. Tooltip Primitive

Create `components/ui/tooltip.tsx`:

```tsx
"use client"

import * as React from "react"
import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip"

import { cn } from "@/lib/utils"

function TooltipProvider({
  children,
  delay = 180,
  closeDelay = 0,
  timeout = 250,
}: React.ComponentProps<typeof BaseTooltip.Provider>) {
  return (
    <BaseTooltip.Provider
      delay={delay}
      closeDelay={closeDelay}
      timeout={timeout}
    >
      {children}
    </BaseTooltip.Provider>
  )
}

function Tooltip({
  children,
  disabled,
  handle,
}: {
  children: React.ReactNode
  disabled?: boolean
  handle?: React.ComponentProps<typeof BaseTooltip.Root>["handle"]
}) {
  return (
    <BaseTooltip.Root disabled={disabled} handle={handle}>
      {children}
    </BaseTooltip.Root>
  )
}

function TooltipTrigger({
  children,
  ...props
}: React.ComponentProps<typeof BaseTooltip.Trigger> & {
  children: React.ReactElement
}) {
  return <BaseTooltip.Trigger render={children} {...props} />
}

function TooltipContent({
  children,
  className,
  side = "top",
  sideOffset = 12,
}: {
  children: React.ReactNode
  className?: string
  side?: React.ComponentProps<typeof BaseTooltip.Positioner>["side"]
  sideOffset?: React.ComponentProps<typeof BaseTooltip.Positioner>["sideOffset"]
}) {
  return (
    <BaseTooltip.Portal>
      <BaseTooltip.Positioner side={side} sideOffset={sideOffset}>
        <BaseTooltip.Popup
          data-slot="tooltip-content"
          className={cn(
            "tooltip relative motion-overlay-scale rounded-xl border border-border/80 bg-background px-3 py-1.5 text-xs text-foreground shadow-none data-[instant]:duration-0",
            className
          )}
        >
          {children}
        </BaseTooltip.Popup>
      </BaseTooltip.Positioner>
    </BaseTooltip.Portal>
  )
}

const createTooltipHandle = BaseTooltip.createHandle

export {
  createTooltipHandle,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
}
```

## 3. Popover Primitive

Create `components/ui/popover.tsx`:

```tsx
"use client"

import * as React from "react"
import { Popover as BasePopover } from "@base-ui/react/popover"

import { cn } from "@/lib/utils"

function Popover({
  children,
  open,
  onOpenChange,
  handle,
  triggerId,
}: {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: React.ComponentProps<typeof BasePopover.Root>["onOpenChange"]
  handle?: React.ComponentProps<typeof BasePopover.Root>["handle"]
  triggerId?: React.ComponentProps<typeof BasePopover.Root>["triggerId"]
}) {
  return (
    <BasePopover.Root
      open={open}
      onOpenChange={onOpenChange}
      handle={handle}
      triggerId={triggerId}
    >
      {children}
    </BasePopover.Root>
  )
}

function PopoverTrigger({
  children,
  ...props
}: React.ComponentProps<typeof BasePopover.Trigger> & {
  children: React.ReactElement
}) {
  return <BasePopover.Trigger render={children} {...props} />
}

function PopoverContent({
  children,
  className,
  side = "top",
  sideOffset = 14,
  align = "center",
  anchor,
}: {
  children: React.ReactNode
  className?: string
  side?: React.ComponentProps<typeof BasePopover.Positioner>["side"]
  sideOffset?: React.ComponentProps<typeof BasePopover.Positioner>["sideOffset"]
  align?: React.ComponentProps<typeof BasePopover.Positioner>["align"]
  anchor?: React.ComponentProps<typeof BasePopover.Positioner>["anchor"]
}) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        side={side}
        sideOffset={sideOffset}
        align={align}
        anchor={anchor}
      >
        <BasePopover.Popup
          data-slot="popover-content"
          className={cn(
            "z-40 motion-overlay-lift-blur rounded-2xl border border-border/70 bg-background/22 p-2 backdrop-blur-md",
            className
          )}
        >
          {children}
        </BasePopover.Popup>
      </BasePopover.Positioner>
    </BasePopover.Portal>
  )
}

const createPopoverHandle = BasePopover.createHandle

export { createPopoverHandle, Popover, PopoverContent, PopoverTrigger }
```

## 4. Small Keyboard Key Component

Create `components/ui/kbd.tsx`:

```tsx
import { cn } from "@/lib/utils"

function Kbd({ className, ...props }: React.ComponentProps<"kbd">) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex h-5 min-w-5 items-center justify-center rounded-sm border border-border/80 bg-muted/80 px-1 font-sans text-[10px] font-semibold text-foreground select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    />
  )
}

export { Kbd }
```

## 5. Global CSS Requirements

Add these utilities to the global stylesheet. The dock depends on them for motion timing and overlay transitions.

This version assumes the target project already has design tokens like:

- `--ease-out`
- `--motion-duration-fast`
- `--motion-duration-medium`
- `--motion-duration-layout`
- `--motion-disclosure-shift`

If not, add them too.

### Required Tokens

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --motion-duration-fast: 140ms;
  --motion-duration-medium: 180ms;
  --motion-duration-layout: 220ms;
  --motion-disclosure-shift: 2px;
}
```

### Required Dock-Related CSS

```css
body {
  padding-bottom: calc(env(safe-area-inset-bottom) + 2rem);
}

html {
  scroll-padding-bottom: calc(env(safe-area-inset-bottom) + 2rem);
}

.tooltip {
  transform-origin: var(--transform-origin);
}

@utility motion-interactive-color {
  transition-duration: var(--motion-duration-fast);
  transition-property: color;
  transition-timing-function: var(--ease-out);

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0ms;
  }
}

@utility motion-overlay-scale {
  transition-duration: var(--motion-duration-fast);
  transition-property: transform, opacity;
  transition-timing-function: var(--ease-out);

  &[data-starting-style] {
    opacity: 0;
    transform: scale(0.97);
  }

  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.985);
    transition-duration: 120ms;
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0ms;
  }
}

@utility motion-overlay-lift-blur {
  transition-duration: var(--motion-duration-medium);
  transition-property: transform, opacity, filter;
  transition-timing-function: var(--ease-out);

  &[data-starting-style] {
    opacity: 0;
    transform: translateY(var(--motion-disclosure-shift));
    filter: blur(2px);
  }

  &[data-ending-style] {
    opacity: 0;
    transform: translateY(-2px);
    filter: blur(2px);
    transition-duration: 120ms;
    transition-timing-function: cubic-bezier(0.4, 0, 1, 1);
  }

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0ms;

    &[data-starting-style],
    &[data-ending-style] {
      transform: none;
      filter: none;
    }
  }
}

@utility motion-layout-frame {
  transition-duration: var(--motion-duration-layout);
  transition-property: transform, width, height;
  transition-timing-function: var(--ease-out);

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0ms;
  }
}

@utility motion-surface-interaction {
  transition-duration: var(--motion-duration-medium);
  transition-property:
    background-color, color, border-color, box-shadow, opacity, transform;
  transition-timing-function: var(--ease-out);

  @media (prefers-reduced-motion: reduce) {
    transition-duration: 0ms;
  }
}
```

## 6. Floating Dock Component

Create `components/floating-dock.tsx`.

This is the full dock component, adapted into a reusable handoff version. Replace the navigation items and contact links with the target project data.

```tsx
"use client"

import Link from "next/link"
import * as React from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  BloggerIcon,
  Home01Icon,
  MailAtSign01Icon,
  SourceCodeSquareIcon,
} from "@hugeicons/core-free-icons"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"

import { Kbd } from "@/components/ui/kbd"
import {
  createPopoverHandle,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
  createTooltipHandle,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type DockKey = "home" | "projects" | "writing" | "contact"

type DockLinkItem = {
  key: Exclude<DockKey, "contact">
  href: string
  icon: React.ReactNode
  label: string
}

type ActiveFrame = {
  height: number
  left: number
  width: number
}

type SocialLink = {
  href: string
  label: string
}

const socialLinks: SocialLink[] = [
  { label: "Email", href: "mailto:hello@example.com" },
  { label: "GitHub", href: "https://github.com/your-handle" },
  { label: "LinkedIn", href: "https://linkedin.com/in/your-handle" },
  { label: "X", href: "https://x.com/your-handle" },
]

const DOCK_SURFACE_CLASS =
  "max-w-[calc(100vw-2rem)] rounded-2xl border border-border/70 bg-background/60 p-1.5 backdrop-blur-xl"

const DOCK_POPOVER_SURFACE_CLASS =
  "max-w-[calc(100vw-2rem)] rounded-2xl border border-border/70 bg-background/60 p-1.5 backdrop-blur-xl"

const DOCK_CONTACT_ACTION_CLASS =
  "motion-surface-interaction relative z-10 inline-flex h-8 min-w-0 items-center rounded-xl border border-border/60 bg-muted px-2.5 py-1.5 font-sans text-[0.84rem] leading-none text-muted-foreground hover:border-border/90 hover:bg-card hover:text-foreground focus-visible:border-border/90 focus-visible:bg-card focus-visible:text-foreground focus-visible:outline-none sm:h-9 sm:px-3 sm:text-[0.875rem]"

export function FloatingDock() {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()
  const [contactOpen, setContactOpen] = React.useState(false)
  const [pendingActiveKey, setPendingActiveKey] = React.useState<Exclude<
    DockKey,
    "contact"
  > | null>(null)
  const clusterRef = React.useRef<HTMLDivElement | null>(null)
  const itemRefs = React.useRef<Partial<Record<DockKey, HTMLElement | null>>>(
    {}
  )
  const [activeFrame, setActiveFrame] = React.useState<ActiveFrame | null>(null)

  const items: DockLinkItem[] = [
    {
      key: "home",
      href: "/",
      icon: <DockIcon icon={Home01Icon} />,
      label: "Home",
    },
    {
      key: "projects",
      href: "/projects",
      icon: <DockIcon icon={SourceCodeSquareIcon} />,
      label: "Projects",
    },
    {
      key: "writing",
      href: "/writing",
      icon: <DockIcon icon={BloggerIcon} />,
      label: "Writing",
    },
  ]

  const baseActiveKey: Exclude<DockKey, "contact"> | null = pathname.startsWith(
    "/writing"
  )
    ? "writing"
    : pathname.startsWith("/projects")
      ? "projects"
      : pathname === "/"
        ? "home"
        : null

  const activeKey: DockKey | null = contactOpen
    ? "contact"
    : (pendingActiveKey ?? baseActiveKey)

  const updateActiveFrame = React.useCallback((key: DockKey | null) => {
    if (!key) {
      setActiveFrame(null)
      return
    }

    const current = itemRefs.current[key]

    if (!current) {
      setActiveFrame(null)
      return
    }

    const nextFrame = {
      height: current.offsetHeight,
      left: current.offsetLeft,
      width: current.offsetWidth,
    }

    setActiveFrame((previous) => {
      if (
        previous &&
        previous.height === nextFrame.height &&
        previous.left === nextFrame.left &&
        previous.width === nextFrame.width
      ) {
        return previous
      }

      return nextFrame
    })
  }, [])

  React.useLayoutEffect(() => {
    updateActiveFrame(activeKey)
  }, [activeKey, updateActiveFrame])

  React.useEffect(() => {
    setPendingActiveKey(null)
  }, [pathname])

  React.useEffect(() => {
    const cluster = clusterRef.current

    if (!cluster) {
      return
    }

    const observer = new ResizeObserver(() => {
      updateActiveFrame(activeKey)
    })

    observer.observe(cluster)

    Object.values(itemRefs.current).forEach((element) => {
      if (element) {
        observer.observe(element)
      }
    })

    window.addEventListener("resize", handleWindowResize)

    function handleWindowResize() {
      updateActiveFrame(activeKey)
    }

    return () => {
      window.removeEventListener("resize", handleWindowResize)
      observer.disconnect()
    }
  }, [activeKey, updateActiveFrame])

  function handleThemeToggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }

  return (
    <TooltipProvider>
      <div className="fixed bottom-0 left-1/2 z-50 flex w-full -translate-x-1/2 justify-center px-4 pb-2.5 sm:pb-5">
        <div className="pointer-events-none absolute bottom-0 left-1/2 hidden h-[calc(100%+0.75rem)] w-[min(42rem,calc(100vw-2rem))] -translate-x-1/2 sm:block">
          <div className="absolute inset-0 z-[1] backdrop-blur-[0.5px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_0%,_rgba(0,0,0,1)_12.5%,_rgba(0,0,0,1)_25%,_rgba(0,0,0,0)_37.5%)]" />
          <div className="absolute inset-0 z-[2] backdrop-blur-[1px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_12.5%,_rgba(0,0,0,1)_25%,_rgba(0,0,0,1)_37.5%,_rgba(0,0,0,0)_50%)]" />
          <div className="absolute inset-0 z-[3] backdrop-blur-[2px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_25%,_rgba(0,0,0,1)_37.5%,_rgba(0,0,0,1)_50%,_rgba(0,0,0,0)_62.5%)]" />
          <div className="absolute inset-0 z-[4] backdrop-blur-[3px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_37.5%,_rgba(0,0,0,1)_50%,_rgba(0,0,0,1)_62.5%,_rgba(0,0,0,0)_75%)]" />
          <div className="absolute inset-0 z-[5] backdrop-blur-[4px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_50%,_rgba(0,0,0,1)_62.5%,_rgba(0,0,0,1)_75%,_rgba(0,0,0,0)_87.5%)]" />
          <div className="absolute inset-0 z-[6] backdrop-blur-[5px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_62.5%,_rgba(0,0,0,1)_75%,_rgba(0,0,0,1)_87.5%,_rgba(0,0,0,0)_100%)]" />
          <div className="absolute inset-0 z-[7] backdrop-blur-[6px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_75%,_rgba(0,0,0,1)_87.5%,_rgba(0,0,0,1)_100%)]" />
          <div className="absolute inset-0 z-[8] backdrop-blur-[12px] [mask:linear-gradient(to_bottom,_rgba(0,0,0,0)_87.5%,_rgba(0,0,0,1)_100%)]" />
        </div>

        <div className="relative inline-flex max-w-[calc(100vw-2rem)]">
          <nav
            aria-label="Quick navigation"
            className={cn(
              "pointer-events-auto relative z-30",
              DOCK_SURFACE_CLASS
            )}
          >
            <div className="flex items-center gap-1.5">
              <div
                ref={clusterRef}
                className="relative flex items-center gap-1.5"
              >
                {activeFrame ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute top-0 left-0 z-0 rounded-xl bg-muted motion-layout-frame"
                    style={{
                      height: `${activeFrame.height}px`,
                      transform: `translateX(${activeFrame.left}px)`,
                      width: `${activeFrame.width}px`,
                    }}
                  />
                ) : null}

                {items.map((item) => (
                  <DockTooltip key={item.key} label={item.label}>
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      ref={(element) => {
                        itemRefs.current[item.key] = element
                      }}
                      onPointerDownCapture={() => {
                        setPendingActiveKey(item.key)
                      }}
                      onClick={() => {
                        setPendingActiveKey(item.key)
                        setContactOpen(false)
                      }}
                      className={cn(
                        "relative z-10 flex size-9 items-center justify-center rounded-xl bg-transparent text-muted-foreground motion-interactive-color outline-none hover:text-foreground focus-visible:text-foreground",
                        activeKey === item.key && "text-foreground"
                      )}
                    >
                      {item.icon}
                    </Link>
                  </DockTooltip>
                ))}

                <DockContactPopover
                  open={contactOpen}
                  onOpenChange={setContactOpen}
                  isActive={activeKey === "contact"}
                  onTriggerRefChange={(element) => {
                    itemRefs.current.contact = element
                  }}
                />
              </div>

              <DockTooltip
                label={resolvedTheme === "dark" ? "Light mode" : "Dark mode"}
                shortcut="D"
              >
                <button
                  type="button"
                  aria-label="Toggle theme"
                  onClick={handleThemeToggle}
                  className="flex size-9 items-center justify-center rounded-xl bg-transparent text-foreground outline-none"
                >
                  <span className="size-[22px] rounded-md bg-foreground motion-surface-interaction dark:bg-[#F3F4F6]" />
                </button>
              </DockTooltip>
            </div>
          </nav>
        </div>
      </div>
    </TooltipProvider>
  )
}

function DockContactPopover({
  open,
  onOpenChange,
  isActive,
  onTriggerRefChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  isActive: boolean
  onTriggerRefChange: (element: HTMLButtonElement | null) => void
}) {
  const popoverHandle = React.useMemo(() => createPopoverHandle(), [])
  const tooltipHandle = React.useMemo(() => createTooltipHandle(), [])
  const triggerId = "dock-contact-trigger"
  const emailLink = socialLinks.find((link) => link.label === "Email")
  const githubLink = socialLinks.find((link) => link.label === "GitHub")
  const linkedInLink = socialLinks.find((link) => link.label === "LinkedIn")
  const xLink = socialLinks.find((link) => link.label === "X")

  return (
    <>
      <Tooltip disabled={open} handle={tooltipHandle}>
        <TooltipContent sideOffset={14}>Contact</TooltipContent>
      </Tooltip>

      <Popover
        open={open}
        onOpenChange={onOpenChange}
        handle={popoverHandle}
        triggerId={triggerId}
      >
        <PopoverContent className={DOCK_POPOVER_SURFACE_CLASS}>
          <div className="flex flex-nowrap items-center justify-center gap-1 sm:gap-1.5">
            {emailLink ? (
              <ContactAction href={emailLink.href} label="Email me" />
            ) : null}
            {githubLink ? (
              <ContactAction href={githubLink.href} label="GitHub" />
            ) : null}
            {linkedInLink ? (
              <ContactAction href={linkedInLink.href} label="LinkedIn" />
            ) : null}
            {xLink ? <ContactAction href={xLink.href} label="X" /> : null}
          </div>
        </PopoverContent>
      </Popover>

      <PopoverTrigger handle={popoverHandle} id={triggerId}>
        <TooltipTrigger handle={tooltipHandle}>
          <button
            ref={onTriggerRefChange}
            type="button"
            aria-label="Open contact options"
            className={cn(
              "relative z-10 flex size-9 items-center justify-center rounded-xl bg-transparent text-muted-foreground motion-interactive-color outline-none hover:text-foreground focus-visible:text-foreground",
              isActive && "text-foreground"
            )}
          >
            <DockIcon icon={MailAtSign01Icon} />
          </button>
        </TooltipTrigger>
      </PopoverTrigger>
    </>
  )
}

function DockTooltip({
  children,
  label,
  shortcut,
}: {
  children: React.ReactElement
  label: string
  shortcut?: string
}) {
  return (
    <Tooltip>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent
        sideOffset={14}
        className="inline-flex flex-row items-center gap-2 whitespace-nowrap"
      >
        <span>{label}</span>
        {shortcut ? <Kbd>{shortcut}</Kbd> : null}
      </TooltipContent>
    </Tooltip>
  )
}

function DockIcon({
  icon,
}: {
  icon: Parameters<typeof HugeiconsIcon>[0]["icon"]
}) {
  return <HugeiconsIcon icon={icon} size={24} strokeWidth={1.7} />
}

function ContactAction({ href, label }: { href: string; label: string }) {
  const isExternal = href.startsWith("http")
  const isClientRoute = href.startsWith("/") || href.startsWith("#")

  if (isClientRoute) {
    return (
      <Link href={href} className={DOCK_CONTACT_ACTION_CLASS}>
        <span className="truncate">{label}</span>
      </Link>
    )
  }

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer noopener" : undefined}
      className={DOCK_CONTACT_ACTION_CLASS}
    >
      <span className="truncate">{label}</span>
    </a>
  )
}
```

## 7. Theme Provider Requirement

This dock expects `next-themes` to be active above it in the tree.

Typical setup in `app/layout.tsx`:

```tsx
import { ThemeProvider } from "@/components/theme-provider"
import { FloatingDock } from "@/components/floating-dock"

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
          <FloatingDock />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

If the target project does not use themes, remove:

- `useTheme`
- the theme button
- any dark-mode-specific class assumptions

## 8. Optional Sound Integration

The original portfolio plays subtle theme toggle sounds.

This is optional. The dock works fine without it.

If you want sound:

- add a `playSound()` helper
- add two sound assets
- call them before `setTheme(...)`

If you do not want sound, keep:

```ts
function handleThemeToggle() {
  setTheme(resolvedTheme === "dark" ? "light" : "dark")
}
```

## 9. How The Active Frame Works

The sliding highlight behind the dock items is not a separate component per item. It is a single absolutely positioned element that moves and resizes.

Implementation logic:

1. store refs for each dock trigger
2. compute the active item based on pathname or contact popover state
3. read `offsetLeft`, `offsetWidth`, and `offsetHeight`
4. position one shared frame with inline styles
5. animate movement with `motion-layout-frame`

This gives a cleaner result than toggling separate backgrounds on each item.

## 10. Why `pendingActiveKey` Exists

The dock uses:

```tsx
onPointerDownCapture={() => {
  setPendingActiveKey(item.key)
}}
```

This makes the active frame react immediately when the user presses a link, before the route change completes.

Without it, the dock can feel one beat late.

## 11. Why The Dock Uses A Layered Blur Field

The large hidden block behind the dock on `sm` screens and up is not decorative filler. It softens the region behind the dock with a stepped blur gradient.

That helps the dock feel anchored to the page without using a heavy shadow or a hard panel.

If the target project wants a simpler version, remove the entire layered backdrop block and keep only the dock surface.

## 12. Minimal Adaptation Checklist

When moving this dock to another project, update:

- nav labels
- nav routes
- contact links
- icon choice
- theme toggle behavior
- token names if the target design system differs

## 13. Common Failure Points

If the recreated dock feels wrong, check these first:

- missing `TooltipProvider`
- missing global motion utilities
- missing `next-themes` context
- missing `body` bottom padding, causing overlap with page content
- no `ResizeObserver` update path, causing the active frame to drift on resize
- wrong `position: fixed` or `z-index`
- token mismatch for `border`, `background`, `muted`, or `foreground`

## 14. Recommended Verification

After implementing the dock in the other project, verify:

- active frame follows route correctly
- contact popover opens and closes correctly
- tooltip delay feels responsive
- theme toggle works without hydration issues
- dock remains centered on mobile
- page content is not obscured at the bottom
- reduced-motion users do not get forced transitions

## 15. If You Want To Simplify It

The fastest simplification path is:

- remove the layered blur field
- remove sound
- replace Hugeicons with the target icon set
- keep only nav items and theme toggle

That keeps the character of the dock while reducing setup cost.
