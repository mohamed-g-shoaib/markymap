"use client"

import * as React from "react"
import { useSound } from "@/hooks/use-sound"
import { clickSoftSound } from "@/lib/audio/click-soft"
import { drop001Sound } from "@/lib/audio/drop-001"
import { drop004Sound } from "@/lib/audio/drop-004"
import { switchOffSound } from "@/lib/audio/switch-off"
import { switchOnSound } from "@/lib/audio/switch-on"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

const THEME_STORAGE_KEY = "theme"

type ThemeContextValue = {
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
}

const ThemeContext = React.createContext<ThemeContextValue | null>(null)

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light"
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light"
}

function getStoredTheme(): Theme {
  if (typeof window === "undefined") {
    return "system"
  }

  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY)
    if (value === "light" || value === "dark" || value === "system") {
      return value
    }
  } catch {
    // Ignore storage failures.
  }

  return "system"
}

function applyTheme(resolvedTheme: ResolvedTheme) {
  const root = document.documentElement
  root.classList.toggle("dark", resolvedTheme === "dark")
  root.style.colorScheme = resolvedTheme
}

const CLICKABLE_SELECTOR = [
  "a[href]",
  "button",
  "input:not([type='hidden']):not([type='text']):not([type='search']):not([type='email']):not([type='url']):not([type='password']):not([type='tel'])",
  "summary",
  ".markmap-node > circle",
  "[data-slot='button']",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[role='option']",
  "[role='radio']",
  "[role='switch']",
  "[role='tab']",
].join(", ")

function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = React.useState<Theme>("system")
  const [resolvedTheme, setResolvedTheme] =
    React.useState<ResolvedTheme>("light")

  React.useEffect(() => {
    const initialTheme = getStoredTheme()
    const nextResolvedTheme =
      initialTheme === "system" ? getSystemTheme() : initialTheme

    setThemeState(initialTheme)
    setResolvedTheme(nextResolvedTheme)
    applyTheme(nextResolvedTheme)
  }, [])

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")

    function handleSystemThemeChange() {
      if (theme !== "system") {
        return
      }

      const nextResolvedTheme = getSystemTheme()
      setResolvedTheme(nextResolvedTheme)
      applyTheme(nextResolvedTheme)
    }

    mediaQuery.addEventListener("change", handleSystemThemeChange)

    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange)
    }
  }, [theme])

  const setTheme = React.useCallback((nextTheme: Theme) => {
    const nextResolvedTheme =
      nextTheme === "system" ? getSystemTheme() : nextTheme

    setThemeState(nextTheme)
    setResolvedTheme(nextResolvedTheme)
    applyTheme(nextResolvedTheme)

    try {
      localStorage.setItem(THEME_STORAGE_KEY, nextTheme)
    } catch {
      // Ignore storage failures.
    }
  }, [])

  const contextValue = React.useMemo(
    () => ({ resolvedTheme, setTheme }),
    [resolvedTheme, setTheme]
  )

  return (
    <ThemeContext.Provider value={contextValue}>
      <ClickSound />
      <ThemeHotkey />
      {children}
    </ThemeContext.Provider>
  )
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  )
}

function isDisabledTarget(target: Element) {
  return (
    target.getAttribute("data-click-sound") === "off" ||
    target.matches(":disabled, [aria-disabled='true'], [data-disabled]")
  )
}

function getClickableTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null
  }

  const clickable = target.closest(CLICKABLE_SELECTOR)

  if (!clickable || isDisabledTarget(clickable)) {
    return null
  }

  return clickable
}

function getMarkmapToggleTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null
  }

  const circle = target.closest(".markmap-node > circle")
  if (!(circle instanceof SVGCircleElement)) {
    return null
  }

  const nodeGroup = circle.closest("g.markmap-node")
  if (!(nodeGroup instanceof SVGGElement) || isDisabledTarget(nodeGroup)) {
    return null
  }

  return { circle, nodeGroup }
}

function ClickSound() {
  const [playClickSound] = useSound(clickSoftSound, { interrupt: true })
  const [playCollapseSound] = useSound(drop001Sound, { interrupt: true })
  const [playExpandSound] = useSound(drop004Sound, { interrupt: true })

  const onClick = React.useEffectEvent((event: MouseEvent) => {
    const markmapToggle = getMarkmapToggleTarget(event.target)
    if (markmapToggle) {
      const willExpand =
        markmapToggle.nodeGroup.classList.contains("markmap-fold")

      if (willExpand) {
        playExpandSound()
      } else {
        playCollapseSound()
      }

      return
    }

    if (!getClickableTarget(event.target)) {
      return
    }

    playClickSound()
  })

  React.useEffect(() => {
    document.addEventListener("click", onClick, true)

    return () => {
      document.removeEventListener("click", onClick, true)
    }
  }, [])

  return null
}

function ThemeHotkey() {
  const themeContext = React.useContext(ThemeContext)

  if (!themeContext) {
    throw new Error("ThemeHotkey must be used within ThemeProvider")
  }

  const { resolvedTheme, setTheme } = themeContext
  const [playSwitchOn] = useSound(switchOnSound, { interrupt: true })
  const [playSwitchOff] = useSound(switchOffSound, { interrupt: true })

  const toggleTheme = React.useEffectEvent(() => {
    if (resolvedTheme === "dark") {
      playSwitchOn()
      setTheme("light")
      return
    }

    playSwitchOff()
    setTheme("dark")
  })

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (event.key.toLowerCase() !== "d") {
        return
      }

      if (isTypingTarget(event.target)) {
        return
      }

      toggleTheme()
    }

    window.addEventListener("keydown", onKeyDown)

    return () => {
      window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  return null
}

export { ThemeProvider }
