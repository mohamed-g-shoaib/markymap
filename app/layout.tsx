import localFont from "next/font/local"
import { cookies } from "next/headers"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

type Theme = "light" | "dark" | "system"
type ResolvedTheme = "light" | "dark"

const THEME_COOKIE_KEY = "theme"
const RESOLVED_THEME_COOKIE_KEY = "theme-resolved"

function parseThemeCookie(value: string | undefined): Theme {
  if (value === "light" || value === "dark" || value === "system") {
    return value
  }

  return "system"
}

function parseResolvedThemeCookie(
  value: string | undefined
): ResolvedTheme | null {
  if (value === "light" || value === "dark") {
    return value
  }

  return null
}

const sans = localFont({
  src: "../public/fonts/google-sans-variable.ttf",
  variable: "--font-sans",
  display: "swap",
})

const mono = localFont({
  src: "../public/fonts/google-sans-code-variable.ttf",
  variable: "--font-mono",
  display: "swap",
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const initialTheme = parseThemeCookie(
    cookieStore.get(THEME_COOKIE_KEY)?.value
  )
  const initialResolvedTheme = parseResolvedThemeCookie(
    cookieStore.get(RESOLVED_THEME_COOKIE_KEY)?.value
  )
  const shouldUseDarkClass =
    initialTheme === "dark" ||
    (initialTheme === "system" && initialResolvedTheme === "dark")

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        mono.variable,
        "font-sans",
        sans.variable,
        shouldUseDarkClass && "dark"
      )}
    >
      <body suppressHydrationWarning>
        <ThemeProvider initialTheme={initialTheme}>{children}</ThemeProvider>
      </body>
    </html>
  )
}
