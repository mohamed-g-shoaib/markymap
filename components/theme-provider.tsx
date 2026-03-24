"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useSound } from "@/hooks/use-sound";
import { clickSoftSound } from "@/lib/audio/click-soft";
import { switchOffSound } from "@/lib/audio/switch-off";
import { switchOnSound } from "@/lib/audio/switch-on";

const CLICKABLE_SELECTOR = [
  "a[href]",
  "button",
  "input:not([type='hidden'])",
  "select",
  "summary",
  "textarea",
  "[data-slot='button']",
  "[role='button']",
  "[role='link']",
  "[role='menuitem']",
  "[role='option']",
  "[role='radio']",
  "[role='switch']",
  "[role='tab']",
].join(", ");

function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      {...props}
    >
      <ClickSound />
      <ThemeHotkey />
      {children}
    </NextThemesProvider>
  );
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  return (
    target.isContentEditable ||
    target.tagName === "INPUT" ||
    target.tagName === "TEXTAREA" ||
    target.tagName === "SELECT"
  );
}

function isDisabledTarget(target: HTMLElement) {
  return (
    target.dataset.clickSound === "off" ||
    target.matches(":disabled, [aria-disabled='true'], [data-disabled]")
  );
}

function getClickableTarget(target: EventTarget | null) {
  if (!(target instanceof Element)) {
    return null;
  }

  const clickable = target.closest(CLICKABLE_SELECTOR);

  if (!(clickable instanceof HTMLElement) || isDisabledTarget(clickable)) {
    return null;
  }

  return clickable;
}

function ClickSound() {
  const [playClickSound] = useSound(clickSoftSound, { interrupt: true });

  const onClick = React.useEffectEvent((event: MouseEvent) => {
    if (!getClickableTarget(event.target)) {
      return;
    }

    playClickSound();
  });

  React.useEffect(() => {
    document.addEventListener("click", onClick, true);

    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  return null;
}

function ThemeHotkey() {
  const { resolvedTheme, setTheme } = useTheme();
  const [playSwitchOn] = useSound(switchOnSound, { interrupt: true });
  const [playSwitchOff] = useSound(switchOffSound, { interrupt: true });

  const toggleTheme = React.useEffectEvent(() => {
    if (resolvedTheme === "dark") {
      playSwitchOn();
      setTheme("light");
      return;
    }

    playSwitchOff();
    setTheme("dark");
  });

  React.useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.repeat) {
        return;
      }

      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }

      if (event.key.toLowerCase() !== "d") {
        return;
      }

      if (isTypingTarget(event.target)) {
        return;
      }

      toggleTheme();
    }

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return null;
}

export { ThemeProvider };
