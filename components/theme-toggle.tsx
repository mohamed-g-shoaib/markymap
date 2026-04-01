"use client"

import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { useSound } from "@/hooks/use-sound"
import { switchOffSound } from "@/lib/audio/switch-off"
import { switchOnSound } from "@/lib/audio/switch-on"
import { cn } from "@/lib/utils"

type ThemeToggleProps = {
  className?: string
  size?: React.ComponentProps<typeof Button>["size"]
  useSwitchSound?: boolean
}

function ThemeToggle({
  className,
  size = "icon-sm",
  useSwitchSound = false,
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const [playSwitchOn] = useSound(switchOnSound, { interrupt: true })
  const [playSwitchOff] = useSound(switchOffSound, { interrupt: true })
  const isDark = resolvedTheme === "dark"

  const handleToggleTheme = () => {
    if (useSwitchSound) {
      if (isDark) {
        playSwitchOn()
      } else {
        playSwitchOff()
      }
    }

    setTheme(isDark ? "light" : "dark")
  }

  return (
    <Button
      size={size}
      variant="outline"
      onClick={handleToggleTheme}
      data-click-sound={useSwitchSound ? "off" : undefined}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("relative", className)}
    >
      <span className="relative size-4">
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-[opacity,transform,filter] duration-180 ease-[cubic-bezier(0.2,0,0,1)]",
            isDark
              ? "blur-0 scale-100 opacity-100"
              : "scale-[0.25] opacity-0 blur-xs"
          )}
          aria-hidden="true"
        >
          <HugeiconsIcon icon={Moon02Icon} size={16} color="currentColor" />
        </span>
        <span
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-[opacity,transform,filter] duration-180 ease-[cubic-bezier(0.2,0,0,1)]",
            isDark
              ? "scale-[0.25] opacity-0 blur-xs"
              : "blur-0 scale-100 opacity-100"
          )}
          aria-hidden="true"
        >
          <HugeiconsIcon icon={Sun03Icon} size={16} color="currentColor" />
        </span>
      </span>
    </Button>
  )
}

export { ThemeToggle }
